var md5 = require("md5-node");
var _nodeCryptojsAes = require('node-cryptojs-aes');
var ZeroPadding = {
    pad: function(e, r) {
        var t = 4 * r;
        e.clamp(),
            e.sigBytes += t - (e.sigBytes % t || t)
    },
    unpad: function(e) {
        for (var r = e.words, t = e.sigBytes - 1; !(r[t >>> 2] >>> 24 - t % 4 * 8 & 255); )
            t--;
        e.sigBytes = t + 1
    }
};
function encrypt(e, r, t) {
    var o = {
        iv: t,
        padding: ZeroPadding
    };
    return _nodeCryptojsAes.CryptoJS.AES.encrypt(e, r, o).ciphertext.toString(_nodeCryptojsAes.CryptoJS.enc.Base64)
}
function encryptPayload(e) {
    (e = e || {}).password && (e.password = md5("".concat(e.password, "qxfsn3.1415926535")));
    var i = "creditease"
        , r = "31a7e23f-5d1a-4d2c-abff-24a85261bf24";
    i && (e.channel = i),
    r && (e.device_guid = r);
    var s = "xTKhhXdx9aTTORImW0C+ZBpIbc3upWvI"
        , a = "9zzCYsvN99c="
        , t =  _nodeCryptojsAes.CryptoJS.enc.Latin1.parse(s)
        , o =  _nodeCryptojsAes.CryptoJS.enc.Latin1.parse(s.substr(0, 16));
    return {
        data: encrypt(JSON.stringify(e), t, o),
        ksi: a,
        em: "a1"
    }
}
console.log(encryptPayload({phone: "13612345678",password: "123456789",
    source: "desktop"}))