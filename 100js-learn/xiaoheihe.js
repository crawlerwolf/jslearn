const JSEncrypt = require("node-jsencrypt");
function enparam(param) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZgjVwAiKTjZ55nG+mW6r3TSU4\nECvNYqDMIS/bhCj2QaH5GI/KZb2TBp+CBvUj9SLFnmJQ0kzHzHoGZCQ88VevCffF7JePGF9cmKQqotlfTKbV4oxV5iLz7JSG6b/Vg7AXtrTolNtWsa8HiB0tI0YClYaQlOXm4UxLeSxQwSFETwIDAQAB\n-----END PUBLIC KEY-----\n")
    return encrypt.encrypt(param)
}
var phone_num="136123465678";
console.log(enparam(phone_num));
var pwd="123456789";
console.log(enparam(pwd));

const md5 = require("md5-node");
function param() {
    var e = Math.floor((new Date).getTime() / 1e3);
    return {
        hkey: md5(md5("web/_time=" + e).replace(/b/gi, "web")),
        _time: e
    }
}
console.log(param())
