var Base64 = require("js-base64");
var md5 = require("md5-node");
function c(e, t) {
    return md5(e.toLowerCase() + md5(t))
}
function params(e) {
    var t = "dafacloud_" + Math.random()
        , a = {
        random: Base64.encode("dafacloud_0.07865227770162764")
    }
        , i = c(e.userName, e.password);
    e.password = md5(i + t);
    e.random = a.random;
    return e
}
console.log(params({password:"123456789", userName:"13612345678"}))