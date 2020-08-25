var JSEncrypt = require("node-jsencrypt");
function encryptRSA(e) {
    var n = new JSEncrypt;
    return n.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLOicEokk/Q+L3Z5gG/ZhU0d8grNaoT6Ch7tzA8CJf/2r4C+fBZNXUbuDL9mQme104NztEKgqmNLTSAQ6k7f3w8Sx+7ks5PhBvCOVpW595JRGMAZmfqTws02zwGVtnoibRP28Wqnnd97uhuDZs6J5ewTthyzREfMwK6kd+qfuTnQIDAQAB"),
        n.encrypt(e)
}
console.log(encryptRSA("j123456789"))