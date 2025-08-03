/**
 * Libsignal Fixes Configuration for Baileys-mod
 * Enhanced logging and error handling for cleaner development experience
 */

const { color } = require('./color')

const libsignalConfig = {
    // Enhanced logging levels
    logLevels: {
        TRACE: 10,
        DEBUG: 20,
        INFO: 30,
        WARN: 40,
        ERROR: 50,
        FATAL: 60
    },

    // Custom log formatters with emoji indicators
    formatters: {
        connection: (status) => {
            switch(status) {
                case 'connecting': return '🔄 Connecting to WhatsApp...'
                case 'open': return '✅ Successfully connected to WhatsApp'
                case 'close': return '❌ Connection closed'
                default: return `📱 Connection status: ${status}`
            }
        },
        
        message: (type, from) => {
            const senderType = from?.includes('@g.us') ? '👥 Group' : '👤 Private'
            return `📨 ${type} message from ${senderType}: ${from}`
        },
        
        error: (error, context) => {
            return `💥 Error in ${context}: ${error.message || error}`
        },
        
        auth: (action) => {
            switch(action) {
                case 'qr': return '📱 QR Code generated for pairing'
                case 'pairing': return '🔐 Pairing code requested'
                case 'session': return '🗝️  Using existing session'
                default: return `🔑 Auth: ${action}`
            }
        }
    },

    // Filter sensitive data from logs
    sensitiveFields: [
        'password', 'token', 'key', 'secret', 'auth', 
        'credential', 'session', 'private', 'signature'
    ],

    // Clean libsignal output configuration
    cleanOutput: {
        hideLibsignalWarnings: true,
        hideProtobufWarnings: true,
        hideNodeWarnings: true,
        showOnlyRelevantErrors: true
    },

    // Performance monitoring
    performance: {
        trackMessageProcessing: true,
        trackConnectionTime: true,
        trackAuthTime: true,
        showMemoryUsage: false
    }
}

// Enhanced error handler with libsignal fixes
const handleLibsignalError = (error, context = 'unknown') => {
    const sensitivePattern = new RegExp(libsignalConfig.sensitiveFields.join('|'), 'i')
    
    let errorMessage = error.message || error.toString()
    
    // Clean sensitive data from error messages
    if (sensitivePattern.test(errorMessage)) {
        errorMessage = errorMessage.replace(sensitivePattern, '[REDACTED]')
    }
    
    // Filter known libsignal warnings that are not critical
    const knownWarnings = [
        'node-libsignal',
        'protobuf.js',
        'experimental feature',
        'deprecated'
    ]
    
    const isKnownWarning = knownWarnings.some(warning => 
        errorMessage.toLowerCase().includes(warning)
    )
    
    if (isKnownWarning && libsignalConfig.cleanOutput.hideLibsignalWarnings) {
        return // Don't log known warnings
    }
    
    console.log(color(libsignalConfig.formatters.error(error, context), 'red'))
}

// Performance tracker
const performanceTracker = {
    start: (operation) => {
        if (!libsignalConfig.performance.trackMessageProcessing) return
        
        return {
            operation,
            startTime: Date.now(),
            memoryBefore: process.memoryUsage()
        }
    },
    
    end: (tracker) => {
        if (!tracker) return
        
        const endTime = Date.now()
        const duration = endTime - tracker.startTime
        const memoryAfter = process.memoryUsage()
        
        console.log(color(`⏱️  ${tracker.operation} completed in ${duration}ms`, 'cyan'))
        
        if (libsignalConfig.performance.showMemoryUsage) {
            const memoryDiff = memoryAfter.heapUsed - tracker.memoryBefore.heapUsed
            console.log(color(`💾 Memory usage: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`, 'yellow'))
        }
    }
}

// Clean console output
const originalConsoleWarn = console.warn
console.warn = (...args) => {
    const message = args.join(' ')
    
    // Filter out libsignal warnings
    if (libsignalConfig.cleanOutput.hideLibsignalWarnings) {
        const libsignalWarnings = [
            'node-libsignal',
            'binding.node',
            'native module',
            'experimental'
        ]
        
        if (libsignalWarnings.some(warning => message.includes(warning))) {
            return // Don't show libsignal warnings
        }
    }
    
    originalConsoleWarn.apply(console, args)
}

module.exports = {
    libsignalConfig,
    handleLibsignalError,
    performanceTracker
}
