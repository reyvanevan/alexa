const axios = require('axios');
require('./db/config.js')
const apikey = 'da4bf2ac94e1af4637397ef4'
async function stalkml(playerId, serverId) {
  const apiUrl = `https://api.lolhuman.xyz/api/mobilelegend/${playerId}/${serverId}?apikey=${apikey}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (data.status === 200) {
      if (data.result) {
        return data.result;
      } else {
        return 'Gagal';
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}


async function stalkff(userId) {
  const apiUrl = `https://api.lolhuman.xyz/api/freefire/${userId}?apikey=${apikey}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === 200 && data.message === 'success') {
      if (data.result) {
        return data.result;
      } else {
       return 'Gagal';
      }
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

module.exports = {
  stalkml,
  stalkff
};
