const JSEncrypt = require("node-jsencrypt");
var r = new JSEncrypt({
    default_key_size: 2048
});
r.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApCNjsTlE3AIR1YXyhE9M5SQ9xf1o0+W528nLdvI7ZmCOdFMed8SA3L91YFP+8wBl1we6BwVQBHo/4OQwUNlwVE7BgtsV5D67/rR74d0vGJNLBNMx6V3D/Uf+QgXBlPESWRwRkkHl2RbzTWbI60X0mLTxkvvpEYSvgFytlv5QL+on3TKp/Q4UiUk4MmWnY1taNLw7rAM8/HXYotC+jnhMgjvYEf5Ank/F0Tm4WZq/QlJcT2pOEN8vanGT325XhyshdqZJgG2IT1nt5EdtVjXySF9AMpnA2Cmz35Qygy/rx3+0+82yBpCgxjv0O7pYvtJ5tIXWkcUB3V6HtXiCkMNWRwIDAQAB")
console.log(r.encrypt("123456789"))