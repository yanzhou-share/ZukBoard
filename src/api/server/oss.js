const crypto = require('crypto')
const key = process.env.KEY
const secret = process.env.SECRET
// MD5
function MD5(value) {
  return crypto
    .createHash('md5')
    .update(value)
    .digest('hex')
}

// Base64
function base64(value) {
  return Buffer.from(value).toString('base64')
}

// hmacsha1
function hmacsha1(secret, value) {
  return crypto.createHmac('sha1', secret).update(value, 'utf-8').digest().toString('base64')
}

function getUpyunParams() {
  const bucketname = 'imclass'
  let expiration = ((Date.now() / 1000) >>> 0) + 30 * 60
  let method = 'POST'
  let policy = base64(
    JSON.stringify({
      bucket: bucketname,
      'save-key': '/{year}/{mon}{day}/' + '{random}{.suffix}',
      expiration: expiration
    })
  )
  let authorization =
    'UPYUN ' +
    key +
    ':' +
    hmacsha1(MD5(secret), method + '&/' + bucketname + '&' + policy)
  return { policy: policy, sign: authorization }
}

module.exports = getUpyunParams
