navigator ={appName:"Netscape"}
var pidCrypt = require("pidcrypt");
var pidCryptUtil= require("pidcrypt/pidcrypt_util");
require("pidcrypt/rsa");
require("pidcrypt/asn1");
function certParser(cert) {
    var lines = cert.split("\n")
        , read = !1
        , b64 = !1
        , flag = ""
        , retObj = {};
    retObj.info = "",
        retObj.salt = "",
        retObj.iv,
        retObj.b64 = "",
        retObj.aes = !1,
        retObj.mode = "",
        retObj.bits = 0;
    for (var i = 0; i < lines.length; i++)
        switch (flag = lines[i].substr(0, 9),
        1 == i && "Proc-Type" != flag && 0 == flag.indexOf("M") && (b64 = !0),
            flag) {
            case "-----BEGI":
                read = !0;
                break;
            case "Proc-Type":
                read && (retObj.info = lines[i]);
                break;
            case "DEK-Info:":
                if (read) {
                    var tmp = lines[i].split(",")
                        , dek = tmp[0].split(": ")
                        , aes = dek[1].split("-");
                    retObj.aes = "AES" == aes[0] ? !0 : !1,
                        retObj.mode = aes[2],
                        retObj.bits = parseInt(aes[1]),
                        retObj.salt = tmp[1].substr(0, 16),
                        retObj.iv = tmp[1]
                }
                break;
            case "":
                read && (b64 = !0);
                break;
            case "-----END ":
                read && (b64 = !1,
                    read = !1);
                break;
            default:
                read && b64 && (retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i]))
        }
    return retObj
}
function RSAencript(str) {
    var crypted,
        public_key = "-----BEGIN PUBLIC KEY-----" +"\n"+
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMO0o8vYsqInbD/8uraIdWqP8Y" +"\n"+
            "cc7KQuLS7w0VbCWocyMRYu582LwzycBOPvbbEKt2feqpUKQ+F3peq+HQnI6gL9d6" +"\n"+
            "6l0ZG3KjflZTQJ8M847USfUNGVbAi3PJG/NiwQHddUUudmjIEAXwadelp/g+/p97" +"\n"+
            "YcBAz8caQDcEyI0AjQIDAQAB" +"\n"+
            "-----END PUBLIC KEY-----;",
        params = {};
    if (params = certParser(public_key),
        params.b64) {
        var key = pidCryptUtil.decodeBase64(params.b64)
            , rsa = new pidCrypt.RSA
            , asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key))
            , tree = asn.toHexTree();
        return rsa.setPublicKeyFromASN(tree),
            crypted = rsa.encrypt(str),
            pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted))
    }
    return "error"
}

console.log(RSAencript("123456789"))