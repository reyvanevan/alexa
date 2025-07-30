const fs = require('fs')
const pino = require('pino')

const logDir = './logs'
const logFile = `${logDir}/bot.log`

// Pastikan folder logs ada
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

// Cek ukuran file log
if (fs.existsSync(logFile)) {
    const stats = fs.statSync(logFile)
    if (stats.size > 10 * 1024 * 1024) { // 10MB
        fs.renameSync(logFile, `${logDir}/bot-${Date.now()}.log`)
    }
}

// Setting logger pino ke file
const logger = pino(
    {
        transport: {
            target: 'pino/file',
            options: {
                destination: logFile
            }
        }
    }
)

module.exports = logger
