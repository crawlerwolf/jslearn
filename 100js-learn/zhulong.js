const JSEncrypt = require("node-jsencrypt")
function encrypt(msg) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrWVnSOu9m7O8X3taQGXzVlB9B0Gw1Mvbc0MxKZOxT8SlQVB1Krpu3KfuoxgGE1TikX/JkYJf+D4tTqENqk5pnSZc784gWZPEs2O+uz5R/8Ay8qP06uHDzw1oGDrpo8wxWQ7Ae2IwE2gTDtpcyg8NUJp14uYwsvA47iDpXHGmPxQIDAQAB-----END PUBLIC KEY-----');
    return encrypt.encrypt(msg);
}
console.log(encrypt("123456789"))