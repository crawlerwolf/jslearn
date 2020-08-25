function GetNonce() {
    function r(t, e) {
        var n = Math.floor
            , r = Math.random;
        return t + n(r() * (e - t + 1))
    }

    function tt(t, e) {
        var n = -1
            , a = t.length
            , o = a - 1;
        for (e = void 0 === e ? a : e; ++n < e; ) {
            var c = r(n, o)
                , i = t[c];
            t[c] = t[n],
                t[n] = i
        }
        return t.length = e,
            t.join("")
    }
    var i = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], e = 9
    var nonce = tt(i,e);
    return nonce
}

function GetXyz(url, nonce) {
    function i(e, t) {
        var n = (65535 & e) + (65535 & t);
        return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
    }
    function u(e, t, n, r, o, u) {
        return i(((a = i(i(t, e), i(r, u))) << (c = o)) | (a >>> (32 - c)), n);
        var a, c;
    }
    function a(e, t, n, r, o, i, a) {
        return u((t & n) | (~t & r), e, t, o, i, a);
    }
    function c(e, t, n, r, o, i, a) {
        return u((t & r) | (n & ~r), e, t, o, i, a);
    }
    function l(e, t, n, r, o, i, a) {
        return u(t ^ n ^ r, e, t, o, i, a);
    }
    function f(e, t, n, r, o, i, a) {
        return u(n ^ (t | ~r), e, t, o, i, a);
    }
    function v(e) {
        return unescape(encodeURIComponent(e));
    }
    function p(e) {
        var t,
            n = [];
        for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1)
            n[t] = 0;
        var r = 8 * e.length;
        for (t = 0; t < r; t += 8)
            n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return n;
    }
    function s(e, t) {
        var n, r, o, u, s;
        (e[t >> 5] |= 128 << t % 32), (e[14 + (((t + 64) >>> 9) << 4)] = t);
        var d = 1732584193,
            p = -271733879,
            h = -1732584194,
            v = 271733878;
        for (n = 0; n < e.length; n += 16)
            (r = d),
                (o = p),
                (u = h),
                (s = v),
                (d = a(d, p, h, v, e[n], 7, -680876936)),
                (v = a(v, d, p, h, e[n + 1], 12, -389564586)),
                (h = a(h, v, d, p, e[n + 2], 17, 606105819)),
                (p = a(p, h, v, d, e[n + 3], 22, -1044525330)),
                (d = a(d, p, h, v, e[n + 4], 7, -176418897)),
                (v = a(v, d, p, h, e[n + 5], 12, 1200080426)),
                (h = a(h, v, d, p, e[n + 6], 17, -1473231341)),
                (p = a(p, h, v, d, e[n + 7], 22, -45705983)),
                (d = a(d, p, h, v, e[n + 8], 7, 1770035416)),
                (v = a(v, d, p, h, e[n + 9], 12, -1958414417)),
                (h = a(h, v, d, p, e[n + 10], 17, -42063)),
                (p = a(p, h, v, d, e[n + 11], 22, -1990404162)),
                (d = a(d, p, h, v, e[n + 12], 7, 1804603682)),
                (v = a(v, d, p, h, e[n + 13], 12, -40341101)),
                (h = a(h, v, d, p, e[n + 14], 17, -1502002290)),
                (d = c(
                    d,
                    (p = a(p, h, v, d, e[n + 15], 22, 1236535329)),
                    h,
                    v,
                    e[n + 1],
                    5,
                    -165796510
                )),
                (v = c(v, d, p, h, e[n + 6], 9, -1069501632)),
                (h = c(h, v, d, p, e[n + 11], 14, 643717713)),
                (p = c(p, h, v, d, e[n], 20, -373897302)),
                (d = c(d, p, h, v, e[n + 5], 5, -701558691)),
                (v = c(v, d, p, h, e[n + 10], 9, 38016083)),
                (h = c(h, v, d, p, e[n + 15], 14, -660478335)),
                (p = c(p, h, v, d, e[n + 4], 20, -405537848)),
                (d = c(d, p, h, v, e[n + 9], 5, 568446438)),
                (v = c(v, d, p, h, e[n + 14], 9, -1019803690)),
                (h = c(h, v, d, p, e[n + 3], 14, -187363961)),
                (p = c(p, h, v, d, e[n + 8], 20, 1163531501)),
                (d = c(d, p, h, v, e[n + 13], 5, -1444681467)),
                (v = c(v, d, p, h, e[n + 2], 9, -51403784)),
                (h = c(h, v, d, p, e[n + 7], 14, 1735328473)),
                (d = l(
                    d,
                    (p = c(p, h, v, d, e[n + 12], 20, -1926607734)),
                    h,
                    v,
                    e[n + 5],
                    4,
                    -378558
                )),
                (v = l(v, d, p, h, e[n + 8], 11, -2022574463)),
                (h = l(h, v, d, p, e[n + 11], 16, 1839030562)),
                (p = l(p, h, v, d, e[n + 14], 23, -35309556)),
                (d = l(d, p, h, v, e[n + 1], 4, -1530992060)),
                (v = l(v, d, p, h, e[n + 4], 11, 1272893353)),
                (h = l(h, v, d, p, e[n + 7], 16, -155497632)),
                (p = l(p, h, v, d, e[n + 10], 23, -1094730640)),
                (d = l(d, p, h, v, e[n + 13], 4, 681279174)),
                (v = l(v, d, p, h, e[n], 11, -358537222)),
                (h = l(h, v, d, p, e[n + 3], 16, -722521979)),
                (p = l(p, h, v, d, e[n + 6], 23, 76029189)),
                (d = l(d, p, h, v, e[n + 9], 4, -640364487)),
                (v = l(v, d, p, h, e[n + 12], 11, -421815835)),
                (h = l(h, v, d, p, e[n + 15], 16, 530742520)),
                (d = f(
                    d,
                    (p = l(p, h, v, d, e[n + 2], 23, -995338651)),
                    h,
                    v,
                    e[n],
                    6,
                    -198630844
                )),
                (v = f(v, d, p, h, e[n + 7], 10, 1126891415)),
                (h = f(h, v, d, p, e[n + 14], 15, -1416354905)),
                (p = f(p, h, v, d, e[n + 5], 21, -57434055)),
                (d = f(d, p, h, v, e[n + 12], 6, 1700485571)),
                (v = f(v, d, p, h, e[n + 3], 10, -1894986606)),
                (h = f(h, v, d, p, e[n + 10], 15, -1051523)),
                (p = f(p, h, v, d, e[n + 1], 21, -2054922799)),
                (d = f(d, p, h, v, e[n + 8], 6, 1873313359)),
                (v = f(v, d, p, h, e[n + 15], 10, -30611744)),
                (h = f(h, v, d, p, e[n + 6], 15, -1560198380)),
                (p = f(p, h, v, d, e[n + 13], 21, 1309151649)),
                (d = f(d, p, h, v, e[n + 4], 6, -145523070)),
                (v = f(v, d, p, h, e[n + 11], 10, -1120210379)),
                (h = f(h, v, d, p, e[n + 2], 15, 718787259)),
                (p = f(p, h, v, d, e[n + 9], 21, -343485551)),
                (d = i(d, r)),
                (p = i(p, o)),
                (h = i(h, u)),
                (v = i(v, s));
        return [d, p, h, v];
    }
    function d(e) {
        var t,
            n = '',
            r = 32 * e.length;
        for (t = 0; t < r; t += 8)
            n += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
        return n;
    }
    function h(e) {
        var t,
            n,
            r = '';
        for (n = 0; n < e.length; n += 1)
            (t = e.charCodeAt(n)),
                (r +=
                    '0123456789abcdef'.charAt((t >>> 4) & 15) +
                    '0123456789abcdef'.charAt(15 & t));
        return r;
    }
    function m(e) {
        return (function (e) {
            return d(s(p(e), 8 * e.length));
        })(v(e));
    }
    var xyz = h(m(url += "&nonce=".concat(nonce)));
    return xyz
}

function GetUrl(url) {
    var nonce =  GetNonce();
    var xyz = GetXyz(url, nonce);
    var params =  "&xyz="+xyz+"&nonce="+ nonce;
    url += params;
    return url
}
var url = "https://xd.newrank.cn/xdnphb/nr/cloud/douyin/fans/getUserAccount?";
console.log(GetUrl(url));
console.log(GetXyz("/xdnphb/nr/cloud/douyin/login?AppKey=joker","ea063d248"));
