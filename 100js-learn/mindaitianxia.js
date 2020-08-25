var o = require("crypto-js");
var bizContent = {"userName":"13612345678",
        "password":"123456789",
        "headImgUrl":"",
        "deviceToken":"Ao-jqrAbdjvndgAT33kJXRG1E2ly924hu1lipEM6e38v",
        "imgCode":"qaz890",
        "captchaKey":"login",
        "deviceType":"wap",
        "notErrTips":true,
        "role":"2",
        "h5Version":"128",
        "isPacket":"false",
        "isH5":"1",
        "H5pageRoute":"https://mbank.mindai.com/app5/main.html#/login?go2where=goback"},
    appKeySecret = "O2F2L0I84LC9U1KP";
var u, d, f, p, h, m, E, g = (u = JSON.stringify(bizContent),
    d = appKeySecret,
    f = appKeySecret,
    p = o.enc.Utf8.parse(u),
    h = o.enc.Utf8.parse(d),
    m = o.enc.Utf8.parse(f),
    E = o.AES.encrypt(p, h, {
        iv: m,
        mode: o.mode.CBC,
        padding: o.pad.Pkcs7
    }),
    o.enc.Base64.stringify(E.ciphertext));
console.log(g)
