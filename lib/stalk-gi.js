const axios = require("axios")

exports.stalkgi = async(id, zoneId) => {
return new Promise(async (resolve, reject) => {
axios
.post(
'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
new URLSearchParams(
Object.entries({
productId: '107',
itemId: '1002',
catalogId: '2163',
paymentId: '5353',
gameId: id,
serverId: zoneId,
product_ref: 'REG',
product_ref_denom: 'REG',
})
),
{
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
Referer: 'https://www.duniagames.co.id/',
Accept: 'application/json',
},
}
)
.then((response) => {
resolve({
status: 200,
id: id,
serverId: zoneId,
nickname: response.data.data.gameDetail.userName
})
})
.catch((err) => {
resolve({
status: 404,
msg: 'User Id or ZoneId Not Found'
})
})
})
}