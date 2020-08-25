// 获取sign
// @param sPara
// @returns {*}
var md5=require("md5-node");
var utf8 = require('nodejs-utf8');
var getSign = function(sPara) {
    //把参数的键值取出来
    var keys = Object.keys(sPara);
    //键值升序排列
    keys = keys.sort();
    var split = '';
    var signString = '';
    for (var i = 0; i < keys.length; i++) {
        signString += split + keys[i] + '=' + (typeof sPara[keys[i]] === 'object' ? JSON.stringify(sPara[keys[i]]) : sPara[keys[i]]);
        split = '&';
    }
    signString = signString + 'FD92DF750B32765DA01A119BE1601D46';
    return md5(utf8.encode(signString));
}
//}
const CryptoJS = require("crypto-js")
var encrypt = function(parse) {
    var params = {
        data: JSON.stringify(parse),
        device: 'WechatMall/1.0/2.2.1',
        timestemp: Date.parse(new Date()) / 1000,
        token: '',
        //openid: getSessionStore('openid') ? getSessionStore('openid') : ''
    };
    params.sign = getSign(params);

    params.openid =  '';

    var data = JSON.stringify(params);
    var key = 'b92dff3973ebdc1786803c2ce976a627';
    var iv = key.substring(0, 16);
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var srcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
    return { params: encrypted.toString() };
}
console.log(encrypt({mobile_phone: "13687654321",
    password: "123456789",
    phone_captcha: "123456"}))