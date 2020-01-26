const crypto = require('crypto')

function confimationToken() {
  return Buffer.from(crypto.randomBytes(20).toString('hex')).toString('base64').replace('==', '')
}

module.exports = confimationToken