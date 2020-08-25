var r, o, c, d = 16, l = d, f = 65536, h = f >>> 1, m = f * f, v = f - 1, x = [0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535], w = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535], y = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function k(t) {
    this.digits = "boolean" == typeof t && 1 == t ? null : r.slice(0),
        this.isNeg = !1
}
function j(s) {
    for (var t, e = 0, n = Math.min(s.length, 4), i = 0; i < n; ++i)
        e <<= 4,
            e |= (t = s.charCodeAt(i)) >= 48 && t <= 57 ? t - 48 : t >= 65 && t <= 90 ? 10 + t - 65 : t >= 97 && t <= 122 ? 10 + t - 97 : 0;
    return e
}
function _(s) {
    for (var t = new k, i = s.length, e = 0; i > 0; i -= 4,
        ++e)
        t.digits[e] = j(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    return t
}
function A(t, e, n) {
    this.e = _(t),
        this.d = _(e),
        this.m = _(n),
        this.chunkSize = 128,
        this.radix = 16,
        this.barrett = new C(this.m)
}
function C(t) {
    this.modulus = O(t),
        this.k = E(this.modulus) + 1;
    var e, n, r = new k;
    r.digits[2 * this.k] = 1,
        this.mu = (e = r,
            n = this.modulus,
            S(e, n)[0]),
        this.bkplus1 = new k,
        this.bkplus1.digits[this.k + 1] = 1,
        this.modulo = D,
        this.multiplyMod = I,
        this.powMod = B
}
function O(t) {
    var e = new k(!0);
    return e.digits = t.digits.slice(0),
        e.isNeg = t.isNeg,
        e
}
function E(t) {
    for (var e = t.digits.length - 1; e > 0 && 0 == t.digits[e]; )
        --e;
    return e
}
function S(t, e) {
    var q, n, r = N(t), c = N(e), d = e.isNeg;
    if (r < c)
        return t.isNeg ? ((q = O(o)).isNeg = !e.isNeg,
            t.isNeg = !1,
            e.isNeg = !1,
            n = U(e, t),
            t.isNeg = !0,
            e.isNeg = d) : (q = new k,
            n = O(t)),
            [q, n];
    q = new k,
        n = t;
    for (var x = Math.ceil(c / l) - 1, w = 0; e.digits[x] < h; )
        e = T(e, 1),
            ++w,
            ++c,
            x = Math.ceil(c / l) - 1;
    n = T(n, w),
        r += w;
    for (var y = Math.ceil(r / l) - 1, b = z(e, y - x); -1 != P(n, b); )
        ++q.digits[y - x],
            n = U(n, b);
    for (var i = y; i > x; --i) {
        var j = i >= n.digits.length ? 0 : n.digits[i]
            , _ = i - 1 >= n.digits.length ? 0 : n.digits[i - 1]
            , A = i - 2 >= n.digits.length ? 0 : n.digits[i - 2]
            , C = x >= e.digits.length ? 0 : e.digits[x]
            , S = x - 1 >= e.digits.length ? 0 : e.digits[x - 1];
        q.digits[i - x - 1] = j == C ? v : Math.floor((j * f + _) / C);
        for (var R = q.digits[i - x - 1] * (C * f + S), D = j * m + (_ * f + A); R > D; )
            --q.digits[i - x - 1],
                R = q.digits[i - x - 1] * (C * f | S),
                D = j * f * f + (_ * f + A);
        (n = U(n, $(b = z(e, i - x - 1), q.digits[i - x - 1]))).isNeg && (n = Y(n, b),
            --q.digits[i - x - 1])
    }
    return n = L(n, w),
        q.isNeg = t.isNeg != d,
    t.isNeg && (q = d ? Y(q, o) : U(q, o),
        n = U(e = L(e, w), n)),
    0 == n.digits[0] && 0 == E(n) && (n.isNeg = !1),
        [q, n]
}
function N(t) {
    var e, n = E(t), r = t.digits[n], o = (n + 1) * l;
    for (e = o; e > o - l && 0 == (32768 & r); --e)
        r <<= 1;
    return e
}
function T(t, e) {
    var n = Math.floor(e / l)
        , r = new k;
    R(t.digits, 0, r.digits, n, r.digits.length - n);
    for (var o = e % l, c = l - o, i = r.digits.length - 1, d = i - 1; i > 0; --i,
        --d)
        r.digits[i] = r.digits[i] << o & v | (r.digits[d] & x[o]) >>> c;
    return r.digits[0] = r.digits[i] << o & v,
        r.isNeg = t.isNeg,
        r
}
function R(t, e, n, r, o) {
    for (var c = Math.min(e + o, t.length), i = e, d = r; i < c; ++i,
        ++d)
        n[d] = t[i]
}
function z(t, e) {
    var n = new k;
    return R(t.digits, 0, n.digits, e, n.digits.length - e),
        n
}
function P(t, e) {
    if (t.isNeg != e.isNeg)
        return 1 - 2 * Number(t.isNeg);
    for (var i = t.digits.length - 1; i >= 0; --i)
        if (t.digits[i] != e.digits[i])
            return t.isNeg ? 1 - 2 * Number(t.digits[i] > e.digits[i]) : 1 - 2 * Number(t.digits[i] < e.digits[i]);
    return 0
}
function U(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = Y(t, e),
            e.isNeg = !e.isNeg;
    else {
        var r, o;
        n = new k,
            o = 0;
        for (var i = 0; i < t.digits.length; ++i)
            r = t.digits[i] - e.digits[i] + o,
                n.digits[i] = r % f,
            n.digits[i] < 0 && (n.digits[i] += f),
                o = 0 - Number(r < 0);
        if (-1 == o) {
            o = 0;
            for (var c = 0; c < t.digits.length; ++c)
                r = 0 - n.digits[c] + o,
                    n.digits[c] = r % f,
                n.digits[c] < 0 && (n.digits[c] += f),
                    o = 0 - Number(r < 0);
            n.isNeg = !t.isNeg
        } else
            n.isNeg = t.isNeg
    }
    return n
}
function $(t, e) {
    var n, r, o, c = new k;
    n = E(t),
        r = 0;
    for (var l = 0; l <= n; ++l)
        o = c.digits[l] + t.digits[l] * e + r,
            c.digits[l] = o & v,
            r = o >>> d;
    return c.digits[1 + n] = r,
        c
}
function L(t, e) {
    var n = Math.floor(e / l)
        , r = new k;
    R(t.digits, n, r.digits, 0, t.digits.length - n);
    for (var o = e % l, c = l - o, i = 0, d = i + 1; i < r.digits.length - 1; ++i,
        ++d)
        r.digits[i] = r.digits[i] >>> o | (r.digits[d] & w[o]) << c;
    return r.digits[r.digits.length - 1] >>>= o,
        r.isNeg = t.isNeg,
        r
}
function D(t) {
    var e = K(t, this.k - 1)
        , n = K(F(e, this.mu), this.k + 1)
        , r = U(Q(t, this.k + 1), Q(F(n, this.modulus), this.k + 1));
    r.isNeg && (r = Y(r, this.bkplus1));
    for (var o = P(r, this.modulus) >= 0; o; )
        o = P(r = U(r, this.modulus), this.modulus) >= 0;
    return r
}
function I(t, e) {
    var n = F(t, e);
    return this.modulo(n)
}
function B(t, e) {
    var n = new k;
    n.digits[0] = 1;
    for (var a = t, r = e; 0 != (1 & r.digits[0]) && (n = this.multiplyMod(n, a)),
    0 != (r = L(r, 1)).digits[0] || 0 != E(r); )
        a = this.multiplyMod(a, a);
    return n
}
function M(t, s) {
    for (var a = [], e = s.length, i = 0; i < e; )
        a[i] = s.charCodeAt(i),
            i++;
    for (; a.length % t.chunkSize != 0; )
        a[i++] = 0;
    var n, r, o, c = a.length, d = "";
    for (i = 0; i < c; i += t.chunkSize) {
        for (o = new k,
                 n = 0,
                 r = i; r < i + t.chunkSize; ++n)
            o.digits[n] = a[r++],
                o.digits[n] += a[r++] << 8;
        var l = t.barrett.powMod(o, t.e);
        d += (16 == t.radix ? H(l) : X(l, t.radix)) + " "
    }
    return d.substring(0, d.length - 1)
}
function F(t, e) {
    for (var n, r, o, c = new k, l = E(t), f = E(e), i = 0; i <= f; ++i) {
        n = 0,
            o = i;
        for (var h = 0; h <= l; ++h,
            ++o)
            r = c.digits[o] + t.digits[h] * e.digits[i] + n,
                c.digits[o] = r & v,
                n = r >>> d;
        c.digits[i + l + 1] = n
    }
    return c.isNeg = t.isNeg != e.isNeg,
        c
}
function K(t, e) {
    var n = new k;
    return R(t.digits, e, n.digits, 0, n.digits.length - e),
        n
}
function Q(t, e) {
    var n = new k;
    return R(t.digits, 0, n.digits, 0, e),
        n
}
function H(t) {
    for (var e = "", i = E(t); i > -1; --i)
        e += J(t.digits[i]);
    return e
}
function J(t) {
    for (var e = "", i = 0; i < 4; ++i)
        e += y[15 & t],
            t >>>= 4;
    return V(e)
}
function V(s) {
    for (var t = "", i = s.length - 1; i > -1; --i)
        t += s.charAt(i);
    return t
}
function Y(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = U(t, e),
            e.isNeg = !e.isNeg;
    else {
        n = new k;
        for (var r, o = 0, i = 0; i < t.digits.length; ++i)
            r = t.digits[i] + e.digits[i] + o,
                n.digits[i] = r % f,
                o = Number(r >= f);
        n.isNeg = t.isNeg
    }
    return n
}
var G = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
function X(t, e) {
    var b = new k;
    b.digits[0] = e;
    for (var n = S(t, b), r = G[n[1].digits[0]]; 1 == P(n[0], c); )
        n = S(n[0], b),
            r += G[n[1].digits[0]];
    return (t.isNeg ? "-" : "") + V(r)
}
function Z(t) {
    var data = t.split("").reverse().join("");
    !function(t) {
        r = new Array(t);
        for (var e = 0; e < r.length; e++)
            r[e] = 0;
        c = new k,
            (o = new k).digits[0] = 1
    }(130);
    for (var e = new A("10001","","d741760e63aab01eecf8f2237468da2c9a1f3dfb7de74d8bed23de8eb734b0771aa88ab3acfe3d223f24c057a37f8976cd592a5061fba10cfa212ac7448ef4ce9710a3c5ecb176ed10f55612de976edda1a000faf74923efa80645d0654588c1bc314a28879aeda2ed08b0b83c3582ef3de1fe9125aa67130cdfcd3128732461"), n = data.length, d = "", l = 0, i = 0; n - l > 0; )
        d = M(e, n - l > 128 ? data.substr(l, 128) : data.substr(l, n - l)) + d,
            l = 128 * ++i;
    return d
}

var n = {
    terminal: "WEB",
    reqTime: (new Date).toUTCString(),
    accessTerminal: "WEB",
    clientVersion: "4.1.0",
    version: "1.0",
    channelCode: "LD",
    appId: 1002
};
data = Z(JSON.stringify(Object.assign({}, n, {
    custMobile:"13612345678",
    custLoginPsw:"123456789",
    verifyCode:"26215"
})));
console.log(data)