var CryptoJS = require("crypto-js");
var _$8K = {};
_$8K['_$pr'] = new Array();
_$8K['_$tT'] = -172015004;
_$8K['_$Jy'] = 461512024;
function _$f$() {
    return Date['parse'](new Date())
}
function _$TT() {
    return (new Date())['valueOf']()
}
var $_oi = 1732584193;
var $_po = -271733879;
var $_sb = -1732584194;
var $_xn = 271733878;
function o(e, t, n, a, r, o, s) {
    return i(t ^ n ^ a, e, t, r, o, s);
}
function s(e, t, n, a, r, o, s) {
    return i(n ^ (t | ~a), e, t, r, o, s);
}
function r(e, t, n, a, r, o, s) {
    return i(t & a | n & ~a, e, t, r, o, s);
}
function t(e, t) {
    var n = (65535 & e) + (65535 & t);
    return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
}
function n(e, t) {
    return e << t | e >>> 32 - t;
}
function i(e, i, a, r, o, s) {
    return t(n(t(t(i, e), t(r, s)), o), a);
}
function a(e, t, n, a, r, o, s) {
    return i(t & n | ~t & a, e, t, r, o, s);
}
function l(e, n) {
    e[n >> 5] |= 128 << n % 32, e[14 + (n + 64 >>> 9 << 4)] = n;
    var $_XML = 16,
    op = 26,
    b64pad = 1;
    var i, l, c, d, u, h = $_oi, f = $_po, p = $_sb, m = $_xn;
    try {
        if (_$8K['_$6_']) {
        } else {
            _$8K['_$6_'] = 8821003647;
        }
    } catch (e) {
        _$8K['_$6_'] = 37885443;
    }
    for (i = 0; i < e['length']; i += $_XML)
        l = h, c = f, d = p, u = m, h = a(h, f, p, m, e[i], 7, 513548), m = a(m, h, f, p, e[i + 1], 12, _$8K['_$6_']), p = a(p, m, h, f, e[i + 2], 17, 606105819), f = a(f, p, m, h, e[i + 3], 22, -1044525330), h = a(h, f, p, m, e[i + 4], 7, -176418897), m = a(m, h, f, p, e[i + 5], 12, 1200080426), p = a(p, m, h, f, e[i + 6], 17, -1473231341), f = a(f, p, m, h, e[i + 7], 22, -45705983), h = a(h, f, p, m, e[i + 8], 7, 1770035416), m = a(m, h, f, p, e[i + 9], 12, -1958414417), p = a(p, m, h, f, e[i + 10], 17, -42063), f = a(f, p, m, h, e[i + 11], 22, -1990404162), h = a(h, f, p, m, e[i + 12], 7, 1804603682), m = a(m, h, f, p, e[i + 13], 12, -40341101), p = a(p, m, h, f, e[i + 14], 17, -1502882290), f = a(f, p, m, h, e[i + 15], 22, 1236535329), h = r(h, f, p, m, e[i + 1], 5, -165796510), m = r(m, h, f, p, e[i + 6], 9, -1069501632), p = r(p, m, h, f, e[i + 11], 14, 643717713), f = r(f, p, m, h, e[i], 20, -373897302), h = r(h, f, p, m, e[i + 5], 5, -701558691), m = r(m, h, f, p, e[i + 10], 9, 38016083),
            p = r(p, m, h, f, e[i + 15], 14, _$8K['_$tT']),
            f = r(f, p, m, h, e[i + 4], 20, _$8K['_$Jy']),
            h = r(h, f, p, m, e[i + 9], 5, 568446438), m = r(m, h, f, p, e[i + 14], 9, -1019783690), p = r(p, m, h, f, e[i + 3], 14, -187363961), f = r(f, p, m, h, e[i + 8], 20, 1163531501), h = r(h, f, p, m, e[i + 13], 5, -1554681467), m = r(m, h, f, p, e[i + 2], 9, -51403784), p = r(p, m, h, f, e[i + 7], 14, 1735328473), f = r(f, p, m, h, e[i + 12], 20, -1926607734), h = o(h, f, p, m, e[i + 5], 4, -37824558), m = o(m, h, f, p, e[i + 8], 11, -2022574463),
            p = o(p, m, h, f, e[i + 11], 16, 1839030562), f = o(f, p, m, h, e[i + 14], 23, -35309556),
            h = o(h, f, p, m, e[i + 1], 4, -1530992060 * b64pad),
            m = o(m, h, f, p, e[i + 4], 11, 1272893353), p = o(p, m, h, f, e[i + 7], 16, -155497632), f = o(f, p, m, h, e[i + 10], 23, -1094730640), h = o(h, f, p, m, e[i + 13], 4, 681279174), m = o(m, h, f, p, e[i], 11, -358537222), p = o(p, m, h, f, e[i + 3], 16, -722521979), f = o(f, p, m, h, e[i + 6], 23, 760291289), h = o(h, f, p, m, e[i + 9], 4, -64036887), m = o(m, h, f, p, e[i + 12], 11, -421815835), p = o(p, m, h, f, e[i + 15], 16, 530742520), f = o(f, p, m, h, e[i + 2], 23, -995338651), h = s(h, f, p, m, e[i], 6, -198630844), m = s(m, h, f, p, e[i + 7], 10, 1126891415), p = s(p, m, h, f, e[i + 14], 15, -1416354905), f = s(f, p, m, h, e[i + 5], 21, -57434055), h = s(h, f, p, m, e[i + 12], 6, 1700485571), m = s(m, h, f, p, e[i + 3], 10, -1894746606), p = s(p, m, h, f, e[i + 10], 15, -105181523), f = s(f, p, m, h, e[i + 1], 21, -2054922799), h = s(h, f, p, m, e[i + 8], 6, 1873313359), m = s(m, h, f, p, e[i + 15], 10, -30611744), p = s(p, m, h, f, e[i + 6], 15, -1560198380), f = s(f, p, m, h, e[i + 13], 21, 1309151649), h = s(h, f, p, m, e[i + 4], 6, -145523070), m = s(m, h, f, p, e[i + 11], 10, -1120210379), p = s(p, m, h, f, e[i + 2], 15, 718787259), f = s(f, p, m, h, e[i + 9], 21, -343485441), h = t(h, l), f = t(f, c), p = t(p, d), m = t(m, u);
    return [
        h,
        f,
        p,
        m
    ];
}
function c(e) {
    var t, n = '', i = 32 * e['length'];
    for (t = 0; t < i; t += 8)
        n += String['fromCharCode'](e[t >> 5] >>> t % 32 & 255);
    return n;
}
function d(e) {
    var t, n = [];
    for (n[(e['length'] >> 2) - 1] = void 0, t = 0; t < n['length']; t += 1)
        n[t] = 0;
    var i = 8 * e['length'];
    for (t = 0; t < i; t += 8)
        n[t >> 5] |= (255 & e['charCodeAt'](t / 8)) << t % 32;
    return n;
}
function u(e) {
    return c(l(d(e), 8 * e['length']));
}
function f(e) {
    var t, n, i = '0123456789abcdef', a = '';
    for (n = 0; n < e['length']; n += 1)
        t = e['charCodeAt'](n), a += i.charAt(t >>> 4 & 15) + i.charAt(15 & t);
    return a;
}
function p(e) {
    return unescape(encodeURIComponent(e));
}
function m(e) {
    return u(p(e));
}
function g(e) {
    return f(m(e));
}
function b(e, t, n) {
    return t ? n ? v(t, e) : y(t, e) : n ? m(e) : g(e);
}
for (var idx=0;idx<4;idx++){
    if (idx === 0){
        _$Wa = _$f$();
        /*  _$Is[_$Fe] = 'm=' + b(_$Wa) + '; path=/';*/
        _$8K['_$pr']['push'](b(_$Wa));
        delete _$8K['_$Jy'];
        delete _$8K['_$tT'];
    }
    else {
        _$8K['_$Jy'] = _$TT();
        /*  _$8K['_$tT'] = _$TT() - _$f$();*/
        _$8K['_$tT'] = -660478335;
        _$Wa = _$f$();
        /*  _$Is[_$Fe] = 'm=' + b(_$Wa) + '; path=/';*/
        _$8K['_$pr']['push'](b(_$Wa));
        delete _$8K['_$Jy'];
    }
}
_$8K['_$6_'] = -389564586;
_$yw = _$f$()['toString']();
_$8K['_$is'] = _$yw;
_$8K['_$Jy'] = -405537848;
_$8K['_$pr']['push'](b(_$yw))
var Base64 = {
    atob: function(input) {
        input = String(input);
        input = input.replace(/[ \t\n\f\r]/g, '');
        if (input.length % 4 == 0 && /==?$/.test(input)) {
            input = input.replace(/==?$/, '');
        }
        if (input.length % 4 == 1 || !/^[+/0-9A-Za-z]*$/.test(input)) {
            return null;
        }
        var output = '';
        var buffer = 0;
        var accumulatedBits = 0;
        for (var i = 0; i < input.length; i++) {
            buffer <<= 6;
            buffer |= Base64.atobLookup(input[i]);
            accumulatedBits += 6;
            if (accumulatedBits == 24) {
                output += String.fromCharCode((buffer & 0xff0000) >> 16);
                output += String.fromCharCode((buffer & 0xff00) >> 8);
                output += String.fromCharCode(buffer & 0xff);
                buffer = accumulatedBits = 0;
            }
        }
        if (accumulatedBits == 12) {
            buffer >>= 4;
            output += String.fromCharCode(buffer);
        } else if (accumulatedBits == 18) {
            buffer >>= 2;
            output += String.fromCharCode((buffer & 0xff00) >> 8);
            output += String.fromCharCode(buffer & 0xff);
        }
        return output;
    },
    atobLookup: function(chr) {
        if (/[A-Z]/.test(chr)) {
            return chr.charCodeAt(0) - 'A'.charCodeAt(0);
        }
        if (/[a-z]/.test(chr)) {
            return chr.charCodeAt(0) - 'a'.charCodeAt(0) + 26;
        }
        if (/[0-9]/.test(chr)) {
            return chr.charCodeAt(0) - '0'.charCodeAt(0) + 52;
        }
        if (chr == '+') {
            return 62;
        }
        if (chr == '/') {
            return 63;
        }
    },
    btoa: function(s) {
        var i;
        s = String(s);
        for (i = 0; i < s.length; i++) {
            if (s.charCodeAt(i) > 255) {
                return null;
            }
        }
        var out = '';
        for (i = 0; i < s.length; i += 3) {
            var groupsOfSix = [undefined, undefined, undefined, undefined];
            groupsOfSix[0] = s.charCodeAt(i) >> 2;
            groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4;
            if (s.length > i + 1) {
                groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
                groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2;
            }
            if (s.length > i + 2) {
                groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
                groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f;
            }
            for (var j = 0; j < groupsOfSix.length; j++) {
                if (typeof groupsOfSix[j] == 'undefined') {
                    out += '=';
                } else {
                    out += Base64.btoaLookup(groupsOfSix[j]);
                }
            }
        }
        return out;
    },
    btoaLookup: function(idx) {
        if (idx < 26) {
            return String.fromCharCode(idx + 'A'.charCodeAt(0));
        }
        if (idx < 52) {
            return String.fromCharCode(idx - 26 + 'a'.charCodeAt(0));
        }
        if (idx < 62) {
            return String.fromCharCode(idx - 52 + '0'.charCodeAt(0));
        }
        if (idx == 62) {
            return '+';
        }
        if (idx == 63) {
            return '/';
        }
    }
}
function h() {
    var e = CryptoJS.enc.Utf8.parse(_$8K['_$pr'].toString())
        , n = CryptoJS.enc.Utf8.parse(Base64.btoa(_$8K['_$is']).slice(0, 16))
        , a = CryptoJS.AES.encrypt(e, n, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return a.toString()
}
function result(){
    /*  m,f为url参数   token为cookie字段RM4hZBv0dDon443M */
    m = _$Wa;
    f = _$8K['_$is'];
    token = h();
    return [m,f,token]
}

console.log(result())


