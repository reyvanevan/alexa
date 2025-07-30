const fs = require('fs');
fs.rmSync('node_modules', { recursive: true, force: true });
console.log('node_modules sudah dihapus.');
