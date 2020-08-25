var Base64= require("js-base64");
getEncryption = function (value) {
    var val = Base64.encode(value);
    var arr = [];
    for (var i = 0; i < val.length; i++) {
        arr.push(val.charAt(i));
        if (i % 2) {
            var num1 = Math.floor(10 * Math.random());
            arr.push(num1);
            var num2 = Math.floor(10 * Math.random());
            arr.push(num2);
            var num3 = Math.floor(10 * Math.random());
            arr.push(num3)
        }
    }
    return arr.join("");
};
console.log(getEncryption("123456789"))