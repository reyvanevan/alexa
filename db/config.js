const fs = require('fs')
const chalk = require('chalk')

global.owner = ['6281224258870' , '6289653544913']
global.nomerOwner = '6281224258870'

global.nomerBot = '6285169545258' 
global.botName = 'aqualyn v1'
global.ownerName = 'Reyvan'
global.sessionName = 'session' 
namaStore = 'AtlanticGate' // NAMA STORE KAMU

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