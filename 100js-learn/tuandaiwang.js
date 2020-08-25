var JSEncrypt = require("node-jsencrypt")
var rsaKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfW0nAJhi0w2vqRq29OSyshPCKutw7WWlbfI7nWTjWLtw6hGJ61pDuz50LC6KxbCVstGoFQe0fDtSZzNbd83UTF58vUQ9+Og1gFsHMukxkLVNn/nUAFY4AW+tTTg6jJUYes+i8i+JiGgMyf/go8cDXU0jLh9ZN9RMObh6RZ/K6xQIDAQAB";
var encrypt = new JSEncrypt();
encrypt.setPublicKey(rsaKey);
un = encrypt.encrypt("13612345678");
console.log(un)
pd = encrypt.encrypt("123456789");
console.log(pd)