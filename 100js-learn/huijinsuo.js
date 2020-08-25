var CryptoJS = require("crypto-js");
function encryptByDES(e) {
    return CryptoJS.MD5(e + "TuD00Iqz4ge7gzIe2rmjSAFFKtaIBmnr8S").toString()
}
console.log(encryptByDES("123456789"))

