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
- **baileys-mod** - WhatsApp Web API (Modified version)
- **AI Integration** - OpenAI GPT, Google Gemini
- **Express.js** - Web server untuk webhook
- **Database** - JSON/MongoDB untuk penyimpanan
- **Firebase** - Cloud storage (optional)

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic WhatsApp bot functionality
- [x] Custom pairing code
- [x] Group management
- [x] Basic AI responses

### Phase 2 (Upcoming)
- [ ] Advanced AI conversation with memory
- [ ] Voice message processing & speech-to-text
- [ ] Image recognition & analysis
- [ ] Multi-bot coordination
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Web dashboard interface
- [ ] Plugin marketplace
- [ ] Multi-platform support (Telegram, Discord)
- [ ] Enterprise features
- [ ] API monetization

## 📁 Project Structure

```
alexa/
├── 📄 package.json          # Project configuration
├── 📄 index.js             # Main bot entry point
├── 📄 .env.example         # Environment template
├── 📁 db/                  # Database files
│   ├── config.js           # Bot configuration
│   ├── database.js         # Database handler
│   └── *.json             # Data storage
├── 📁 lib/                 # Library files
│   ├── myfunc.js          # Utility functions
│   ├── color.js           # Console colors
│   └── *.js               # Other utilities
├── 📁 src/                 # Source files
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

# Features
ENABLE_AI_CHAT=true
ENABLE_AUTO_RESPONSE=true
ENABLE_GROUP_MANAGEMENT=true
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

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [OpenAI](https://openai.com/) - AI Integration
- [Node.js](https://nodejs.org/) - Runtime Environment
- Komunitas developer Indonesia 🇮🇩

---

<div align="center">

**Made with ❤️ featuring Advanced AI Technology**

*Alexa - Your Intelligent WhatsApp Assistant*

[⭐ Star this repository](https://github.com/reyvanevan/alexa) if you find it useful!

</div>