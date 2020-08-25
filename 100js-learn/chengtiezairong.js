var CryptoJS = require("crypto-js");
function encryptByDES(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var str =  encrypted.toString();
    str=str.replace("+","[j]").replace("+","[j]");
    return str;
}
console.log(encryptByDES("123456789", "6Ta4OaHZdpA="))