# 🤖 Alexa - Advanced AI WhatsApp Assistant

Alexa adalah asisten WhatsApp AI canggih yang dibangun berdasarkan teknologi baileys-mod dengan fokus pada kecerdasan buatan dan otomatisasi percakapan.

## ✨ Fitur Utama Alexa

### 🧠 **AI Assistant Features**
- 🤖 **Smart Conversations** - Percakapan cerdas dengan AI
- 🎯 **Context Understanding** - Memahami konteks percakapan
- 🔍 **Smart Search** - Pencarian cerdas dengan AI
- 📝 **Auto Response** - Respon otomatis yang kontekstual
- 🌐 **Multi-Language Support** - Dukungan berbagai bahasa
- 🧩 **Plugin System** - Sistem plugin yang dapat diperluas

### 🔥 **Advanced WhatsApp Features**
- 💬 **Send Messages to Channels** - Kirim pesan ke channel WhatsApp
- 🔘 **Button & Interactive Messages** - Button dan pesan interaktif
- 🖼️ **Send Album Messages** - Kirim multiple gambar sebagai album
- 👥 **Group with LID Support** - Support grup dengan @lid
- 🤖 **AI Message Icon** - Icon AI untuk pesan
- 🖼️ **Full-Size Profile Pictures** - Upload foto profil ukuran penuh
- 📱 **Custom Pairing Codes** - Kode pairing custom "ALEXABOT"

### 💼 **H2H (Host-to-Host) Business Features**
- 🏪 **Digital Product Store** - Toko produk digital otomatis
- 💳 **Digiflazz Integration** - Integrasi penuh dengan Digiflazz API
- 🎮 **Gaming Products** - Mobile Legends, Free Fire, PUBG, dll
- 📱 **Pulsa & Data** - Top-up pulsa dan paket data semua operator
- 💰 **E-Wallet** - Top-up GoPay, OVO, DANA, ShopeePay
- ⚡ **PLN & PDAM** - Pembayaran listrik dan air
- 🔄 **Auto Product Sync** - Sinkronisasi produk otomatis dari Digiflazz
- 📊 **Transaction Management** - Manajemen transaksi real-time
- 💹 **Smart Pricing** - Sistem harga otomatis dengan margin

### 🛠️ **Libsignal Fixes & Performance**
- 🧹 **Clean Console Output** - Output console yang bersih tanpa noise
- 📝 **Enhanced Logging** - Sistem logging dual transport (file + console)
- ⚡ **Performance Monitoring** - Real-time performance tracking
- 🛡️ **Enhanced Error Handling** - Error handling dengan context yang jelas
- 🔌 **Smart Connection Management** - Manajemen koneksi yang lebih stabil
- 📊 **Data Protection** - Automatic redaction untuk data sensitif

### 🛠️ **Bot Management**
- 👥 **Smart Group Management** - Manajemen grup otomatis
- 🔒 **Advanced Security** - Sistem keamanan berlapis
- 📊 **Analytics & Monitoring** - Analitik penggunaan bot
- 🎛️ **Admin Dashboard** - Dashboard admin lengkap
- 🔄 **Auto Backup** - Backup otomatis data
- ⚡ **Performance Optimization** - Optimasi performa

## 🚀 Instalasi

### 1. **Clone Repository**
```bash
git clone https://github.com/reyvanevan/alexa.git
cd alexa
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Konfigurasi**
- Copy `.env.example` ke `.env`
```bash
cp .env.example .env
```
- Edit file `.env` dan isi konfigurasi yang diperlukan:
  - API keys untuk AI features
  - Nomor admin dan owner
  - Database configuration
- Edit file `db/config.js` sesuai kebutuhan

### 4. **Jalankan Bot**
```bash
npm start
# atau
node index.js
```

### 5. **Pairing Code**
- Masukkan nomor WhatsApp (format: 62xxx)
- Gunakan kode pairing "ALEXABOT" untuk connect
- Scan QR code atau gunakan pairing code

## 💼 H2H Business Setup

### 1. **Konfigurasi Digiflazz**
```javascript
// Edit db/config.js
global.digiflazz = {
    username: 'your_username',
    apiKey: 'your_api_key',
    production: false // true untuk production
}
```

### 2. **Update Product Database**
```bash
# Kirim pesan 'getlay' ke bot untuk sync produk dari Digiflazz
# Atau jalankan manual:
node -e "require('./lib/h2hCommands').updateProducts()"
```

### 3. **Test H2H Features**
```bash
# Test di WhatsApp:
produk ml          # Lihat produk Mobile Legends
order ML5 62xxx    # Order diamond ML
cek TRX123         # Cek status transaksi
```

## 🛠️ Libsignal Fixes Features

Alexa menggunakan **libsignal fixes** dari baileys-mod untuk pengalaman development yang lebih baik:

### ✨ **Enhanced Logging**
- 📝 Dual transport logging (file + console)
- 🎨 Color-coded log levels dengan emoji
- 🔒 Automatic sensitive data redaction
- 📊 Auto log rotation (>10MB)

### 🧹 **Clean Console Output**
- ❌ Filter libsignal warnings yang tidak penting
- 🔇 Suppress protobuf & native module noise
- ✅ Hanya tampilkan error yang relevan
- 🎯 Focus pada debugging yang penting

### ⚡ **Performance Monitoring**
- ⏱️ Real-time message processing time
- 📈 Connection performance tracking
- 💾 Memory usage monitoring (optional)
- 📊 Context-aware performance metrics

### 🛡️ **Enhanced Error Handling**
- 🎯 Context-aware error logging
- 🔐 Sensitive data protection dalam error messages
- 📋 Structured error reporting
- 🐛 Better debugging information

**Dokumentasi lengkap**: Lihat `LIBSIGNAL_FIXES.md` untuk detail implementasi.

## 📋 Command List

### 🤖 AI Commands
- `.ask [question]` - Tanya AI assistant
- `.chat [message]` - Chat dengan AI
- `.analyze [text]` - Analisis teks dengan AI
- `.translate [text]` - Terjemahkan dengan AI
- `.summarize [text/url]` - Ringkas konten

### 🔧 Smart Commands
- `.help` - Bantuan cerdas dan menu
- `.search [query]` - Pencarian cerdas
- `.weather [location]` - Info cuaca real-time
- `.news [category]` - Berita terkini
- `.calculator [expression]` - Kalkulator pintar

### 👥 Group AI Features
- `.smartmod on/off` - Moderasi otomatis
- `.autoresponse` - Setup auto response
- `.groupanalysis` - Analisis aktivitas grup
- `.antilink on/off` - Toggle antilink protection
- `.welcome on/off` - Toggle pesan sambutan

### 💼 H2H Business Commands
- `produk [kategori]` - Lihat daftar produk (ml, ff, pubg, dana, ovo, dll)
- `order [kode] [target]` - Buat pesanan produk
- `cek [trxid]` - Cek status transaksi
- `riwayat` - Lihat riwayat transaksi
- `getlay` - Update produk dari Digiflazz (admin only)
- `saldo` - Cek saldo Digiflazz
- `harga [produk]` - Cek harga produk spesifik

### 🎮 Entertainment
- `.meme` - Generate meme random
- `.joke` - Cerita lucu
- `.quote` - Quote inspiratif
- `.game [type]` - Mini games

### 🛠️ Admin Commands
- `.broadcast [message]` - Broadcast pesan
- `.addpremium [number]` - Tambah user premium
- `.ban [number]` - Ban user
- `.unban [number]` - Unban user
- `.restart` - Restart bot

## 🔧 Teknologi

- **Node.js** - Runtime JavaScript
- **baileys-mod v6.8.5** - WhatsApp Web API (Modified version dengan libsignal fixes)
- **AI Integration** - OpenAI GPT, Google Gemini
- **Express.js** - Web server untuk webhook
- **Database** - JSON/Firebase untuk penyimpanan
- **Digiflazz API** - H2H digital product integration
- **Pino Logger** - Enhanced logging dengan pino-pretty
- **MD5 Encryption** - Secure API authentication

## 🎯 Roadmap

### Phase 1 (Completed) ✅
- [x] Basic WhatsApp bot functionality
- [x] Custom pairing code "ALEXABOT"
- [x] Group management with smart features
- [x] Basic AI responses and interactions
- [x] H2H Digital Product Integration with Digiflazz
- [x] Auto product sync and pricing system
- [x] Libsignal fixes for enhanced performance
- [x] Enhanced logging and error handling

### Phase 2 (In Progress) 🚧
- [ ] Advanced AI conversation with memory
- [ ] Voice message processing & speech-to-text
- [ ] Image recognition & analysis
- [ ] Multi-bot coordination
- [ ] Advanced analytics dashboard
- [ ] Web dashboard for H2H management

### Phase 3 (Future) 🔮
- [ ] Web dashboard interface
- [ ] Plugin marketplace
- [ ] Multi-platform support (Telegram, Discord)
- [ ] Enterprise features
- [ ] API monetization

## 📁 Project Structure

```
alexa/
├── 📄 package.json          # Project configuration
├── 📄 index.js             # Main bot entry point with libsignal fixes
├── 📄 logger.js            # Enhanced logger dengan dual transport
├── 📄 neko.js              # Message handler with performance tracking
├── 📄 .env.example         # Environment template
├── � LIBSIGNAL_FIXES.md   # Libsignal implementation guide
├── 📄 PANDUAN_H2H.md       # H2H integration guide
├── �📁 db/                  # Database files
│   ├── config.js           # Bot configuration
│   ├── datadigi.json       # Digiflazz product database (9760+ products)
│   └── *.json             # Data storage
├── 📁 lib/                 # Library files
│   ├── myfunc.js          # Utility functions
│   ├── color.js           # Console colors
│   ├── h2hCommands.js     # H2H command handlers
│   ├── productMapping.js  # Product mapping and filtering
│   ├── libsignalConfig.js # Libsignal optimization config
│   └── *.js               # Other utilities
├── 📁 src/                 # Source files
├── 📁 logs/                # Enhanced log files with auto-rotation
└── 📁 session/             # WhatsApp session (auto-generated)
```

## 🔐 Environment Variables

```env
# Bot Settings
BOT_NAME=Alexa
SESSION_NAME=session
PUBLIC_MODE=true

# AI API Keys
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Admin Settings
OWNER_NUMBER=62xxx
ADMIN_NUMBERS=62xxx,62xxx

# H2H Digiflazz Configuration
DIGIFLAZZ_USERNAME=your_username
DIGIFLAZZ_API_KEY=your_api_key
DIGIFLAZZ_WEBHOOK_SECRET=your_webhook_secret

# Features
ENABLE_AI_CHAT=true
ENABLE_AUTO_RESPONSE=true
ENABLE_GROUP_MANAGEMENT=true
ENABLE_H2H_BUSINESS=true
ENABLE_LIBSIGNAL_FIXES=true

# Logging & Performance
LOG_LEVEL=info
PERFORMANCE_TRACKING=true
CLEAN_CONSOLE_OUTPUT=true
```

## 📝 Lisensi

MIT License - Lihat file [LICENSE](LICENSE) untuk detail lengkap.

## 🤝 Kontribusi

Kontribusi sangat welcome! Silakan:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/reyvanevan/alexa/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/reyvanevan/alexa/discussions)
- 📧 **Email**: [Contact Developer](mailto:your-email@example.com)
- 💬 **WhatsApp Group**: [Join Community](https://chat.whatsapp.com/your-group-link)

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/reyvanevan/alexa?style=social)
![GitHub forks](https://img.shields.io/github/forks/reyvanevan/alexa?style=social)
![GitHub issues](https://img.shields.io/github/issues/reyvanevan/alexa)
![GitHub license](https://img.shields.io/github/license/reyvanevan/alexa)

## 🙏 Acknowledgments

- [Baileys-mod](https://github.com/nstar-y/Bail) - WhatsApp Web API dengan libsignal fixes
- [Digiflazz](https://digiflazz.com/) - Digital product H2H provider
- [OpenAI](https://openai.com/) - AI Integration
- [Node.js](https://nodejs.org/) - Runtime Environment
- [Pino](https://getpino.io/) - High performance logging
- Komunitas developer Indonesia 🇮🇩

### 🌟 **Special Features**
- **Libsignal Fixes**: Enhanced development experience dengan clean logging
- **H2H Integration**: Full digital product store automation
- **AI-Powered**: Smart conversations dan auto-response
- **Enterprise-Ready**: Production-grade logging dan monitoring

---

<div align="center">

**Made with ❤️ featuring Advanced AI Technology**

*Alexa - Your Intelligent WhatsApp Assistant*

[⭐ Star this repository](https://github.com/reyvanevan/alexa) if you find it useful!

</div>