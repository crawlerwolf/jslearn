const CryptoJS = require("crypto-js");
function encryptByDES(message) {
    var keyHex = CryptoJS.enc.Utf8.parse("Pju8aD5buk8=");
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
var param = {
    "mobile" :encryptByDES("13612345678"),
    "pwd" :encryptByDES("123456"),
    "yzm" : encryptByDES("6542"),
    "loginType" : encryptByDES("0")
};
console.log(param)