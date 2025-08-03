const H2HTransactionHandler = require('./h2hHandler');
const { getProductsByCategory, getAvailableCategories, getProductByAlias, getMatchingProducts, getOrderFormat, getContoh } = require('./productMapping');
const { digiflazz } = require('../db/config');
const moment = require('moment-timezone');

// Inisialisasi H2H Handler (akan diinisialisasi saat dibutuhkan)
let h2hHandler = null;

function getH2HHandler(db) {
  if (!h2hHandler && digiflazz) {
    h2hHandler = new H2HTransactionHandler(digiflazz, db);
  }
  return h2hHandler;
}

/**
 * Handle command order - pembelian produk H2H
 * Format: order KODE_PRODUK NOMOR_TUJUAN
 */
async function handleOrder(body, sender, db, m) {
  try {
    const handler = getH2HHandler(db);
    if (!handler) {
      return m.reply('❌ Konfigurasi H2H belum diatur. Hubungi admin.');
    }

    // Parse command
    const parts = body.trim().split(/\s+/);
    if (parts.length < 3) {
      return m.reply('❌ Format salah!\n\n💡 *Format:* order KODE_PRODUK NOMOR_TUJUAN\n📝 *Contoh:* order ptl 08123456789');
    }

    const productCode = parts[1].toLowerCase();
    const customerNo = parts[2];

    // Validasi produk exists
    const product = getProductByAlias(productCode);
    if (!product) {
      return m.reply(`❌ Produk "${productCode}" tidak ditemukan.\n\n💡 Ketik *produk* untuk melihat daftar produk H2H.`);
    }

    // Simulasi user profile (dalam implementasi nyata, ambil dari database)
    const userProfile = {
      role: 'BRONZE', // atau role sesuai database user
      saldo: 100000 // atau saldo sesuai database user
    };

    // Proses pembelian
    const result = await handler.processPurchase(productCode, customerNo, sender, userProfile);

    if (result.success) {
      const successMsg = `✅ *PEMBELIAN BERHASIL*\n\n` +
        `📦 Produk: ${result.productName}\n` +
        `🎯 Tujuan: ${customerNo}\n` +
        `💰 Harga: Rp ${result.totalPrice.toLocaleString()}\n` +
        `🆔 Ref ID: ${result.refId}\n` +
        `⏰ Waktu: ${moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}\n\n` +
        `📝 Status akan diupdate otomatis saat transaksi selesai diproses.`;
      
      return m.reply(successMsg);
    } else {
      return m.reply(`❌ *PEMBELIAN GAGAL*\n\n${result.message}`);
    }

  } catch (error) {
    console.error('Error handleOrder:', error);
    return m.reply('❌ Terjadi kesalahan sistem saat memproses pembelian.');
  }
}

/**
 * Handle command cek - cek status transaksi H2H
 * Format: cek REF_ID
 */
async function handleCek(body, sender, db, m) {
  try {
    const handler = getH2HHandler(db);
    if (!handler) {
      return m.reply('❌ Konfigurasi H2H belum diatur. Hubungi admin.');
    }

    // Parse command
    const parts = body.trim().split(/\s+/);
    if (parts.length < 2) {
      return m.reply('❌ Format salah!\n\n💡 *Format:* cek REF_ID\n📝 *Contoh:* cek T123456789');
    }

    const refId = parts[1];

    // Cek status transaksi
    const result = await handler.checkTransactionStatus(refId);

    return m.reply(result.message);

  } catch (error) {
    console.error('Error handleCek:', error);
    return m.reply('❌ Terjadi kesalahan sistem saat mengecek status transaksi.');
  }
}

/**
 * Handle command riwayat - riwayat transaksi H2H user
 * Format: riwayat
 */
async function handleRiwayat(body, sender, db, m) {
  try {
    const handler = getH2HHandler(db);
    if (!handler) {
      return m.reply('❌ Konfigurasi H2H belum diatur. Hubungi admin.');
    }

    // Ambil riwayat transaksi user
    const result = await handler.getTransactionHistory(sender, 10);

    return m.reply(result.message);

  } catch (error) {
    console.error('Error handleRiwayat:', error);
    return m.reply('❌ Terjadi kesalahan sistem saat mengambil riwayat transaksi.');
  }
}

/**
 * Handle command produk - menampilkan daftar produk H2H dengan harga
 * Format: produk [kategori] atau produk [alias] untuk detail
 */
async function handleProduk(body, sender, db, m) {
  try {
    const parts = body.trim().split(/\s+/);
    const filter = parts[1] ? parts[1].toLowerCase() : null;
    
    // Jika ada filter dan itu adalah alias yang valid, tampilkan detail produk dengan harga
    if (filter && getProductByAlias(filter)) {
      return await showProductDetails(filter, sender, db, m);
    }
    
    // Jika tidak, tampilkan daftar produk seperti sebelumnya
    const availableCategories = getAvailableCategories();
    let products = [];
    
    const filterCategory = filter;
    
    if (filterCategory) {
      // Filter berdasarkan kategori tertentu (case insensitive)
      products = getProductsByCategory(filterCategory);
      if (products.length === 0) {
        return m.reply(`❌ Kategori "${filterCategory}" tidak ditemukan.\n\n📋 *Kategori tersedia:*\n${availableCategories.join(', ')}`);
      }
    } else {
      // Ambil semua produk
      for (const category of availableCategories) {
        const categoryProducts = getProductsByCategory(category);
        products.push(...categoryProducts);
      }
    }
    
    if (products.length === 0) {
      return m.reply('❌ Belum ada produk H2H yang tersedia.');
    }
    
    // Grup produk berdasarkan kategori
    const productGroups = {};
    products.forEach(product => {
      if (!productGroups[product.category]) {
        productGroups[product.category] = [];
      }
      productGroups[product.category].push(product);
    });
    
    let productMsg = `📦 *DAFTAR PRODUK H2H*\n\n`;
    
    if (filterCategory) {
      productMsg = `📦 *PRODUK ${filterCategory.toUpperCase()}*\n\n`;
    }
    
    Object.entries(productGroups).forEach(([category, categoryProducts]) => {
      productMsg += `🏷️ *${category.toUpperCase()}*\n`;
      
      // Grup produk berdasarkan brand
      const brandGroups = {};
      categoryProducts.forEach(product => {
        if (!brandGroups[product.brand]) {
          brandGroups[product.brand] = [];
        }
        brandGroups[product.brand].push(product.alias);
      });
      
      Object.entries(brandGroups).forEach(([brand, aliases]) => {
        productMsg += `  📱 ${brand}: ${aliases.join(', ')}\n`;
      });
      
      productMsg += `\n`;
    });
    
    productMsg += `💡 *Cara lihat harga:* produk ALIAS_PRODUK\n`;
    productMsg += `📝 *Contoh:* produk ml (untuk lihat harga Mobile Legends)\n`;
    productMsg += `💰 *Cara order:* order KODE_PRODUK NOMOR_TUJUAN\n\n`;
    productMsg += `📋 *Kategori tersedia:* ${availableCategories.join(', ')}`;
    
    return m.reply(productMsg);
    
  } catch (error) {
    console.error('Error handleProduk:', error);
    return m.reply('❌ Terjadi kesalahan sistem saat mengambil daftar produk.');
  }
}

/**
 * Menampilkan detail produk dengan harga seperti case 'show' di neko.js
 */
async function showProductDetails(aliasKey, sender, db, m) {
  try {
    // Gunakan margin default jika tidak ada konfigurasi
    const marginSilver = 0.05; // 5%
    const marginGold = 0.03; // 3%
    const marginOwner = 0.01; // 1%
    
    // Ambil data produk yang matching dari datadigi.json
    const matchingProducts = getMatchingProducts(aliasKey);
    
    if (matchingProducts.length === 0) {
      return m.reply(`❌ Tidak ada produk ditemukan untuk "${aliasKey}".\n\nℹ️ Pastikan file ./db/datadigi.json tersedia dan alias produk sesuai dengan mapping.`);
    }

    const aliasInfo = getProductByAlias(aliasKey);
    const formatOrder = getOrderFormat(aliasKey);
    const contohOrder = getContoh(aliasKey);

    // Ambil data user untuk menentukan role (simulasi, dalam implementasi nyata ambil dari Firestore)
    const nomor = sender.split("@")[0];
    let userData = { role: 'BRONZE' }; // Default role
    
    try {
      const userRef = db.collection('users').doc(nomor);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        userData = userDoc.data();
      }
    } catch (error) {
      console.log('Warning: Could not fetch user data, using default role');
    }

    let formattedResponse = `━═━═━┤❄️ *${aliasInfo.brand}* ├━═━═━\n\n*Status* : ✅ = Ready\n*Status* : ❌ = Close\n*Order Dengan format* :\n\`order ${formatOrder}\`\n*Contoh* :\n${contohOrder}\n━━═━═━━═━═━━═━═━━═━═━━═━═━━\n`;

    // Loop through matching products dan tampilkan harga seperti di case 'show'
    matchingProducts.forEach(product => {
      const originalPrice = parseFloat(product.price || 0);
      if (isNaN(originalPrice) || originalPrice === 0) return;

      const statusEmoji = product.seller_product_status && product.buyer_product_status ? '✅' : '❌';

      const hargaSilver = Math.floor(originalPrice * (1 + marginSilver)).toLocaleString();
      const hargaGold = Math.floor(originalPrice * (1 + marginGold)).toLocaleString();
      const hargaOwner = Math.floor(originalPrice * (1 + marginOwner)).toLocaleString();

      // Awal teks produk
      formattedResponse += `\n❄️ *${product.product_name}*\n`;

      // Harga ditampilkan sesuai role
      if (["BRONZE", "SILVER", "GOLD"].includes(userData.role)) {
        formattedResponse += `> Harga Silver : Rp. ${hargaSilver}\n`;
        formattedResponse += `> Harga Gold : Rp. ${hargaGold}\n`;
      } else if (userData.role === "OWNER") {
        formattedResponse += `> Harga Silver : Rp. ${hargaSilver}\n`;
        formattedResponse += `> Harga Gold : Rp. ${hargaGold}\n`;
        formattedResponse += `> Harga Owner : Rp. ${hargaOwner}\n`;
      }

      formattedResponse += `> Kode : \`${product.buyer_sku_code}\`\n`;
      formattedResponse += `> Status : ${statusEmoji}\n┈ׅ──ׄ─꯭─꯭──────꯭ׄ──ׅ┈\n`;
    });

    return m.reply(formattedResponse);
    
  } catch (error) {
    console.error('Error showProductDetails:', error);
    return m.reply('❌ Terjadi kesalahan saat menampilkan detail produk.');
  }
}

module.exports = {
  handleOrder,
  handleCek,
  handleRiwayat,
  handleProduk
};
