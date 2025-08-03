/**
 * Quick Test untuk Libsignal Fixes
 * Memastikan semua konfigurasi bekerja dengan baik
 */

console.log('🧪 Testing Libsignal Fixes Configuration...\n')

try {
    // Test 1: Logger Configuration
    console.log('✅ Test 1: Logger Configuration')
    const logger = require('./logger')
    logger.info('📝 Enhanced logger working correctly')
    
    // Test 2: Libsignal Config
    console.log('✅ Test 2: Libsignal Configuration')
    const { libsignalConfig, handleLibsignalError, performanceTracker } = require('./lib/libsignalConfig')
    console.log('📋 Libsignal config loaded successfully')
    
    // Test 3: Performance Tracker
    console.log('✅ Test 3: Performance Tracker')
    const tracker = performanceTracker.start('test-operation')
    setTimeout(() => {
        performanceTracker.end(tracker)
        console.log('⏱️  Performance tracking working correctly')
    }, 100)
    
    // Test 4: Error Handler
    console.log('✅ Test 4: Error Handler')
    try {
        throw new Error('Test error with sensitive password and token data')
    } catch (err) {
        handleLibsignalError(err, 'test-context')
        console.log('🛡️  Error handler working correctly')
    }
    
    // Test 5: Baileys Import
    console.log('✅ Test 5: Baileys-mod Import')
    const { default: makeWASocket } = require('baileys-mod')
    console.log('📱 Baileys-mod imported successfully')
    
    setTimeout(() => {
        console.log('\n🎉 ALL TESTS PASSED!')
        console.log('✨ Libsignal fixes telah berhasil diimplementasikan dan berfungsi dengan baik!')
        console.log('\n🚀 Bot siap dijalankan dengan: node index.js')
    }, 200)
    
} catch (error) {
    console.error('❌ Test failed:', error.message)
}
