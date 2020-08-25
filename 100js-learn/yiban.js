const JSEncrypt = require("node-jsencrypt");
var encrypt = new JSEncrypt();
encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvExXdIzzS4GZbHMXj1ebRGhMZ\n" +
    "2Oof2zyTh2MXlgD/E5oRucvZ2aGs0+5oN/AP+g3Mt7K3IGA5iUtfqitwrkoCLt43\n" +
    "QrbHLuzf3MdoXrXOlMJd5vq3YNZjV84EFDg/7yG9iA7esr1sLgGLmc3R5D/KJ2ga\n" +
    "28EG3Cx4qxMoR2Ow7QIDAQAB\n" +
    "-----END PUBLIC KEY-----\n")
console.log(encrypt.encrypt("123456789").length)