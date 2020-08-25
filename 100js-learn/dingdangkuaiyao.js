function o(e) {
    function t(e, t) {
        return e << t | e >>> 32 - t
    }
    function n(e, t) {
        var n, i, r, a, o;
        return r = 2147483648 & e,
            a = 2147483648 & t,
            n = 1073741824 & e,
            i = 1073741824 & t,
            o = (1073741823 & e) + (1073741823 & t),
            n & i ? 2147483648 ^ o ^ r ^ a : n | i ? 1073741824 & o ? 3221225472 ^ o ^ r ^ a : 1073741824 ^ o ^ r ^ a : o ^ r ^ a
    }
    function i(e, t, n) {
        return e & t | ~e & n
    }
    function r(e, t, n) {
        return e & n | t & ~n
    }
    function a(e, t, n) {
        return e ^ t ^ n
    }
    function o(e, t, n) {
        return t ^ (e | ~n)
    }
    function s(e, r, a, o, s, l, c) {
        return e = n(e, n(n(i(r, a, o), s), c)),
            n(t(e, l), r)
    }
    function l(e, i, a, o, s, l, c) {
        return e = n(e, n(n(r(i, a, o), s), c)),
            n(t(e, l), i)
    }
    function c(e, i, r, o, s, l, c) {
        return e = n(e, n(n(a(i, r, o), s), c)),
            n(t(e, l), i)
    }
    function u(e, i, r, a, s, l, c) {
        return e = n(e, n(n(o(i, r, a), s), c)),
            n(t(e, l), i)
    }
    function d(e) {
        var t, n = e.length, i = n + 8, r = (i - i % 64) / 64, a = 16 * (r + 1), o = Array(a - 1), s = 0, l = 0;
        while (l < n)
            t = (l - l % 4) / 4,
                s = l % 4 * 8,
                o[t] = o[t] | e.charCodeAt(l) << s,
                l++;
        return t = (l - l % 4) / 4,
            s = l % 4 * 8,
            o[t] = o[t] | 128 << s,
            o[a - 2] = n << 3,
            o[a - 1] = n >>> 29,
            o
    }
    function h(e) {
        var t, n, i = "", r = "";
        for (n = 0; n <= 3; n++)
            t = e >>> 8 * n & 255,
                r = "0" + t.toString(16),
                i += r.substr(r.length - 2, 2);
        return i
    }
    function f(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
            var i = e.charCodeAt(n);
            i < 128 ? t += String.fromCharCode(i) : i > 127 && i < 2048 ? (t += String.fromCharCode(i >> 6 | 192),
                t += String.fromCharCode(63 & i | 128)) : (t += String.fromCharCode(i >> 12 | 224),
                t += String.fromCharCode(i >> 6 & 63 | 128),
                t += String.fromCharCode(63 & i | 128))
        }
        return t
    }
    var p, v, m, g, y, b, w, x, S, k = Array(), T = 7, C = 12, _ = 17, E = 22, O = 5, M = 9, A = 14, I = 20, $ = 4, P = 11, L = 16, j = 23, N = 6, B = 10, D = 15, R = 21;
    for (e = f(e),
             k = d(e),
             b = 1732584193,
             w = 4023233417,
             x = 2562383102,
             S = 271733878,
             p = 0; p < k.length; p += 16)
        v = b,
            m = w,
            g = x,
            y = S,
            b = s(b, w, x, S, k[p + 0], T, 3614090360),
            S = s(S, b, w, x, k[p + 1], C, 3905402710),
            x = s(x, S, b, w, k[p + 2], _, 606105819),
            w = s(w, x, S, b, k[p + 3], E, 3250441966),
            b = s(b, w, x, S, k[p + 4], T, 4118548399),
            S = s(S, b, w, x, k[p + 5], C, 1200080426),
            x = s(x, S, b, w, k[p + 6], _, 2821735955),
            w = s(w, x, S, b, k[p + 7], E, 4249261313),
            b = s(b, w, x, S, k[p + 8], T, 1770035416),
            S = s(S, b, w, x, k[p + 9], C, 2336552879),
            x = s(x, S, b, w, k[p + 10], _, 4294925233),
            w = s(w, x, S, b, k[p + 11], E, 2304563134),
            b = s(b, w, x, S, k[p + 12], T, 1804603682),
            S = s(S, b, w, x, k[p + 13], C, 4254626195),
            x = s(x, S, b, w, k[p + 14], _, 2792965006),
            w = s(w, x, S, b, k[p + 15], E, 1236535329),
            b = l(b, w, x, S, k[p + 1], O, 4129170786),
            S = l(S, b, w, x, k[p + 6], M, 3225465664),
            x = l(x, S, b, w, k[p + 11], A, 643717713),
            w = l(w, x, S, b, k[p + 0], I, 3921069994),
            b = l(b, w, x, S, k[p + 5], O, 3593408605),
            S = l(S, b, w, x, k[p + 10], M, 38016083),
            x = l(x, S, b, w, k[p + 15], A, 3634488961),
            w = l(w, x, S, b, k[p + 4], I, 3889429448),
            b = l(b, w, x, S, k[p + 9], O, 568446438),
            S = l(S, b, w, x, k[p + 14], M, 3275163606),
            x = l(x, S, b, w, k[p + 3], A, 4107603335),
            w = l(w, x, S, b, k[p + 8], I, 1163531501),
            b = l(b, w, x, S, k[p + 13], O, 2850285829),
            S = l(S, b, w, x, k[p + 2], M, 4243563512),
            x = l(x, S, b, w, k[p + 7], A, 1735328473),
            w = l(w, x, S, b, k[p + 12], I, 2368359562),
            b = c(b, w, x, S, k[p + 5], $, 4294588738),
            S = c(S, b, w, x, k[p + 8], P, 2272392833),
            x = c(x, S, b, w, k[p + 11], L, 1839030562),
            w = c(w, x, S, b, k[p + 14], j, 4259657740),
            b = c(b, w, x, S, k[p + 1], $, 2763975236),
            S = c(S, b, w, x, k[p + 4], P, 1272893353),
            x = c(x, S, b, w, k[p + 7], L, 4139469664),
            w = c(w, x, S, b, k[p + 10], j, 3200236656),
            b = c(b, w, x, S, k[p + 13], $, 681279174),
            S = c(S, b, w, x, k[p + 0], P, 3936430074),
            x = c(x, S, b, w, k[p + 3], L, 3572445317),
            w = c(w, x, S, b, k[p + 6], j, 76029189),
            b = c(b, w, x, S, k[p + 9], $, 3654602809),
            S = c(S, b, w, x, k[p + 12], P, 3873151461),
            x = c(x, S, b, w, k[p + 15], L, 530742520),
            w = c(w, x, S, b, k[p + 2], j, 3299628645),
            b = u(b, w, x, S, k[p + 0], N, 4096336452),
            S = u(S, b, w, x, k[p + 7], B, 1126891415),
            x = u(x, S, b, w, k[p + 14], D, 2878612391),
            w = u(w, x, S, b, k[p + 5], R, 4237533241),
            b = u(b, w, x, S, k[p + 12], N, 1700485571),
            S = u(S, b, w, x, k[p + 3], B, 2399980690),
            x = u(x, S, b, w, k[p + 10], D, 4293915773),
            w = u(w, x, S, b, k[p + 1], R, 2240044497),
            b = u(b, w, x, S, k[p + 8], N, 1873313359),
            S = u(S, b, w, x, k[p + 15], B, 4264355552),
            x = u(x, S, b, w, k[p + 6], D, 2734768916),
            w = u(w, x, S, b, k[p + 13], R, 1309151649),
            b = u(b, w, x, S, k[p + 4], N, 4149444226),
            S = u(S, b, w, x, k[p + 11], B, 3174756917),
            x = u(x, S, b, w, k[p + 2], D, 718787259),
            w = u(w, x, S, b, k[p + 9], R, 3951481745),
            b = n(b, v),
            w = n(w, m),
            x = n(x, g),
            S = n(S, y);
    const z = h(b) + h(w) + h(x) + h(S);
    return z.toUpperCase()
}
console.log(o("123456789").toLowerCase())
