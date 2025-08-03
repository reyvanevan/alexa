const DigiflazzAPI = require('./digiflazz');
const { getProductByAlias, validateCustomerNumber } = require('./productMapping');
const moment = require('moment-timezone');

/**
 * H2H Transaction Handler untuk integrasi dengan Digiflazz
 */
class H2HTransactionHandler {
  constructor(digiflazzConfig, firebaseDb) {
    this.digiflazz = new DigiflazzAPI(
      digiflazzConfig.username,
      digiflazzConfig.apiKey,
      digiflazzConfig.baseUrl
    );
    this.db = firebaseDb;
  }

  /**
   * Generate unique reference ID untuk transaksi
   * @returns {string} Reference ID unik
   */
  generateRefId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRX${timestamp}${random}`;
  }

  /**
   * Proses pembelian produk H2H
   * @param {string} localProductCode - Kode produk di database lokal
   * @param {string} customerNo - Nomor tujuan/customer
   * @param {string} buyerPhoneNumber - Nomor pembeli
   * @param {object} userProfile - Profile user dari database
   * @returns {Promise<object>} Result transaksi
   */
  async processPurchase(localProductCode, customerNo, buyerPhoneNumber, userProfile) {
    try {
      // 1. Validasi produk exists di mapping
      const product = getProductByAlias(localProductCode);
      if (!product) {
        return {
          success: false,
          message: `Produk ${localProductCode} tidak ditemukan dalam mapping H2H`,
          code: 'PRODUCT_NOT_FOUND'
        };
      }

      // 2. Validasi kategori dan nomor customer
      const validation = validateCustomerNumber(product.category, customerNo);
      if (!validation.valid) {
        return {
          success: false,
          message: validation.message,
          code: 'INVALID_CUSTOMER_NUMBER'
        };
      }

      // 3. Format nomor customer
      const formattedCustomerNo = this.formatCustomerNumber(product.category, customerNo);

      // 4. Generate reference ID
      const refId = this.generateRefId();

      // 5. Ambil data produk dari database lokal untuk cek harga
      const productDoc = await this.db.collection('produk_manual').doc(localProductCode).get();
      if (!productDoc.exists) {
        return {
          success: false,
          message: `Produk ${localProductCode} tidak ditemukan di database`,
          code: 'PRODUCT_NOT_FOUND_DB'
        };
      }

      const productData = productDoc.data();
      
      // 6. Tentukan harga berdasarkan role user
      const userRole = (userProfile.role || 'BRONZE').toString().toUpperCase();
      const roleKey = ['OWNER', 'GOLD', 'SILVER', 'BRONZE'].includes(userRole) ? userRole : 'BRONZE';
      const price = productData.harga && productData.harga[roleKey] ? productData.harga[roleKey] : 0;

      if (price <= 0) {
        return {
          success: false,
          message: `Harga produk ${localProductCode} untuk role ${roleKey} tidak ditemukan`,
          code: 'PRICE_NOT_FOUND'
        };
      }

      // 7. Cek saldo user (jika menggunakan sistem saldo)
      if (userProfile.saldo && userProfile.saldo < price) {
        return {
          success: false,
          message: `Saldo tidak mencukupi. Dibutuhkan: Rp ${price.toLocaleString()}, Saldo: Rp ${userProfile.saldo.toLocaleString()}`,
          code: 'INSUFFICIENT_BALANCE'
        };
      }

      // 8. Simpan transaksi ke database dengan status PENDING
      const transactionData = {
        refId: refId,
        localProductCode: localProductCode,
        digiflazzSku: product.sku,
        customerNo: formattedCustomerNo,
        buyerPhoneNumber: buyerPhoneNumber,
        price: price,
        userRole: roleKey,
        category: product.category,
        brand: product.brand,
        type: product.type,
        status: 'PENDING',
        createdAt: moment().tz('Asia/Jakarta').toDate(),
        updatedAt: moment().tz('Asia/Jakarta').toDate()
      };

      await this.db.collection('transactions_h2h').doc(refId).set(transactionData);

      // 9. Kirim request ke Digiflazz
      const digiflazzResponse = await this.digiflazz.createTransaction(
        product.sku,
        formattedCustomerNo,
        refId,
        false // production mode
      );

      // 10. Update status berdasarkan response Digiflazz
      let finalStatus = 'PENDING';
      let responseMessage = 'Transaksi sedang diproses';

      if (digiflazzResponse.data) {
        const data = digiflazzResponse.data;
        
        if (data.status === 'Sukses') {
          finalStatus = 'SUCCESS';
          responseMessage = 'Transaksi berhasil diproses';
          
          // Update stok jika sukses
          await this.updateProductStock(localProductCode, 'sold');
          
          // Kurangi saldo user jika menggunakan sistem saldo
          if (userProfile.saldo !== undefined) {
            const newBalance = userProfile.saldo - price;
            await this.db.collection('users').doc(buyerPhoneNumber.split('@')[0]).update({
              saldo: newBalance
            });
          }
          
        } else if (data.status === 'Gagal') {
          finalStatus = 'FAILED';
          responseMessage = data.message || 'Transaksi gagal diproses';
        }
        
        // Update data transaksi dengan response dari Digiflazz
        await this.db.collection('transactions_h2h').doc(refId).update({
          status: finalStatus,
          digiflazzResponse: data,
          digiflazzTrxId: data.trx_id || null,
          serialNumber: data.sn || null,
          message: responseMessage,
          updatedAt: moment().tz('Asia/Jakarta').toDate()
        });
      }

      return {
        success: finalStatus === 'SUCCESS',
        message: responseMessage,
        code: finalStatus,
        refId: refId,
        data: digiflazzResponse.data || null
      };

    } catch (error) {
      console.error('H2H Purchase Error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan sistem saat memproses transaksi',
        code: 'SYSTEM_ERROR',
        error: error.message
      };
    }
  }

  /**
   * Cek status transaksi
   * @param {string} refId - Reference ID transaksi
   * @returns {Promise<object>} Status transaksi
   */
  async checkTransactionStatus(refId) {
    try {
      // 1. Ambil data transaksi dari database
      const transactionDoc = await this.db.collection('transactions_h2h').doc(refId).get();
      if (!transactionDoc.exists) {
        return {
          success: false,
          message: 'Transaksi tidak ditemukan',
          code: 'TRANSACTION_NOT_FOUND'
        };
      }

      const transactionData = transactionDoc.data();

      // 2. Jika status masih PENDING, cek ke Digiflazz
      if (transactionData.status === 'PENDING') {
        const statusResponse = await this.digiflazz.checkTransactionStatus(
          transactionData.digiflazzSku,
          transactionData.customerNo,
          refId
        );

        if (statusResponse.data) {
          const data = statusResponse.data;
          let newStatus = transactionData.status;

          if (data.status === 'Sukses') {
            newStatus = 'SUCCESS';
            // Update stok jika belum diupdate
            if (transactionData.status === 'PENDING') {
              await this.updateProductStock(transactionData.localProductCode, 'sold');
            }
          } else if (data.status === 'Gagal') {
            newStatus = 'FAILED';
          }

          // Update status di database
          await this.db.collection('transactions_h2h').doc(refId).update({
            status: newStatus,
            digiflazzResponse: data,
            digiflazzTrxId: data.trx_id || transactionData.digiflazzTrxId,
            serialNumber: data.sn || transactionData.serialNumber,
            message: data.message || transactionData.message,
            updatedAt: moment().tz('Asia/Jakarta').toDate()
          });

          transactionData.status = newStatus;
          transactionData.digiflazzResponse = data;
        }
      }

      return {
        success: true,
        data: transactionData
      };

    } catch (error) {
      console.error('Check Transaction Status Error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengecek status transaksi',
        code: 'SYSTEM_ERROR'
      };
    }
  }

  /**
   * Format nomor customer berdasarkan kategori
   * @param {string} category - Kategori produk
   * @param {string} customerNo - Nomor customer
   * @returns {string} Nomor yang sudah diformat
   */
  formatCustomerNumber(category, customerNo) {
    if (category === 'PULSA' || category === 'DATA' || category === 'EWALLET' || 
        category === 'CALL_SMS' || category === 'MASA_AKTIF') {
      return this.digiflazz.formatPhoneNumber(customerNo);
    }
    
    // Untuk PLN, Games, dan Voucher, hapus karakter non-digit saja
    return customerNo.replace(/\D/g, '');
  }

  /**
   * Update stok produk setelah transaksi
   * @param {string} localProductCode - Kode produk lokal
   * @param {string} action - Aksi (sold/returned)
   */
  async updateProductStock(localProductCode, action = 'sold') {
    try {
      const productRef = this.db.collection('produk_manual').doc(localProductCode);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const currentData = productDoc.data();
        const currentSold = typeof currentData.terjual === 'number' ? currentData.terjual : 0;
        
        let newSoldCount = currentSold;
        if (action === 'sold') {
          newSoldCount = currentSold + 1;
        } else if (action === 'returned' && currentSold > 0) {
          newSoldCount = currentSold - 1;
        }
        
        await productRef.update({
          terjual: newSoldCount,
          updatedAt: moment().tz('Asia/Jakarta').toDate()
        });
      }
    } catch (error) {
      console.error('Update Product Stock Error:', error);
    }
  }

  /**
   * Ambil riwayat transaksi user
   * @param {string} buyerPhoneNumber - Nomor pembeli
   * @param {number} limit - Batas jumlah data
   * @returns {Promise<object>} Riwayat transaksi
   */
  async getUserTransactionHistory(buyerPhoneNumber, limit = 10) {
    try {
      const snapshot = await this.db.collection('transactions_h2h')
        .where('buyerPhoneNumber', '==', buyerPhoneNumber)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const transactions = [];
      snapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      console.error('Get Transaction History Error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengambil riwayat transaksi'
      };
    }
  }
}

module.exports = H2HTransactionHandler;
