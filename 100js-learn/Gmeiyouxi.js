var JSEncrypt = require("node-jsencrypt");
function encrypt(t, e) {
    var i = e ? e + "|" + t : t;
    var jsencrypt = new JSEncrypt;
    return jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----"),
        encodeURIComponent(jsencrypt.encrypt(i))
}
console.log(encrypt("123456789",(new Date).getTime()))