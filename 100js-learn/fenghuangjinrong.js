const NodeRSA = require('node-rsa');

const a_public_key = new NodeRSA("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvHa2FKT3CgcZCP1N04xABW48iXivuc6aw92hVwBkADzHGyn8CK1wTUa1qGObIOWZPPpS/ss8MT/fPNu50BUfWLEbxj0TWSYt1+dWUHz79ujLbsLo5NwMzYgIISkrYbwSwSfQ6wNgtn/tKoeieaOE4pynidC8TfZfEfIZjSydlmQIDAQAB-----END PUBLIC KEY-----");
const encrypted = a_public_key.encrypt({"username":"13612345678","password":"123456789"}, 'base64');
console.log(encrypted)