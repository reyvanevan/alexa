// lib/productMapping.js
// Product mapping system untuk H2H Digiflazz integration
// Sistem ini mirip seperti bot sebelumnya - mapping otomatis berdasarkan kategori/brand/type
// Tidak perlu mapping SKU manual, langsung filtering dari data Digiflazz

const fs = require('fs');

// aliasMap seperti yang digunakan di sistem bot sebelumnya
const aliasMap = {
  // MOBILE LEGENDS
  ml: {
    category: "Games",
    brand: "MOBILE LEGENDS",
    type: "Umum",
    name: "Mobile Legends"
  },
  mlw: {
    category: "Games", 
    brand: "MOBILE LEGENDS",
    type: "Weekly Pass",
    name: "Mobile Legends Weekly Pass"
  },
  mlt: {
    category: "Games",
    brand: "MOBILE LEGENDS", 
    type: "Twilight Pass",
    name: "Mobile Legends Twilight Pass"
  },

  // FREE FIRE
  ff: {
    category: "Games",
    brand: "FREE FIRE",
    type: "Umum",
    name: "Free Fire"
  },
  
  // PUBG MOBILE
  pubg: {
    category: "Games",
    brand: "PUBG MOBILE",
    type: "Umum", 
    name: "PUBG Mobile"
  },

  // GENSHIN IMPACT
  gi: {
    category: "Games",
    brand: "GENSHIN IMPACT",
    type: "Umum",
    name: "Genshin Impact"
  },

  // STEAM WALLET
  steam: {
    category: "Games",
    brand: "STEAM WALLET",
    type: "Umum",
    name: "Steam Wallet"
  },

  // VALORANT
  valo: {
    category: "Games", 
    brand: "VALORANT",
    type: "Umum",
    name: "Valorant"
  },

  // ARENA OF VALOR
  aov: {
    category: "Games",
    brand: "ARENA OF VALOR", 
    type: "Umum",
    name: "Arena of Valor"
  },

  // CALL OF DUTY MOBILE
  codm: {
    category: "Games",
    brand: "CALL OF DUTY MOBILE",
    type: "Umum", 
    name: "Call of Duty Mobile"
  },

  // POINT BLANK
  pb: {
    category: "Games",
    brand: "POINT BLANK",
    type: "Umum",
    name: "Point Blank"
  },

  // HIGGS DOMINO
  hd: {
    category: "Games",
    brand: "HIGGS DOMINO",
    type: "Umum",
    name: "Higgs Domino"
  },

  // SUPER SUS
  sus: {
    category: "Games", 
    brand: "SUPER SUS",
    type: "Umum",
    name: "Super Sus"
  },

  // TELKOMSEL PULSA
  ptl: {
    category: "Pulsa",
    brand: "TELKOMSEL",
    type: "Umum",
    name: "Pulsa Telkomsel"
  },

  // INDOSAT PULSA  
  pim3: {
    category: "Pulsa",
    brand: "INDOSAT",
    type: "Umum",
    name: "Pulsa Indosat"
  },

  // XL PULSA
  pxl: {
    category: "Pulsa", 
    brand: "XL",
    type: "Umum",
    name: "Pulsa XL"
  },

  // AXIS PULSA
  paxis: {
    category: "Pulsa",
    brand: "AXIS", 
    type: "Umum",
    name: "Pulsa Axis"
  },

  // TRI PULSA
  ptri: {
    category: "Pulsa",
    brand: "TRI",
    type: "Umum", 
    name: "Pulsa Tri"
  },

  // SMARTFREN PULSA
  psmart: {
    category: "Pulsa",
    brand: "SMARTFREN",
    type: "Umum",
    name: "Pulsa Smartfren"
  },

  // TELKOMSEL DATA
  dtl: {
    category: "Paket Data",
    brand: "TELKOMSEL",
    type: "Umum",
    name: "Data Telkomsel"
  },

  // INDOSAT DATA
  dim3: {
    category: "Paket Data", 
    brand: "INDOSAT",
    type: "Umum",
    name: "Data Indosat"
  },

  // XL DATA
  dxl: {
    category: "Paket Data",
    brand: "XL",
    type: "Umum", 
    name: "Data XL"
  },

  // AXIS DATA
  daxis: {
    category: "Paket Data",
    brand: "AXIS",
    type: "Umum",
    name: "Data Axis"
  },

  // TRI DATA
  dtri: {
    category: "Paket Data",
    brand: "TRI", 
    type: "Umum",
    name: "Data Tri"
  },

  // SMARTFREN DATA
  dsmart: {
    category: "Paket Data",
    brand: "SMARTFREN",
    type: "Umum",
    name: "Data Smartfren"
  },

  // PLN TOKEN
  pln: {
    category: "PLN",
    brand: "PLN",
    type: "Umum",
    name: "PLN Token"
  },

  // GOPAY
  gopay: {
    category: "E-Money",
    brand: "GOPAY",
    type: "Umum", 
    name: "GoPay"
  },

  // OVO
  ovo: {
    category: "E-Money",
    brand: "OVO",
    type: "Umum",
    name: "OVO"
  },

  // DANA
  dana: {
    category: "E-Money",
    brand: "DANA", 
    type: "Umum",
    name: "DANA"
  },

  // SHOPEEPAY
  spay: {
    category: "E-Money",
    brand: "SHOPEEPAY",
    type: "Umum",
    name: "ShopeePay"
  },

  // LINKAJA
  linkaja: {
    category: "E-Money",
    brand: "LINKAJA",
    type: "Umum",
    name: "LinkAja"
  }
};

// Function untuk filtering produk dari datadigi.json seperti sistem bot sebelumnya
function getMatchingProducts(aliasKey) {
  try {
    // Baca data produk dari file JSON (seperti sistem bot sebelumnya)
    const productData = JSON.parse(fs.readFileSync('./db/datadigi.json', 'utf8'));
    
    const aliasInfo = aliasMap[aliasKey.toLowerCase()];
    if (!aliasInfo) return [];
    
    const { category, brand, type, types } = aliasInfo;
    const requestedCategory = category.toUpperCase();
    const requestedBrand = brand.toUpperCase();

    // Filter produk berdasarkan kategori, brand, dan tipe (sama seperti case 'show')
    let matchingProducts = productData.filter(item =>
      item.brand.toUpperCase() === requestedBrand &&
      item.category.toUpperCase() === requestedCategory &&
      (types ? types.includes(item.type) : item.type.toUpperCase() === type.toUpperCase())
    );

    // Sort berdasarkan harga
    matchingProducts.sort((a, b) => a.price - b.price);
    
    return matchingProducts;
  } catch (error) {
    console.error('Error reading product data:', error);
    return [];
  }
}

// Function untuk mendapatkan produk berdasarkan alias
function getProductByAlias(alias) {
  const aliasKey = alias.toLowerCase();
  return aliasMap[aliasKey] || null;
}

// Function untuk mendapatkan semua produk berdasarkan kategori
function getProductsByCategory(category) {
  return Object.keys(aliasMap)
    .filter(key => aliasMap[key].category.toLowerCase() === category.toLowerCase())
    .map(key => ({
      alias: key,
      ...aliasMap[key]
    }));
}

// Function untuk mendapatkan semua kategori yang tersedia
function getAvailableCategories() {
  const categories = [...new Set(Object.values(aliasMap).map(p => p.category))];
  return categories.sort();
}

// Function untuk mendapatkan semua brand dalam kategori tertentu
function getBrandsByCategory(category) {
  const brands = [...new Set(
    Object.values(aliasMap)
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => p.brand)
  )];
  return brands.sort();
}

// Function untuk mencari produk berdasarkan keyword
function searchProducts(keyword) {
  const searchTerm = keyword.toLowerCase();
  return Object.keys(aliasMap)
    .filter(key => {
      const product = aliasMap[key];
      return key.includes(searchTerm) || 
             product.name.toLowerCase().includes(searchTerm) ||
             product.brand.toLowerCase().includes(searchTerm) ||
             product.category.toLowerCase().includes(searchTerm);
    })
    .map(key => ({
      alias: key,
      ...aliasMap[key]
    }));
}

// Function untuk validasi alias
function isValidAlias(alias) {
  return aliasMap.hasOwnProperty(alias.toLowerCase());
}

// Function untuk mendapatkan format order berdasarkan alias (sama seperti di neko.js)
function getOrderFormat(aliasKey) {
  if (!aliasKey) return '[KODE] [TUJUAN]';

  const key = aliasKey.toLowerCase();
  const info = aliasMap[key];
  if (!info) return '[KODE] [TUJUAN]';

  const brand = info.brand.toUpperCase();
  const category = info.category.toLowerCase();

  if (brand.includes('MOBILE LEGENDS')) {
    return '[KODE] [ID] [SERVER]';
  } else if (['pulsa', 'e-money', 'pln', 'masa aktif', 'paket sms & telpon'].includes(category)) {
    return '[KODE] [NOHP]';
  } else {
    return '[KODE] [ID]'; // Default format untuk game umum
  }
}

// Function untuk mendapatkan contoh order
function getContoh(aliasKey) {
  const format = getOrderFormat(aliasKey);
  // Contoh dinamis
  if (format === '[KODE] [ID] [SERVER]') return 'QR ML5 972066397 12864';
  if (format === '[KODE] [ID]') return 'QR FF10 123456789';
  if (format === '[KODE] [NOHP]') return 'QR PTL5 085123456789';
  return '`QR KODE TUJUAN`'; // fallback default
}

module.exports = {
  aliasMap,
  getMatchingProducts,
  getProductByAlias,
  getProductsByCategory, 
  getAvailableCategories,
  getBrandsByCategory,
  searchProducts,
  isValidAlias,
  getOrderFormat,
  getContoh
};
