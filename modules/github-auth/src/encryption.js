const
  crypto = require('crypto'),

  encryptionKey = process.env.HUBOT_GITHUB_AUTH_ENCRYPTION_KEY;

module.exports = {

  encrypt: (data) => {
    if (!typeof stringValue === 'string') {
      throw new Error('Only strings can be encrypted.', 'encryption-error')
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(encryptionKey), iv);
    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');

  },

  decrypt: (data) => {
    const dataParts = data.split(':');
    const iv = new Buffer(dataParts.shift(), 'hex');
    const encryptedText = new Buffer(dataParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },
};
