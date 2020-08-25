function enCode(a, b) {
    for (var b = b, c = a.length, d = b.length, e = "", f = 0; c > f; f++)
        e += String.fromCharCode(a.charAt(f).charCodeAt(0) + b.charAt(f % d).charCodeAt(0));
    return enCodeFun(e)
}
function enCodeFun(a) {
    if (!/([^\u0000-\u00ff])/.test(a)) {
        for (var b, c, d, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, g = []; f < a.length; ) {
            switch (b = a.charCodeAt(f),
                d = (f + 1) % 3) {
                case 1:
                    g.push(e.charAt(b >> 2));
                    break;
                case 2:
                    g.push(e.charAt((3 & c) << 4 | b >> 4));
                    break;
                case 0:
                    g.push(e.charAt((15 & c) << 2 | b >> 6)),
                        g.push(e.charAt(63 & b))
            }
            c = b,
                f++
        }
        return 1 == d ? (g.push(e.charAt((3 & c) << 4)),
            g.push("==")) : 2 == d && (g.push(e.charAt((15 & c) << 2)),
            g.push("=")),
            g.join("")
    }
}
var username = "13612345678",
    password = "123456789",
    vcode = "ymii";
var i = "type=ajax&from=web&username="+username+"&password="+password+"&vcode="+vcode+"&appplt=web&appid=vas&channel=208000103007&sceneFlag=1";
i = encodeURIComponent(i),
    i = enCode(i, "ppvaslogin")
console.log(i)