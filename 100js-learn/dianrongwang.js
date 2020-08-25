function f(e) {
    var r = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqE2M4+LDkmRX50waOx+aTBgUUUH8l7S1pFzdEKEtKULnYtKlA9eCxU4W8nmdVAxHEpatwr1Z5p7ZiDoWxINyatV24pVgiDKYIPlr7ubBJlbFX2RLPCfV+SCm7jrgx9hqnUr6zMxaYvbFOre+G+/loC+Q1Wl2RpMYaqOl9gL5UanTPS2rX+qdQdxzRZe2ytL3hMi87f4FPYwptZpbGorc/bYBrsRrt8KsMnGCCNcLODyiSdbrmOOyBWPwKhHvI/sOUXwib5D7NtYmsjqLjDaHxapnPsl6EiEzoFQvCRWDLyDBkuRE2Th3ni5/UCx+WgOhbLvwNSojqRu324CZlfkWewIDAQAB";
    var JSEncrypt = require("node-jsencrypt");
    var t = new JSEncrypt();
    return t.setPublicKey(r),
        t.encrypt(e)
}
var identity =  f("13612345678"),password =  f("123456789");
console.log(identity)
console.log(password)