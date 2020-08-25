const CryptoJS = require("crypto-js");
var message = "123456789";
var key = "passport-gw-pc";
var keyHex = CryptoJS.enc.Utf8.parse(key);
var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});
console.log(encrypted.toString())