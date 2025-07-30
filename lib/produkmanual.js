const admin = require('firebase-admin');
const moment = require('moment-timezone');
const crypto = require('crypto');

// Utility function untuk generate unique reference ID
function generateUniqueRefID() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Utility function untuk validasi ML nickname
async function validateMLNickname(userId, zoneId) {
  try {
    const fetch = require('node-fetch');
    const url = 'https://order-sg.codashop.com/validate';
    const country = "SG";

    const params = new URLSearchParams();
    params.append('country', country);
    params.append('userId', userId);
    params.append('voucherTypeName', "MOBILE_LEGENDS");
    params.append('zoneId', zoneId);

    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await response.json();
    return data.username || 'Unknown Player';
  } catch (error) {
    console.error('Error validating ML nickname:', error);
    return 'Unknown Player';
  }
}

// Fungsi untuk menangani case 'buy'
async function handleBuyCommand(args, sender, db, client, m, pendingTransactions, namaStore, global) {
  const nomor = sender.split('@')[0];
  const [kodeProduk, ...restArgs] = args;
  
  if (!kodeProduk) {
    return m.reply('❌ Format salah!\n\nContoh penggunaan:\n• *SL*: `.buy slbasic 123456789 1234 1`\n• *Lainnya*: `.buy voucher100k 1`');
  }

  try {
    // 1. Cek user terdaftar
    const userRef = db.collection('users').doc(nomor);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return m.reply('❌ Kamu belum terdaftar. Silakan ketik *Daftar*');
    }
    
    const userProfile = userDoc.data();
    let saldoAwal = parseFloat(userProfile.saldo);
    if (isNaN(saldoAwal)) {
      return m.reply('❌ Saldo kamu tidak valid. Hubungi admin.');
    }
    const role = userProfile.role?.toUpperCase() || 'BRONZE';

    // 2. Ambil data produk
    const produkRef = db.collection('produk_manual').doc(kodeProduk);
    const produkSnap = await produkRef.get();
    if (!produkSnap.exists) {
      return m.reply(`❌ Produk dengan kode "${kodeProduk}" tidak ditemukan.`);
    }
    
    const produkData = produkSnap.data();
    const tipe = (produkData.tipeProduk || '').toUpperCase();

    // 3. Parse argumen berdasarkan tipe
    let userId, zoneId, jumlah;
    if (tipe === 'SL') {
      if (restArgs.length < 3) {
        return m.reply('❌ Format untuk SL: `.buy kodeproduk userid zoneid jumlah`\nContoh: `.buy slbasic 123456789 1234 1`');
      }
      [userId, zoneId, jumlah] = restArgs;
      jumlah = parseInt(jumlah, 10);
      if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('❌ Jumlah harus angka positif.');
      }
    } else {
      if (restArgs.length < 1) {
        return m.reply('❌ Format: `.buy kodeproduk jumlah`\nContoh: `.buy voucher100k 1`');
      }
      jumlah = parseInt(restArgs[0], 10);
      if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('❌ Jumlah harus angka positif.');
      }
      userId = '-';
      zoneId = '-';
    }

    // 4. Cek harga & saldo
    const hargaPerItem = produkData.harga?.[role];
    if (!hargaPerItem || isNaN(hargaPerItem)) {
      return m.reply(`❌ Harga untuk role ${role} tidak tersedia untuk produk ini.`);
    }
    const baseTotal = hargaPerItem * jumlah;
    if (saldoAwal < baseTotal) {
      return m.reply(`❌ Saldo tidak mencukupi!\n\nSaldo kamu: Rp${saldoAwal.toLocaleString()}\nDibutuhkan: Rp${baseTotal.toLocaleString()}\nKurang: Rp${(baseTotal - saldoAwal).toLocaleString()}`);
    }

    // 5. Untuk SL: validasi nickname via API
    let nicknameUser = '-';
    if (tipe === 'SL') {
      nicknameUser = await validateMLNickname(userId, zoneId);
    }

    // 6. Cek stok available
    const stokCol = produkRef.collection('stok');
    const stokSnapAll = await stokCol.where('status', '==', 'tersedia').get();
    if (stokSnapAll.size < jumlah) {
      return m.reply(`❌ Stok tidak mencukupi!\n\nStok tersedia: ${stokSnapAll.size}\nDiminta: ${jumlah}`);
    }

    // 7. Generate transaction ID dan simpan ke pending
    const transactionId = generateUniqueRefID();
    const transactionData = {
      nomor,
      kodeProduk,
      produkData,
      tipe,
      userId,
      zoneId,
      jumlah,
      hargaPerItem,
      baseTotal,
      saldoAwal,
      role,
      nicknameUser,
      userRef,
      produkRef,
      timestamp: Date.now()
    };
    
    pendingTransactions.set(transactionId, transactionData);
    
    // Auto cleanup setelah 5 menit jika tidak dikonfirmasi
    setTimeout(() => {
      if (pendingTransactions.has(transactionId)) {
        pendingTransactions.delete(transactionId);
        console.log(`Transaction ${transactionId} auto-expired`);
      }
    }, 5 * 60 * 1000);

    // 8. Kirim konfirmasi dengan tombol interaktif
    let confirmText = `🛒 *KONFIRMASI PEMBELIAN*\n\n`;
    confirmText += `» *Produk* : ${produkData.namaProduk || kodeProduk}\n`;
    confirmText += `» *Tipe* : ${tipe}\n`;
    if (tipe === 'SL') {
      confirmText += `» *User ID* : ${userId}\n`;
      confirmText += `» *Zone ID* : ${zoneId}\n`;
      confirmText += `» *Nickname* : ${nicknameUser}\n`;
    }
    confirmText += `» *Jumlah* : ${jumlah}\n`;
    confirmText += `» *Harga/Item* : Rp${hargaPerItem.toLocaleString()}\n`;
    confirmText += `» *Total* : Rp${baseTotal.toLocaleString()}\n`;
    confirmText += `» *Saldo Kamu* : Rp${saldoAwal.toLocaleString()}\n`;
    confirmText += `» *Sisa Saldo* : Rp${(saldoAwal - baseTotal).toLocaleString()}\n\n`;
    confirmText += `⚠️ *Pastikan data sudah benar!*\n`;
    confirmText += `Konfirmasi dalam 5 menit atau transaksi dibatalkan otomatis.`;

    const interactiveMessage = {
      interactiveMessage: {
        header: {
          title: "🛒 Konfirmasi Pembelian",
          hasMediaAttachment: false
        },
        body: {
          text: confirmText
        },
        footer: {
          text: `© ${namaStore} - Secure Transaction`
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "✅ KONFIRMASI",
                id: `confirm_buy_${transactionId}`
              })
            },
            {
              name: "quick_reply", 
              buttonParamsJson: JSON.stringify({
                display_text: "❌ BATALKAN",
                id: `cancel_buy_${transactionId}`
              })
            }
          ]
        }
      }
    };

    await client.sendMessage(m.chat, interactiveMessage, { quoted: m });

  } catch (err) {
    console.error('Buy Error:', err);
    return m.reply('❌ Terjadi kesalahan saat memproses transaksi.');
  }
}

// Fungsi untuk menangani konfirmasi pembelian
async function handleConfirmBuy(body, sender, pendingTransactions, db, m, client, moment, admin, namaStore, global) {
  const transactionId = body.replace('confirm_buy_', '');
  
  // Cek apakah transaksi masih pending
  if (!pendingTransactions.has(transactionId)) {
    return m.reply('❌ Transaksi tidak ditemukan atau sudah kadaluarsa.');
  }

  const transactionData = pendingTransactions.get(transactionId);
  
  // Pastikan yang konfirmasi adalah user yang sama
  if (transactionData.nomor !== sender.split('@')[0]) {
    return m.reply('❌ Kamu tidak berhak mengkonfirmasi transaksi ini.');
  }

  // Proses transaksi
  try {
    const {
      nomor, kodeProduk, produkData, tipe, userId, zoneId, jumlah,
      hargaPerItem, baseTotal, saldoAwal, role, nicknameUser,
      userRef, produkRef
    } = transactionData;

    // Hapus dari pending
    pendingTransactions.delete(transactionId);

    // Cek ulang saldo user (mungkin berubah saat pending)
    const userDoc = await userRef.get();
    const currentSaldo = parseFloat(userDoc.data().saldo);
    if (currentSaldo < baseTotal) {
      return m.reply(`❌ *TRANSAKSI GAGAL*\n\nSaldo kamu berubah saat pending.\nSaldo sekarang: Rp${currentSaldo.toLocaleString()}\nDibutuhkan: Rp${baseTotal.toLocaleString()}`);
    }

    // Cek ulang stok (mungkin berkurang saat pending)
    const stokCol = produkRef.collection('stok');
    const stokSnapAll = await stokCol.where('status', '==', 'tersedia').get();
    if (stokSnapAll.size < jumlah) {
      return m.reply(`❌ *TRANSAKSI GAGAL*\n\nStok berkurang saat pending.\nStok tersedia: ${stokSnapAll.size}\nDiminta: ${jumlah}`);
    }

    // Proses transaksi
    const ref_id = transactionId;
    const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY');
    const time1 = moment.tz('Asia/Jakarta').format('HH:mm:ss');
    const pushname = m.pushName || '-';

    // Sort stok FIFO
    let stokDocs = stokSnapAll.docs;
    const firstData = stokDocs[0].data();
    if (firstData.ditambahkanPada && firstData.ditambahkanPada.toMillis) {
      stokDocs.sort((a, b) => {
        const timeA = a.data().ditambahkanPada.toMillis();
        const timeB = b.data().ditambahkanPada.toMillis();
        return timeA - timeB;
      });
    } else {
      console.log('Using default sort (document creation order)');
    }
    stokDocs = stokDocs.slice(0, jumlah);

    // Batch update
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let followStr = '';
    
    stokDocs.forEach((docSnap, idx) => {
      const docData = docSnap.data();
      let content = '';
      
      if (tipe === 'SL') {
        content = `${docData.email}:${docData.password}`;
      } else if (tipe === 'VOUCHER') {
        content = docData.kodeVoucher || docData.content || 'N/A';
      } else if (tipe === 'ACCOUNT') {
        content = `${docData.username}:${docData.password}`;
      } else {
        content = docData.content || docData.data || 'N/A';
      }
      
      followStr += `${idx + 1}. ${content}\n`;
      
      // Update status stok jadi terjual
      batch.update(docSnap.ref, {
        status: 'terjual',
        terjualPada: now,
        terjualKepada: nomor,
        refId: ref_id
      });
    });

    // Update user
    const saldoBaru = currentSaldo - baseTotal;
    batch.update(userRef, {
      saldo: saldoBaru,
      total_spend: admin.firestore.FieldValue.increment(baseTotal),
      jumlah_transaksi_sukses: admin.firestore.FieldValue.increment(1),
      lastOrderTime: now
    });

    // Update produk
    const prodUpdates = {};
    if (typeof produkData.stokTersedia === 'number') {
      prodUpdates.stokTersedia = admin.firestore.FieldValue.increment(-jumlah);
    }
    prodUpdates.terjual = admin.firestore.FieldValue.increment(jumlah);
    batch.update(produkRef, prodUpdates);

    // Simpan history transaksi
    const historyData = {
      tanggal: now,
      produk: produkData.namaProduk || kodeProduk,
      tipe: tipe,
      hargaPerItem: hargaPerItem,
      jumlah: jumlah,
      total: baseTotal,
      tujuan: tipe === 'SL' ? userId : null,
      zone: tipe === 'SL' ? zoneId : null,
      invoice: ref_id,
      status: 'Sukses',
      metode: 'Saldo',
      nicknameUser: nicknameUser
    };
    const histRef = userRef.collection('transactions').doc(ref_id);
    batch.set(histRef, historyData);

    // History umum
    const umumRef = db.collection('history_trx').doc(ref_id);
    batch.set(umumRef, {
      nomor,
      invoice: ref_id,
      produk: kodeProduk,
      tipe: tipe,
      tujuan: tipe === 'SL' ? userId : null,
      harga: hargaPerItem,
      jumlah: jumlah,
      total: baseTotal,
      waktu: now,
      status: 'Sukses',
      metode: 'Saldo',
      nicknameUser: nicknameUser
    });

    // Commit batch
    await batch.commit();

    // Kirim hasil
    let successMsg = `✅ *TRANSAKSI BERHASIL*\n\n`;
    successMsg += `📦 *Detail Pesanan:*\n`;
    successMsg += `» Ref ID: ${ref_id}\n`;
    successMsg += `» Produk: ${produkData.namaProduk || kodeProduk}\n`;
    successMsg += `» Jumlah: ${jumlah}\n`;
    successMsg += `» Total: Rp${baseTotal.toLocaleString()}\n`;
    successMsg += `» Tanggal: ${hariini}\n`;
    successMsg += `» Waktu: ${time1}\n\n`;
    
    if (tipe === 'SL') {
      successMsg += `🎮 *Detail Game:*\n`;
      successMsg += `» User ID: ${userId}\n`;
      successMsg += `» Zone ID: ${zoneId}\n`;
      successMsg += `» Nickname: ${nicknameUser}\n\n`;
    }
    
    successMsg += `🎁 *Data yang Diterima:*\n${followStr}\n`;
    successMsg += `💰 *Sisa Saldo: Rp${saldoBaru.toLocaleString()}*\n\n`;
    successMsg += `Terima kasih telah berbelanja! 🙏`;

    await m.reply(successMsg);

    // Notifikasi ke owner
    let notifOwner = `*TRANSAKSI SUKSES ⚡*\n\n`;
    notifOwner += `*» Nama :* ${pushname}\n`;
    notifOwner += `*» Nomor :* ${nomor}\n`;
    notifOwner += `*» Produk :* ${kodeProduk}\n`;
    if (tipe === 'SL') {
      notifOwner += `*» Tujuan* : ${userId}\n*» Nickname ML* : ${nicknameUser}\n`;
    }
    notifOwner += `*» Harga* : Rp${hargaPerItem.toLocaleString()}\n`;
    notifOwner += `*» Jumlah* : ${jumlah}\n`;
    notifOwner += `*» Total* : Rp${baseTotal.toLocaleString()}\n`;
    notifOwner += `*» Sisa Saldo* : Rp${saldoBaru.toLocaleString()}\n\n`;
    notifOwner += `*Data:*\n${followStr}`;
    
    if (global && global.owner) {
      for (const own of global.owner) {
        await client.sendMessage(own + '@s.whatsapp.net', { text: notifOwner });
      }
    }

  } catch (err) {
    console.error('Confirm Buy Error:', err);
    return m.reply('❌ Terjadi kesalahan saat memproses konfirmasi transaksi.');
  }
}

// Fungsi untuk menangani pembatalan pembelian
async function handleCancelBuy(buttonId, sender, pendingTransactions, m) {
  const transactionId = buttonId.replace('cancel_buy_', '');
  
  if (!pendingTransactions.has(transactionId)) {
    return m.reply('❌ Transaksi tidak ditemukan atau sudah kadaluarsa.');
  }

  const transactionData = pendingTransactions.get(transactionId);
  
  if (transactionData.nomor !== sender.split('@')[0]) {
    return m.reply('❌ Kamu tidak berhak membatalkan transaksi ini.');
  }

  // Hapus dari pending
  pendingTransactions.delete(transactionId);
  
  return m.reply('✅ *TRANSAKSI DIBATALKAN*\n\nTransaksi telah berhasil dibatalkan.');
}

// Fungsi untuk menangani case 'addproduk'
async function handleAddProduk(body, isOwner, db, admin, m) {
  if (!isOwner) {
    return m.reply('❌ Hanya owner yang bisa menambahkan produk.');
  }

  // Regex untuk parsing format addproduk
  // Format: addproduk kodeproduk "nama produk" tipeproduk harga_owner harga_gold harga_silver harga_bronze ["note"]
  const regex = /^addproduk\s+(\S+)\s+"([^"]+)"\s+(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)(?:\s+"([^"]+)")?$/i;
  const match = body.match(regex);
  
  if (!match) {
    return m.reply(
      `❌ *Format salah!*\n\n` +
      `📝 *Format yang benar:*\n` +
      `\`addproduk kodeproduk "Nama Produk" TIPE harga_owner harga_gold harga_silver harga_bronze\`\n\n` +
      `📋 *Contoh tanpa note:*\n` +
      `\`addproduk slbasic "Starlight Basic" SL 25000 27500 28000 30000\`\n\n` +
      `📋 *Contoh dengan note:*\n` +
      `\`addproduk slbasic "Starlight Basic" SL 25000 27500 28000 30000 "Keterangan tambahan"\`\n\n` +
      `🏷️ *Tipe yang tersedia:* SL, VOUCHER, ACCOUNT, OTHER`
    );
  }

  const [
    ,
    kodeProdukRaw,
    namaProduk,
    tipeProdukRaw,
    hargaOwnerStr,
    hargaGoldStr,
    hargaSilverStr,
    hargaBronzeStr,
    noteRaw
  ] = match;

  // Validasi input
  const kodeProduk = kodeProdukRaw.toLowerCase();
  const tipeProduk = tipeProdukRaw.toUpperCase();
  const allowedTypes = ['SL', 'VOUCHER', 'ACCOUNT', 'OTHER'];
  
  if (!allowedTypes.includes(tipeProduk)) {
    return m.reply(`❌ *Tipe produk tidak valid!*\n\n🏷️ *Tipe yang tersedia:* ${allowedTypes.join(', ')}`);
  }

  // Parse harga
  const hargaOwner = parseInt(hargaOwnerStr, 10);
  const hargaGold = parseInt(hargaGoldStr, 10);
  const hargaSilver = parseInt(hargaSilverStr, 10);
  const hargaBronze = parseInt(hargaBronzeStr, 10);
  
  if ([hargaOwner, hargaGold, hargaSilver, hargaBronze].some(isNaN)) {
    return m.reply('❌ *Harga harus berupa angka bulat!*');
  }

  // Validasi urutan harga (Owner harus termurah)
  if (hargaOwner > hargaGold || hargaGold > hargaSilver || hargaSilver > hargaBronze) {
    return m.reply(
      `❌ *Urutan harga tidak valid!*\n\n` +
      `📊 *Urutan yang benar:*\n` +
      `Owner ≤ Gold ≤ Silver ≤ Bronze\n\n` +
      `💰 *Harga yang diinput:*\n` +
      `• Owner: Rp${hargaOwner.toLocaleString()}\n` +
      `• Gold: Rp${hargaGold.toLocaleString()}\n` +
      `• Silver: Rp${hargaSilver.toLocaleString()}\n` +
      `• Bronze: Rp${hargaBronze.toLocaleString()}`
    );
  }

  // Note optional
  const note = noteRaw ? noteRaw.trim() : '';

  try {
    // Cek apakah produk sudah ada
    const produkRef = db.collection('produk_manual').doc(kodeProduk);
    const existingProduk = await produkRef.get();
    
    if (existingProduk.exists) {
      return m.reply(`❌ *Produk dengan kode "${kodeProduk}" sudah ada!*\n\nGunakan kode produk yang berbeda.`);
    }

    // Buat produk baru
    await produkRef.set({
      namaProduk,
      tipeProduk,
      aktif: true,
      harga: {
        OWNER: hargaOwner,
        GOLD: hargaGold,
        SILVER: hargaSilver,
        BRONZE: hargaBronze
      },
      terjual: 0,
      stokTersedia: 0,
      stokCounter: 0,
      note: note,
      dibuatPada: admin.firestore.FieldValue.serverTimestamp()
    });

    // Success message
    let successMsg = `✅ *PRODUK BERHASIL DITAMBAHKAN*\n\n`;
    successMsg += `📦 *Detail Produk:*\n`;
    successMsg += `• Kode: \`${kodeProduk}\`\n`;
    successMsg += `• Nama: ${namaProduk}\n`;
    successMsg += `• Tipe: ${tipeProduk}\n\n`;
    successMsg += `💰 *Harga per Role:*\n`;
    successMsg += `• Owner: Rp${hargaOwner.toLocaleString()}\n`;
    successMsg += `• Gold: Rp${hargaGold.toLocaleString()}\n`;
    successMsg += `• Silver: Rp${hargaSilver.toLocaleString()}\n`;
    successMsg += `• Bronze: Rp${hargaBronze.toLocaleString()}\n`;
    
    if (note) {
      successMsg += `\n📝 *Note:* ${note}`;
    }
    
    successMsg += `\n\n📋 *Langkah selanjutnya:*\n`;
    successMsg += `• Gunakan \`addstok ${kodeProduk} <data>\` untuk menambah stok\n`;
    successMsg += `• Gunakan \`stok\` untuk melihat daftar produk`;

    return m.reply(successMsg);

  } catch (err) {
    console.error('Add Produk Error:', err);
    return m.reply('❌ Terjadi kesalahan saat menambahkan produk. Coba lagi atau hubungi admin.');
  }
}

module.exports = {
  handleBuyCommand,
  handleConfirmBuy,
  handleCancelBuy,
  handleAddProduk,
  generateUniqueRefID,
  validateMLNickname
};
