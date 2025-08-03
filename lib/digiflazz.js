const crypto = require('crypto');
const axios = require('axios');

/**
 * Digiflazz API Library untuk integrasi H2H
 * Dokumentasi: https://developer.digiflazz.com/
 */
class DigiflazzAPI {
  constructor(username, apiKey, baseUrl = 'https://api.digiflazz.com/v1') {
    this.username = username;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Generate signature untuk autentikasi API
   * @param {string} refId - Reference ID untuk transaksi
   * @returns {string} MD5 signature
   */
  generateSignature(refId) {
    const data = this.username + this.apiKey + refId;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Membuat request ke API Digiflazz
   * @param {string} endpoint - API endpoint
   * @param {object} data - Data payload
   * @returns {Promise} Response dari API
   */
  async makeRequest(endpoint, data) {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 detik timeout
      });
      return response.data;
    } catch (error) {
      console.error('Digiflazz API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cek saldo akun Digiflazz
   * @returns {Promise<object>} Data saldo
   */
  async checkBalance() {
    const refId = 'BAL' + Date.now();
    const signature = this.generateSignature(refId);
    
    const payload = {
      cmd: 'deposit',
      username: this.username,
      sign: signature,
      ref_id: refId
    };

    return await this.makeRequest('/cek-saldo', payload);
  }

  /**
   * Mendapatkan daftar produk dari Digiflazz
   * @param {string} filterType - Filter produk (optional: 'Pulsa', 'Data', 'PLN', dll)
   * @returns {Promise<object>} Daftar produk
   */
  async getProducts(filterType = null) {
    const refId = 'PROD' + Date.now();
    const signature = this.generateSignature(refId);
    
    const payload = {
      cmd: 'prepaid',
      username: this.username,
      sign: signature,
      ref_id: refId
    };

    if (filterType) {
      payload.filter_type = filterType;
    }

    return await this.makeRequest('/price-list', payload);
  }

  /**
   * Melakukan transaksi pembelian
   * @param {string} buyerSkuCode - SKU code produk
   * @param {string} customerNo - Nomor customer/tujuan
   * @param {string} refId - Reference ID unik
   * @param {boolean} testing - Mode testing (default: false)
   * @returns {Promise<object>} Response transaksi
   */
  async createTransaction(buyerSkuCode, customerNo, refId, testing = false) {
    const signature = this.generateSignature(refId);
    
    const payload = {
      username: this.username,
      buyer_sku_code: buyerSkuCode,
      customer_no: customerNo,
      ref_id: refId,
      sign: signature
    };

    // Jika dalam mode testing, gunakan endpoint yang berbeda
    const endpoint = testing ? '/transaction' : '/transaction';
    
    return await this.makeRequest(endpoint, payload);
  }

  /**
   * Cek status transaksi
   * @param {string} buyerSkuCode - SKU code produk
   * @param {string} customerNo - Nomor customer
   * @param {string} refId - Reference ID transaksi
   * @returns {Promise<object>} Status transaksi
   */
  async checkTransactionStatus(buyerSkuCode, customerNo, refId) {
    const signature = this.generateSignature(refId);
    
    const payload = {
      cmd: 'status',
      username: this.username,
      buyer_sku_code: buyerSkuCode,
      customer_no: customerNo,
      ref_id: refId,
      sign: signature
    };

    return await this.makeRequest('/transaction', payload);
  }

  /**
   * Mendapatkan operator berdasarkan prefix nomor
   * @param {string} phoneNumber - Nomor telepon
   * @returns {string} Operator (TELKOMSEL, INDOSAT, XL, TRI, SMARTFREN)
   */
  getOperatorFromNumber(phoneNumber) {
    // Hapus kode negara dan karakter non-digit
    const cleanNumber = phoneNumber.replace(/^\+?62|^0/, '').replace(/\D/g, '');
    const prefix = cleanNumber.substring(0, 4);

    // Mapping prefix operator
    const operatorMap = {
      // Telkomsel
      '0811': 'TELKOMSEL', '0812': 'TELKOMSEL', '0813': 'TELKOMSEL',
      '0821': 'TELKOMSEL', '0822': 'TELKOMSEL', '0823': 'TELKOMSEL',
      '0851': 'TELKOMSEL', '0852': 'TELKOMSEL', '0853': 'TELKOMSEL',
      
      // Indosat
      '0814': 'INDOSAT', '0815': 'INDOSAT', '0816': 'INDOSAT',
      '0855': 'INDOSAT', '0856': 'INDOSAT', '0857': 'INDOSAT', '0858': 'INDOSAT',
      
      // XL
      '0817': 'XL', '0818': 'XL', '0819': 'XL',
      '0859': 'XL', '0877': 'XL', '0878': 'XL',
      
      // Tri
      '0895': 'TRI', '0896': 'TRI', '0897': 'TRI', '0898': 'TRI', '0899': 'TRI',
      
      // Smartfren
      '0881': 'SMARTFREN', '0882': 'SMARTFREN', '0883': 'SMARTFREN',
      '0884': 'SMARTFREN', '0885': 'SMARTFREN', '0886': 'SMARTFREN',
      '0887': 'SMARTFREN', '0888': 'SMARTFREN', '0889': 'SMARTFREN'
    };

    return operatorMap[prefix] || 'UNKNOWN';
  }

  /**
   * Format nomor telepon untuk Indonesia
   * @param {string} phoneNumber - Nomor telepon
   * @returns {string} Nomor yang sudah diformat
   */
  formatPhoneNumber(phoneNumber) {
    // Hapus semua karakter non-digit
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Jika dimulai dengan 62, hapus
    if (cleanNumber.startsWith('62')) {
      cleanNumber = cleanNumber.substring(2);
    }
    
    // Jika dimulai dengan 0, hapus
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }
    
    // Tambahkan kembali 0 di depan untuk format Indonesia
    return '0' + cleanNumber;
  }
}

module.exports = DigiflazzAPI;
