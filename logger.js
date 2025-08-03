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

// Enhanced logger configuration with libsignal fixes
const logger = pino({
    level: 'info',
    transport: {
        targets: [
            {
                target: 'pino/file',
                options: {
                    destination: logFile,
                    sync: false
                },
                level: 'info'
            },
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    levelFirst: true,
                    ignore: 'time,hostname,pid',
                    messageFormat: '{levelLabel} - {msg}'
                },
                level: 'info'
            }
        ]
    },
    // Libsignal optimization - redact sensitive data
    redact: {
        paths: ['password', 'token', 'key', 'secret'],
        censor: '[REDACTED]'
    }
})

module.exports = logger
