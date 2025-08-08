const fs = require('fs')
const chalk = require('chalk')
require('dotenv').config() // Load environment variables

global.owner = process.env.OWNER_NUMBERS ? process.env.OWNER_NUMBERS.split(',') : ['6281224258870', '6289653544913']
global.nomerOwner = process.env.NOMER_OWNER || '6281224258870'

global.nomerBot = process.env.NOMER_BOT || '6285169545258'
global.botName = process.env.BOT_NAME || 'aqualyn v1'
global.ownerName = process.env.OWNER_NAME || 'Reyvan'
global.sessionName = process.env.SESSION_NAME || 'session'
namaStore = process.env.NAMA_STORE || 'AtlanticGate' // NAMA STORE KAMU

// Digiflazz H2H Configuration - Using Environment Variables
global.digiflazz = {
  username: process.env.DIGIFLAZZ_USERNAME || '', // Username akan diambil dari .env file
  apiKey: process.env.DIGIFLAZZ_API_KEY || '',   // API Key akan diambil dari .env file
  baseUrl: process.env.DIGIFLAZZ_BASE_URL || 'https://api.digiflazz.com/v1', // Base URL API Digiflazz
  webhook: {
    username: process.env.DIGIFLAZZ_WEBHOOK_USERNAME || '', // Username untuk webhook (opsional)
    secret: process.env.DIGIFLAZZ_WEBHOOK_SECRET || ''      // Secret untuk webhook validation (opsional)
  }
}

// Validation untuk memastikan credentials Digiflazz tersedia
if (!global.digiflazz.username || !global.digiflazz.apiKey) {
  console.log(chalk.red('⚠️  PERINGATAN: Digiflazz credentials tidak ditemukan!'))
  console.log(chalk.yellow('💡 Pastikan file .env sudah dibuat dengan format:'))
  console.log(chalk.cyan('   DIGIFLAZZ_USERNAME=your_username'))
  console.log(chalk.cyan('   DIGIFLAZZ_API_KEY=your_api_key'))
  console.log(chalk.yellow('📝 Gunakan .env.example sebagai template'))
}

priceBronze = 33000
priceSilver = 29000
priceGold = 29000
priceOwner = 27500

priceBronzePremium = 70000
priceSilverPremium = 62000
priceGoldPremium = 59000
priceOwnerPremium = 56000

// H2H Product Margins (untuk sistem seperti case 'show')
marginBronze = 0.08  // 8%
marginSilver = 0.05  // 5%
marginGold = 0.03    // 3%
marginOwner = 0.01   // 1%

module.exports = {
  priceBronze,
  priceSilver,
  priceGold,
  priceOwner,
  priceBronzePremium,
  priceSilverPremium,
  priceGoldPremium,
  priceOwnerPremium,
  marginBronze,
  marginSilver,
  marginGold,
  marginOwner,
  digiflazz: global.digiflazz
}

global.bot = "y"
global.min = `tag aja etminnya kalo ngartis`

// Link untuk testing dan fitur bot - menggunakan services yang lebih reliable
global.linkLOGO = 'https://picsum.photos/400/400'
global.linkQRIS = 'https://dummyimage.com/400x400/007bff/ffffff&text=QRIS+Payment'
global.linkGC = 'https://picsum.photos/500/300'
global.poster1 = 'https://picsum.photos/600/400'
global.linksl = 'https://dummyimage.com/500x400/28a745/ffffff&text=Success+Image'
global.testButtonImg = 'https://picsum.photos/600/350'
global.testAlbumImg1 = 'https://picsum.photos/500/300'
global.testAlbumImg2 = 'https://picsum.photos/500/400'


// Respon Bot
global.mess = {
  wait: "Loading...",
  owner: "Maaf kak, fitur ini khusus Owner",
  waitdata: "Melihat Data Terkini...",
  admin: "Fitur Khusus Admin Group!",
  group: "Fitur Khusus Group!",
  private: 'Silahkan menggunakan Fitur ini di Private Chat!',
  botAdmin: "Bot Harus Menjadi Admin Terlebih Dahulu!",
};


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`))
delete require.cache[file]
require(file)
})