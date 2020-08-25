var md5 = require("md5-node");
var password = md5("123456789".toLowerCase());
var password1 = md5("123456789");
console.log({password,password1})