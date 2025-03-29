const crypto = require('crypto');
module.exports = () => crypto.randomUUID().split('-')[0].toUpperCase();