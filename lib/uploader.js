const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const FileType = require('file-type');

async function upload(filePath) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject("File tidak ditemukan.");
    }

    // Cek jenis file pakai file-type
    const fileType = await FileType.fromFile(filePath);
    if (!fileType || !['image/jpeg', 'image/png'].includes(fileType.mime)) {
      return reject("❌ File harus berupa JPG atau PNG.");
    }

    const form = new FormData();
    console.log('[DEBUG] MIME:', fileType.mime);
	console.log('[DEBUG] EXT:', fileType.ext);
	console.log('[DEBUG] SIZE:', fs.statSync(filePath).size);
    form.append("file", fs.createReadStream(filePath), {
      filename: path.basename(filePath),
      contentType: fileType.mime
    });

    try {
      const response = await axios.post("https://telegra.ph/upload", form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (Array.isArray(response.data) && response.data[0].src) {
        return resolve("https://telegra.ph" + response.data[0].src);
      } else {
        return reject("❌ Telegraph gagal merespon.");
      }
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = { upload };
