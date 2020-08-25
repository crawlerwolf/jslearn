var CryptoJS = require("crypto-js");
var Base64 = require("js-base64");
function w() {}
function Y() {}
function G() {}
function I() {
    I = w;
    J = [];
    K = [];
    var a = new G, b = J, c = K, e = 0, d, f;
    for (f in a)
        if (d = a[f])
            b[e] = f,
                c[e] = d,
                ++e
}
function H(a, b, c) {
    I();
    var e = {}
        , d = [{},{a:1}];
    I();
    for (var f = 0, g = e.length; f < g; ++f)
        c[e[f]] = d[f];
    c.cZ = a;
    c.cM = b;
    return c
}
function U() {
    U = w;
    X = H(Y, {}, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102]);
    W = H(Y, {}, [9, -69, -14, 61, -88, -114, -126, 4])
}
function P() {
    P = w;
    Q = H(Y, {}, [-35, -41, -66, -109, 120, 113, -6, 44])
}
function e (data) {
    // b= '{"identityId":"13612345678","credential":"123456789","captcha":"123456","capId":"5c02ed98028a4775af6f61ceb3adde70","accountType":"PERSONALITY","gotourl":"","ls":"","pid":""}'
    b = JSON.stringify(data);
    d = Base64.encode(b);
    b = CryptoJS.MD5(d).toString() + b;
    U()
    var g = d = void 0
        , k = void 0
        , h = void 0;
    d = void 0;
    g = Y;
    k = {};
    h = Array(32);
    for (d = 0; 32 > d; ++d)
        h[d] = 0;
    H(g, k, h);
    k = h;
    for (d = 0,
             g = 0; 16 > d; ++d)
        h = 8 > d ? -W[d] : -(P(),
            Q)[d - 8],
            k[g++] = X[~~(240 & h) >>> 4],
            k[g++] = X[15 & h];
    d = String.fromCharCode.apply(null, k);
    d = CryptoJS.enc.Hex.parse(d);
    b = CryptoJS.AES.encrypt(b, d, {
        mode: CryptoJS.mode.ECB
    }).ciphertext.toString();
    d = Base64.encode(b);
    return d
}
var data = {"identityId":"13612345678","credential":"123456789","captcha":"123456","capId":"a862bf8492fa46dda9e3cc9fe0ec3c5e","accountType":"PERSONALITY","gotourl":"","ls":"","pid":""};
console.log(e(data))