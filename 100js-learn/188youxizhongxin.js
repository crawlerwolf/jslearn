var JSEncrypt = require("node-jsencrypt");
var encrypt = new JSEncrypt();
encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDvEpk7iB6BF8ZLXG0vSMr7Qedl\n" +
    "B9Q4c9qrqiNziUt3RokRkr7pHxWlelQPC3JIMs+UvMkabTkDNE4pvx/DkFWEMzzu\n" +
    "HuDeenKNo1Ywymf8A6EtQIEL7MQpUaszPx6/u5YqLVvjN7fyvF5LSVgtzjYhTTHK\n" +
    "hTJF2R5dTkO3VswLVwIDAQAB\n" +
    "-----END PUBLIC KEY-----\n");
console.log(encrypt.encrypt("123456789"+ "c1mdfUWWj0GrVXuJj9deKiyzHB7702pC"))