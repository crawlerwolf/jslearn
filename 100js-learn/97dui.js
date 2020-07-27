function getparams(loginname,password) {
    function pwdencrypt(message, options = undefined) {
        var charenc = {
            // UTF-8 encoding
            utf8: {
                // Convert a string to a byte array
                stringToBytes: function (str) {
                    return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
                },

                // Convert a byte array to a string
                bytesToString: function (bytes) {
                    return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
                }
            },

            // Binary encoding
            bin: {
                // Convert a string to a byte array
                stringToBytes: function (str) {
                    for (var bytes = [], i = 0; i < str.length; i++)
                        bytes.push(str.charCodeAt(i) & 0xFF);
                    return bytes;
                },

                // Convert a byte array to a string
                bytesToString: function (bytes) {
                    for (var str = [], i = 0; i < bytes.length; i++)
                        str.push(String.fromCharCode(bytes[i]));
                    return str.join('');
                }
            }
        }
        var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            crypt = {
                // Bit-wise rotation left
                rotl: function (n, b) {
                    return (n << b) | (n >>> (32 - b));
                },

                // Bit-wise rotation right
                rotr: function (n, b) {
                    return (n << (32 - b)) | (n >>> b);
                },

                // Swap big-endian to little-endian and vice versa
                endian: function (n) {
                    // If number given, swap endian
                    if (n.constructor == Number) {
                        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
                    }

                    // Else, assume array and swap all items
                    for (var i = 0; i < n.length; i++)
                        n[i] = crypt.endian(n[i]);
                    return n;
                },

                // Generate an array of any length of random bytes
                randomBytes: function (n) {
                    for (var bytes = []; n > 0; n--)
                        bytes.push(Math.floor(Math.random() * 256));
                    return bytes;
                },

                // Convert a byte array to big-endian 32-bit words
                bytesToWords: function (bytes) {
                    for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
                        words[b >>> 5] |= bytes[i] << (24 - b % 32);
                    return words;
                },

                // Convert big-endian 32-bit words to a byte array
                wordsToBytes: function (words) {
                    for (var bytes = [], b = 0; b < words.length * 32; b += 8)
                        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
                    return bytes;
                },

                // Convert a byte array to a hex string
                bytesToHex: function (bytes) {
                    for (var hex = [], i = 0; i < bytes.length; i++) {
                        hex.push((bytes[i] >>> 4).toString(16));
                        hex.push((bytes[i] & 0xF).toString(16));
                    }
                    return hex.join('');
                },

                // Convert a hex string to a byte array
                hexToBytes: function (hex) {
                    for (var bytes = [], c = 0; c < hex.length; c += 2)
                        bytes.push(parseInt(hex.substr(c, 2), 16));
                    return bytes;
                },

                // Convert a byte array to a base-64 string
                bytesToBase64: function (bytes) {
                    for (var base64 = [], i = 0; i < bytes.length; i += 3) {
                        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                        for (var j = 0; j < 4; j++)
                            if (i * 8 + j * 6 <= bytes.length * 8)
                                base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                            else
                                base64.push('=');
                    }
                    return base64.join('');
                },

                // Convert a base-64 string to a byte array
                base64ToBytes: function (base64) {
                    // Remove non-base-64 characters
                    base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

                    for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
                         imod4 = ++i % 4) {
                        if (imod4 == 0) continue;
                        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
                            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
                            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
                    }
                    return bytes;
                }
            };
        var utf8 = charenc.utf8,
            bin = charenc.bin,

// The core
            md5 = function (message, options) {
                // Convert to byte array
                if (message.constructor == String)
                    if (options && options.encoding === 'binary')
                        message = bin.stringToBytes(message);
                    else
                        message = utf8.stringToBytes(message);
                else if (typeof Buffer != 'undefined' &&
                    typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
                    message = Array.prototype.slice.call(message, 0);
                else if (!Array.isArray(message))
                    message = message.toString();
                // else, assume byte array already

                var m = crypt.bytesToWords(message),
                    l = message.length * 8,
                    a = 1732584193,
                    b = -271733879,
                    c = -1732584194,
                    d = 271733878;

                // Swap endian
                for (var i = 0; i < m.length; i++) {
                    m[i] = ((m[i] << 8) | (m[i] >>> 24)) & 0x00FF00FF |
                        ((m[i] << 24) | (m[i] >>> 8)) & 0xFF00FF00;
                }

                // Padding
                m[l >>> 5] |= 0x80 << (l % 32);
                m[(((l + 64) >>> 9) << 4) + 14] = l;

                // Method shortcuts
                var FF = md5._ff,
                    GG = md5._gg,
                    HH = md5._hh,
                    II = md5._ii;

                for (var i = 0; i < m.length; i += 16) {

                    var aa = a,
                        bb = b,
                        cc = c,
                        dd = d;

                    a = FF(a, b, c, d, m[i + 0], 7, -680876936);
                    d = FF(d, a, b, c, m[i + 1], 12, -389564586);
                    c = FF(c, d, a, b, m[i + 2], 17, 606105819);
                    b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
                    a = FF(a, b, c, d, m[i + 4], 7, -176418897);
                    d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
                    c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
                    b = FF(b, c, d, a, m[i + 7], 22, -45705983);
                    a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
                    d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
                    c = FF(c, d, a, b, m[i + 10], 17, -42063);
                    b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
                    a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
                    d = FF(d, a, b, c, m[i + 13], 12, -40341101);
                    c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
                    b = FF(b, c, d, a, m[i + 15], 22, 1236535329);

                    a = GG(a, b, c, d, m[i + 1], 5, -165796510);
                    d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
                    c = GG(c, d, a, b, m[i + 11], 14, 643717713);
                    b = GG(b, c, d, a, m[i + 0], 20, -373897302);
                    a = GG(a, b, c, d, m[i + 5], 5, -701558691);
                    d = GG(d, a, b, c, m[i + 10], 9, 38016083);
                    c = GG(c, d, a, b, m[i + 15], 14, -660478335);
                    b = GG(b, c, d, a, m[i + 4], 20, -405537848);
                    a = GG(a, b, c, d, m[i + 9], 5, 568446438);
                    d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
                    c = GG(c, d, a, b, m[i + 3], 14, -187363961);
                    b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
                    a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
                    d = GG(d, a, b, c, m[i + 2], 9, -51403784);
                    c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
                    b = GG(b, c, d, a, m[i + 12], 20, -1926607734);

                    a = HH(a, b, c, d, m[i + 5], 4, -378558);
                    d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
                    c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
                    b = HH(b, c, d, a, m[i + 14], 23, -35309556);
                    a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
                    d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
                    c = HH(c, d, a, b, m[i + 7], 16, -155497632);
                    b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
                    a = HH(a, b, c, d, m[i + 13], 4, 681279174);
                    d = HH(d, a, b, c, m[i + 0], 11, -358537222);
                    c = HH(c, d, a, b, m[i + 3], 16, -722521979);
                    b = HH(b, c, d, a, m[i + 6], 23, 76029189);
                    a = HH(a, b, c, d, m[i + 9], 4, -640364487);
                    d = HH(d, a, b, c, m[i + 12], 11, -421815835);
                    c = HH(c, d, a, b, m[i + 15], 16, 530742520);
                    b = HH(b, c, d, a, m[i + 2], 23, -995338651);

                    a = II(a, b, c, d, m[i + 0], 6, -198630844);
                    d = II(d, a, b, c, m[i + 7], 10, 1126891415);
                    c = II(c, d, a, b, m[i + 14], 15, -1416354905);
                    b = II(b, c, d, a, m[i + 5], 21, -57434055);
                    a = II(a, b, c, d, m[i + 12], 6, 1700485571);
                    d = II(d, a, b, c, m[i + 3], 10, -1894986606);
                    c = II(c, d, a, b, m[i + 10], 15, -1051523);
                    b = II(b, c, d, a, m[i + 1], 21, -2054922799);
                    a = II(a, b, c, d, m[i + 8], 6, 1873313359);
                    d = II(d, a, b, c, m[i + 15], 10, -30611744);
                    c = II(c, d, a, b, m[i + 6], 15, -1560198380);
                    b = II(b, c, d, a, m[i + 13], 21, 1309151649);
                    a = II(a, b, c, d, m[i + 4], 6, -145523070);
                    d = II(d, a, b, c, m[i + 11], 10, -1120210379);
                    c = II(c, d, a, b, m[i + 2], 15, 718787259);
                    b = II(b, c, d, a, m[i + 9], 21, -343485551);

                    a = (a + aa) >>> 0;
                    b = (b + bb) >>> 0;
                    c = (c + cc) >>> 0;
                    d = (d + dd) >>> 0;
                }

                return crypt.endian([a, b, c, d]);
            };

// Auxiliary functions
        md5._ff = function (a, b, c, d, x, s, t) {
            var n = a + (b & c | ~b & d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        md5._gg = function (a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        md5._hh = function (a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };
        md5._ii = function (a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        };

// Package private blocksize
        md5._blocksize = 16;
        md5._digestsize = 16;

        var digestbytes = crypt.wordsToBytes(md5(message, options));
        return options && options.asBytes ? digestbytes :
            options && options.asString ? bin.bytesToString(digestbytes) :
                crypt.bytesToHex(digestbytes);
    }

    function guid() {
        function S4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        }

        return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
    }

    function params(data) {
        var decoder$1;
        var Base64 = {
            decode: function decode(a) {
                var i;
                if (decoder$1 === undefined) {
                    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                    var ignore = '= \f\n\r\t\xA0\u2028\u2029';
                    decoder$1 = {};
                    for (i = 0; i < 64; ++i) {
                        decoder$1[b64.charAt(i)] = i;
                    }
                    for (i = 0; i < ignore.length; ++i) {
                        decoder$1[ignore.charAt(i)] = -1;
                    }
                }
                var out = [];
                var bits = 0;
                var char_count = 0;
                for (i = 0; i < a.length; ++i) {
                    var c = a.charAt(i);
                    if (c == "=") {
                        break;
                    }
                    c = decoder$1[c];
                    if (c == -1) {
                        continue;
                    }
                    if (c === undefined) {
                        throw new Error("Illegal character at offset " + i);
                    }
                    bits |= c;
                    if (++char_count >= 4) {
                        out[out.length] = bits >> 16;
                        out[out.length] = bits >> 8 & 0xFF;
                        out[out.length] = bits & 0xFF;
                        bits = 0;
                        char_count = 0;
                    } else {
                        bits <<= 6;
                    }
                }
                switch (char_count) {
                    case 1:
                        throw new Error("Base64 encoding incomplete: at least 2 bits missing");
                    case 2:
                        out[out.length] = bits >> 10;
                        break;
                    case 3:
                        out[out.length] = bits >> 16;
                        out[out.length] = bits >> 8 & 0xFF;
                        break;
                }
                return out;
            },
            re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
            unarmor: function unarmor(a) {
                var m = Base64.re.exec(a);
                if (m) {
                    if (m[1]) {
                        a = m[1];
                    } else if (m[2]) {
                        a = m[2];
                    } else {
                        throw new Error("RegExp out of sync");
                    }
                }
                return Base64.decode(a);
            }
        };

        var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";

        function int2char(n) {
            return BI_RM.charAt(n);
        }

        function BigInteger(a, b, c) {
            if (a != null) {
                if ("number" == typeof a) {
                    this.fromNumber(a, b, c);
                } else if (b == null && "string" != typeof a) {
                    this.fromString(a, 256);
                } else {
                    this.fromString(a, b);
                }
            }
        }

        //#region PUBLIC
        // BigInteger.prototype.toString = bnToString;
        // (public) return string representation in given radix
        BigInteger.prototype.toString = function (b) {
            if (this.s < 0) {
                return "-" + this.negate().toString(b);
            }
            var k;
            if (b == 16) {
                k = 4;
            } else if (b == 8) {
                k = 3;
            } else if (b == 2) {
                k = 1;
            } else if (b == 32) {
                k = 5;
            } else if (b == 4) {
                k = 2;
            } else {
                return this.toRadix(b);
            }
            var km = (1 << k) - 1;
            var d;
            var m = false;
            var r = "";
            var i = this.t;
            var p = this.DB - i * this.DB % k;
            if (i-- > 0) {
                if (p < this.DB && (d = this[i] >> p) > 0) {
                    m = true;
                    r = int2char(d);
                }
                while (i >= 0) {
                    if (p < k) {
                        d = (this[i] & (1 << p) - 1) << k - p;
                        d |= this[--i] >> (p += this.DB - k);
                    } else {
                        d = this[i] >> (p -= k) & km;
                        if (p <= 0) {
                            p += this.DB;
                            --i;
                        }
                    }
                    if (d > 0) {
                        m = true;
                    }
                    if (m) {
                        r += int2char(d);
                    }
                }
            }
            return m ? r : "0";
        };
        // BigInteger.prototype.negate = bnNegate;
        // (public) -this
        BigInteger.prototype.negate = function () {
            var r = nbi();
            BigInteger.ZERO.subTo(this, r);
            return r;
        };
        // BigInteger.prototype.abs = bnAbs;
        // (public) |this|
        BigInteger.prototype.abs = function () {
            return this.s < 0 ? this.negate() : this;
        };
        // BigInteger.prototype.compareTo = bnCompareTo;
        // (public) return + if this > a, - if this < a, 0 if equal
        BigInteger.prototype.compareTo = function (a) {
            var r = this.s - a.s;
            if (r != 0) {
                return r;
            }
            var i = this.t;
            r = i - a.t;
            if (r != 0) {
                return this.s < 0 ? -r : r;
            }
            while (--i >= 0) {
                if ((r = this[i] - a[i]) != 0) {
                    return r;
                }
            }
            return 0;
        };
        // BigInteger.prototype.bitLength = bnBitLength;
        // (public) return the number of bits in "this"
        BigInteger.prototype.bitLength = function () {
            if (this.t <= 0) {
                return 0;
            }
            return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
        };
        // BigInteger.prototype.mod = bnMod;
        // (public) this mod a
        BigInteger.prototype.mod = function (a) {
            var r = nbi();
            this.abs().divRemTo(a, null, r);
            if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
                a.subTo(r, r);
            }
            return r;
        };
        // BigInteger.prototype.modPowInt = bnModPowInt;
        // (public) this^e % m, 0 <= e < 2^32
        BigInteger.prototype.modPowInt = function (e, m) {
            var z;
            if (e < 256 || m.isEven()) {
                z = new Classic(m);
            } else {
                z = new Montgomery(m);
            }
            return this.exp(e, z);
        };
        // BigInteger.prototype.clone = bnClone;
        // (public)
        BigInteger.prototype.clone = function () {
            var r = nbi();
            this.copyTo(r);
            return r;
        };
        // BigInteger.prototype.intValue = bnIntValue;
        // (public) return value as integer
        BigInteger.prototype.intValue = function () {
            if (this.s < 0) {
                if (this.t == 1) {
                    return this[0] - this.DV;
                } else if (this.t == 0) {
                    return -1;
                }
            } else if (this.t == 1) {
                return this[0];
            } else if (this.t == 0) {
                return 0;
            }
            // assumes 16 < DB < 32
            return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
        };
        // BigInteger.prototype.byteValue = bnByteValue;
        // (public) return value as byte
        BigInteger.prototype.byteValue = function () {
            return this.t == 0 ? this.s : this[0] << 24 >> 24;
        };
        // BigInteger.prototype.shortValue = bnShortValue;
        // (public) return value as short (assumes DB>=16)
        BigInteger.prototype.shortValue = function () {
            return this.t == 0 ? this.s : this[0] << 16 >> 16;
        };
        // BigInteger.prototype.signum = bnSigNum;
        // (public) 0 if this == 0, 1 if this > 0
        BigInteger.prototype.signum = function () {
            if (this.s < 0) {
                return -1;
            } else if (this.t <= 0 || this.t == 1 && this[0] <= 0) {
                return 0;
            } else {
                return 1;
            }
        };
        // BigInteger.prototype.toByteArray = bnToByteArray;
        // (public) convert to bigendian byte array
        BigInteger.prototype.toByteArray = function () {
            var i = this.t;
            var r = [];
            r[0] = this.s;
            var p = this.DB - i * this.DB % 8;
            var d;
            var k = 0;
            if (i-- > 0) {
                if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                    r[k++] = d | this.s << this.DB - p;
                }
                while (i >= 0) {
                    if (p < 8) {
                        d = (this[i] & (1 << p) - 1) << 8 - p;
                        d |= this[--i] >> (p += this.DB - 8);
                    } else {
                        d = this[i] >> (p -= 8) & 0xff;
                        if (p <= 0) {
                            p += this.DB;
                            --i;
                        }
                    }
                    if ((d & 0x80) != 0) {
                        d |= -256;
                    }
                    if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                        ++k;
                    }
                    if (k > 0 || d != this.s) {
                        r[k++] = d;
                    }
                }
            }
            return r;
        };
        // BigInteger.prototype.equals = bnEquals;
        BigInteger.prototype.equals = function (a) {
            return this.compareTo(a) == 0;
        };
        // BigInteger.prototype.min = bnMin;
        BigInteger.prototype.min = function (a) {
            return this.compareTo(a) < 0 ? this : a;
        };
        // BigInteger.prototype.max = bnMax;
        BigInteger.prototype.max = function (a) {
            return this.compareTo(a) > 0 ? this : a;
        };
        // BigInteger.prototype.and = bnAnd;
        BigInteger.prototype.and = function (a) {
            var r = nbi();
            this.bitwiseTo(a, op_and, r);
            return r;
        };
        // BigInteger.prototype.or = bnOr;
        BigInteger.prototype.or = function (a) {
            var r = nbi();
            this.bitwiseTo(a, op_or, r);
            return r;
        };
        // BigInteger.prototype.xor = bnXor;
        BigInteger.prototype.xor = function (a) {
            var r = nbi();
            this.bitwiseTo(a, op_xor, r);
            return r;
        };
        // BigInteger.prototype.andNot = bnAndNot;
        BigInteger.prototype.andNot = function (a) {
            var r = nbi();
            this.bitwiseTo(a, op_andnot, r);
            return r;
        };
        // BigInteger.prototype.not = bnNot;
        // (public) ~this
        BigInteger.prototype.not = function () {
            var r = nbi();
            for (var i = 0; i < this.t; ++i) {
                r[i] = this.DM & ~this[i];
            }
            r.t = this.t;
            r.s = ~this.s;
            return r;
        };
        // BigInteger.prototype.shiftLeft = bnShiftLeft;
        // (public) this << n
        BigInteger.prototype.shiftLeft = function (n) {
            var r = nbi();
            if (n < 0) {
                this.rShiftTo(-n, r);
            } else {
                this.lShiftTo(n, r);
            }
            return r;
        };
        // BigInteger.prototype.shiftRight = bnShiftRight;
        // (public) this >> n
        BigInteger.prototype.shiftRight = function (n) {
            var r = nbi();
            if (n < 0) {
                this.lShiftTo(-n, r);
            } else {
                this.rShiftTo(n, r);
            }
            return r;
        };
        // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
        // (public) returns index of lowest 1-bit (or -1 if none)
        BigInteger.prototype.getLowestSetBit = function () {
            for (var i = 0; i < this.t; ++i) {
                if (this[i] != 0) {
                    return i * this.DB + lbit(this[i]);
                }
            }
            if (this.s < 0) {
                return this.t * this.DB;
            }
            return -1;
        };
        // BigInteger.prototype.bitCount = bnBitCount;
        // (public) return number of set bits
        BigInteger.prototype.bitCount = function () {
            var r = 0;
            var x = this.s & this.DM;
            for (var i = 0; i < this.t; ++i) {
                r += cbit(this[i] ^ x);
            }
            return r;
        };
        // BigInteger.prototype.testBit = bnTestBit;
        // (public) true iff nth bit is set
        BigInteger.prototype.testBit = function (n) {
            var j = Math.floor(n / this.DB);
            if (j >= this.t) {
                return this.s != 0;
            }
            return (this[j] & 1 << n % this.DB) != 0;
        };
        // BigInteger.prototype.setBit = bnSetBit;
        // (public) this | (1<<n)
        BigInteger.prototype.setBit = function (n) {
            return this.changeBit(n, op_or);
        };
        // BigInteger.prototype.clearBit = bnClearBit;
        // (public) this & ~(1<<n)
        BigInteger.prototype.clearBit = function (n) {
            return this.changeBit(n, op_andnot);
        };
        // BigInteger.prototype.flipBit = bnFlipBit;
        // (public) this ^ (1<<n)
        BigInteger.prototype.flipBit = function (n) {
            return this.changeBit(n, op_xor);
        };
        // BigInteger.prototype.add = bnAdd;
        // (public) this + a
        BigInteger.prototype.add = function (a) {
            var r = nbi();
            this.addTo(a, r);
            return r;
        };
        // BigInteger.prototype.subtract = bnSubtract;
        // (public) this - a
        BigInteger.prototype.subtract = function (a) {
            var r = nbi();
            this.subTo(a, r);
            return r;
        };
        // BigInteger.prototype.multiply = bnMultiply;
        // (public) this * a
        BigInteger.prototype.multiply = function (a) {
            var r = nbi();
            this.multiplyTo(a, r);
            return r;
        };
        // BigInteger.prototype.divide = bnDivide;
        // (public) this / a
        BigInteger.prototype.divide = function (a) {
            var r = nbi();
            this.divRemTo(a, r, null);
            return r;
        };
        // BigInteger.prototype.remainder = bnRemainder;
        // (public) this % a
        BigInteger.prototype.remainder = function (a) {
            var r = nbi();
            this.divRemTo(a, null, r);
            return r;
        };
        // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
        // (public) [this/a,this%a]
        BigInteger.prototype.divideAndRemainder = function (a) {
            var q = nbi();
            var r = nbi();
            this.divRemTo(a, q, r);
            return [q, r];
        };
        // BigInteger.prototype.modPow = bnModPow;
        // (public) this^e % m (HAC 14.85)
        BigInteger.prototype.modPow = function (e, m) {
            var i = e.bitLength();
            var k;
            var r = nbv(1);
            var z;
            if (i <= 0) {
                return r;
            } else if (i < 18) {
                k = 1;
            } else if (i < 48) {
                k = 3;
            } else if (i < 144) {
                k = 4;
            } else if (i < 768) {
                k = 5;
            } else {
                k = 6;
            }
            if (i < 8) {
                z = new Classic(m);
            } else if (m.isEven()) {
                z = new Barrett(m);
            } else {
                z = new Montgomery(m);
            }
            // precomputation
            var g = [];
            var n = 3;
            var k1 = k - 1;
            var km = (1 << k) - 1;
            g[1] = z.convert(this);
            if (k > 1) {
                var g2 = nbi();
                z.sqrTo(g[1], g2);
                while (n <= km) {
                    g[n] = nbi();
                    z.mulTo(g2, g[n - 2], g[n]);
                    n += 2;
                }
            }
            var j = e.t - 1;
            var w;
            var is1 = true;
            var r2 = nbi();
            var t;
            i = nbits(e[j]) - 1;
            while (j >= 0) {
                if (i >= k1) {
                    w = e[j] >> i - k1 & km;
                } else {
                    w = (e[j] & (1 << i + 1) - 1) << k1 - i;
                    if (j > 0) {
                        w |= e[j - 1] >> this.DB + i - k1;
                    }
                }
                n = k;
                while ((w & 1) == 0) {
                    w >>= 1;
                    --n;
                }
                if ((i -= n) < 0) {
                    i += this.DB;
                    --j;
                }
                if (is1) {
                    // ret == 1, don't bother squaring or multiplying it
                    g[w].copyTo(r);
                    is1 = false;
                } else {
                    while (n > 1) {
                        z.sqrTo(r, r2);
                        z.sqrTo(r2, r);
                        n -= 2;
                    }
                    if (n > 0) {
                        z.sqrTo(r, r2);
                    } else {
                        t = r;
                        r = r2;
                        r2 = t;
                    }
                    z.mulTo(r2, g[w], r);
                }
                while (j >= 0 && (e[j] & 1 << i) == 0) {
                    z.sqrTo(r, r2);
                    t = r;
                    r = r2;
                    r2 = t;
                    if (--i < 0) {
                        i = this.DB - 1;
                        --j;
                    }
                }
            }
            return z.revert(r);
        };
        // BigInteger.prototype.modInverse = bnModInverse;
        // (public) 1/this % m (HAC 14.61)
        BigInteger.prototype.modInverse = function (m) {
            var ac = m.isEven();
            if (this.isEven() && ac || m.signum() == 0) {
                return BigInteger.ZERO;
            }
            var u = m.clone();
            var v = this.clone();
            var a = nbv(1);
            var b = nbv(0);
            var c = nbv(0);
            var d = nbv(1);
            while (u.signum() != 0) {
                while (u.isEven()) {
                    u.rShiftTo(1, u);
                    if (ac) {
                        if (!a.isEven() || !b.isEven()) {
                            a.addTo(this, a);
                            b.subTo(m, b);
                        }
                        a.rShiftTo(1, a);
                    } else if (!b.isEven()) {
                        b.subTo(m, b);
                    }
                    b.rShiftTo(1, b);
                }
                while (v.isEven()) {
                    v.rShiftTo(1, v);
                    if (ac) {
                        if (!c.isEven() || !d.isEven()) {
                            c.addTo(this, c);
                            d.subTo(m, d);
                        }
                        c.rShiftTo(1, c);
                    } else if (!d.isEven()) {
                        d.subTo(m, d);
                    }
                    d.rShiftTo(1, d);
                }
                if (u.compareTo(v) >= 0) {
                    u.subTo(v, u);
                    if (ac) {
                        a.subTo(c, a);
                    }
                    b.subTo(d, b);
                } else {
                    v.subTo(u, v);
                    if (ac) {
                        c.subTo(a, c);
                    }
                    d.subTo(b, d);
                }
            }
            if (v.compareTo(BigInteger.ONE) != 0) {
                return BigInteger.ZERO;
            }
            if (d.compareTo(m) >= 0) {
                return d.subtract(m);
            }
            if (d.signum() < 0) {
                d.addTo(m, d);
            } else {
                return d;
            }
            if (d.signum() < 0) {
                return d.add(m);
            } else {
                return d;
            }
        };
        // BigInteger.prototype.pow = bnPow;
        // (public) this^e
        BigInteger.prototype.pow = function (e) {
            return this.exp(e, new NullExp());
        };
        // BigInteger.prototype.gcd = bnGCD;
        // (public) gcd(this,a) (HAC 14.54)
        BigInteger.prototype.gcd = function (a) {
            var x = this.s < 0 ? this.negate() : this.clone();
            var y = a.s < 0 ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
                var t = x;
                x = y;
                y = t;
            }
            var i = x.getLowestSetBit();
            var g = y.getLowestSetBit();
            if (g < 0) {
                return x;
            }
            if (i < g) {
                g = i;
            }
            if (g > 0) {
                x.rShiftTo(g, x);
                y.rShiftTo(g, y);
            }
            while (x.signum() > 0) {
                if ((i = x.getLowestSetBit()) > 0) {
                    x.rShiftTo(i, x);
                }
                if ((i = y.getLowestSetBit()) > 0) {
                    y.rShiftTo(i, y);
                }
                if (x.compareTo(y) >= 0) {
                    x.subTo(y, x);
                    x.rShiftTo(1, x);
                } else {
                    y.subTo(x, y);
                    y.rShiftTo(1, y);
                }
            }
            if (g > 0) {
                y.lShiftTo(g, y);
            }
            return y;
        };
        // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
        // (public) test primality with certainty >= 1-.5^t
        BigInteger.prototype.isProbablePrime = function (t) {
            var i;
            var x = this.abs();
            if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
                for (i = 0; i < lowprimes.length; ++i) {
                    if (x[0] == lowprimes[i]) {
                        return true;
                    }
                }
                return false;
            }
            if (x.isEven()) {
                return false;
            }
            i = 1;
            while (i < lowprimes.length) {
                var m = lowprimes[i];
                var j = i + 1;
                while (j < lowprimes.length && m < lplim) {
                    m *= lowprimes[j++];
                }
                m = x.modInt(m);
                while (i < j) {
                    if (m % lowprimes[i++] == 0) {
                        return false;
                    }
                }
            }
            return x.millerRabin(t);
        };
        //#endregion PUBLIC
        //#region PROTECTED
        // BigInteger.prototype.copyTo = bnpCopyTo;
        // (protected) copy this to r
        BigInteger.prototype.copyTo = function (r) {
            for (var i = this.t - 1; i >= 0; --i) {
                r[i] = this[i];
            }
            r.t = this.t;
            r.s = this.s;
        };
        // BigInteger.prototype.fromInt = bnpFromInt;
        // (protected) set from integer value x, -DV <= x < DV
        BigInteger.prototype.fromInt = function (x) {
            this.t = 1;
            this.s = x < 0 ? -1 : 0;
            if (x > 0) {
                this[0] = x;
            } else if (x < -1) {
                this[0] = x + this.DV;
            } else {
                this.t = 0;
            }
        };
        // BigInteger.prototype.fromString = bnpFromString;
        // (protected) set from string and radix
        BigInteger.prototype.fromString = function (s, b) {
            var k;
            if (b == 16) {
                k = 4;
            } else if (b == 8) {
                k = 3;
            } else if (b == 256) {
                k = 8;
                /* byte array */
            } else if (b == 2) {
                k = 1;
            } else if (b == 32) {
                k = 5;
            } else if (b == 4) {
                k = 2;
            } else {
                this.fromRadix(s, b);
                return;
            }
            this.t = 0;
            this.s = 0;
            var i = s.length;
            var mi = false;
            var sh = 0;
            while (--i >= 0) {
                var x = k == 8 ? +s[i] & 0xff : intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-") {
                        mi = true;
                    }
                    continue;
                }
                mi = false;
                if (sh == 0) {
                    this[this.t++] = x;
                } else if (sh + k > this.DB) {
                    this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
                    this[this.t++] = x >> this.DB - sh;
                } else {
                    this[this.t - 1] |= x << sh;
                }
                sh += k;
                if (sh >= this.DB) {
                    sh -= this.DB;
                }
            }
            if (k == 8 && (+s[0] & 0x80) != 0) {
                this.s = -1;
                if (sh > 0) {
                    this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
                }
            }
            this.clamp();
            if (mi) {
                BigInteger.ZERO.subTo(this, this);
            }
        };
        // BigInteger.prototype.clamp = bnpClamp;
        // (protected) clamp off excess high words
        BigInteger.prototype.clamp = function () {
            var c = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == c) {
                --this.t;
            }
        };
        // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
        // (protected) r = this << n*DB
        BigInteger.prototype.dlShiftTo = function (n, r) {
            var i;
            for (i = this.t - 1; i >= 0; --i) {
                r[i + n] = this[i];
            }
            for (i = n - 1; i >= 0; --i) {
                r[i] = 0;
            }
            r.t = this.t + n;
            r.s = this.s;
        };
        // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
        // (protected) r = this >> n*DB
        BigInteger.prototype.drShiftTo = function (n, r) {
            for (var i = n; i < this.t; ++i) {
                r[i - n] = this[i];
            }
            r.t = Math.max(this.t - n, 0);
            r.s = this.s;
        };
        // BigInteger.prototype.lShiftTo = bnpLShiftTo;
        // (protected) r = this << n
        BigInteger.prototype.lShiftTo = function (n, r) {
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << cbs) - 1;
            var ds = Math.floor(n / this.DB);
            var c = this.s << bs & this.DM;
            for (var i = this.t - 1; i >= 0; --i) {
                r[i + ds + 1] = this[i] >> cbs | c;
                c = (this[i] & bm) << bs;
            }
            for (var i = ds - 1; i >= 0; --i) {
                r[i] = 0;
            }
            r[ds] = c;
            r.t = this.t + ds + 1;
            r.s = this.s;
            r.clamp();
        };
        // BigInteger.prototype.rShiftTo = bnpRShiftTo;
        // (protected) r = this >> n
        BigInteger.prototype.rShiftTo = function (n, r) {
            r.s = this.s;
            var ds = Math.floor(n / this.DB);
            if (ds >= this.t) {
                r.t = 0;
                return;
            }
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << bs) - 1;
            r[0] = this[ds] >> bs;
            for (var i = ds + 1; i < this.t; ++i) {
                r[i - ds - 1] |= (this[i] & bm) << cbs;
                r[i - ds] = this[i] >> bs;
            }
            if (bs > 0) {
                r[this.t - ds - 1] |= (this.s & bm) << cbs;
            }
            r.t = this.t - ds;
            r.clamp();
        };
        // BigInteger.prototype.subTo = bnpSubTo;
        // (protected) r = this - a
        BigInteger.prototype.subTo = function (a, r) {
            var i = 0;
            var c = 0;
            var m = Math.min(a.t, this.t);
            while (i < m) {
                c += this[i] - a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            if (a.t < this.t) {
                c -= a.s;
                while (i < this.t) {
                    c += this[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += this.s;
            } else {
                c += this.s;
                while (i < a.t) {
                    c -= a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c -= a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c < -1) {
                r[i++] = this.DV + c;
            } else if (c > 0) {
                r[i++] = c;
            }
            r.t = i;
            r.clamp();
        };
        // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
        // (protected) r = this * a, r != this,a (HAC 14.12)
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyTo = function (a, r) {
            var x = this.abs();
            var y = a.abs();
            var i = x.t;
            r.t = i + y.t;
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = 0; i < y.t; ++i) {
                r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
            }
            r.s = 0;
            r.clamp();
            if (this.s != a.s) {
                BigInteger.ZERO.subTo(r, r);
            }
        };
        // BigInteger.prototype.squareTo = bnpSquareTo;
        // (protected) r = this^2, r != this (HAC 14.16)
        BigInteger.prototype.squareTo = function (r) {
            var x = this.abs();
            var i = r.t = 2 * x.t;
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = 0; i < x.t - 1; ++i) {
                var c = x.am(i, x[i], r, 2 * i, 0, 1);
                if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                    r[i + x.t] -= x.DV;
                    r[i + x.t + 1] = 1;
                }
            }
            if (r.t > 0) {
                r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
            }
            r.s = 0;
            r.clamp();
        };
        // BigInteger.prototype.divRemTo = bnpDivRemTo;
        // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
        // r != q, this != m.  q or r may be null.
        BigInteger.prototype.divRemTo = function (m, q, r) {
            var pm = m.abs();
            if (pm.t <= 0) {
                return;
            }
            var pt = this.abs();
            if (pt.t < pm.t) {
                if (q != null) {
                    q.fromInt(0);
                }
                if (r != null) {
                    this.copyTo(r);
                }
                return;
            }
            if (r == null) {
                r = nbi();
            }
            var y = nbi();
            var ts = this.s;
            var ms = m.s;
            var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
            if (nsh > 0) {
                pm.lShiftTo(nsh, y);
                pt.lShiftTo(nsh, r);
            } else {
                pm.copyTo(y);
                pt.copyTo(r);
            }
            var ys = y.t;
            var y0 = y[ys - 1];
            if (y0 == 0) {
                return;
            }
            var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
            var d1 = this.FV / yt;
            var d2 = (1 << this.F1) / yt;
            var e = 1 << this.F2;
            var i = r.t;
            var j = i - ys;
            var t = q == null ? nbi() : q;
            y.dlShiftTo(j, t);
            if (r.compareTo(t) >= 0) {
                r[r.t++] = 1;
                r.subTo(t, r);
            }
            BigInteger.ONE.dlShiftTo(ys, t);
            t.subTo(y, y); // "negative" y so we can replace sub with am later
            while (y.t < ys) {
                y[y.t++] = 0;
            }
            while (--j >= 0) {
                // Estimate quotient digit
                var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
                if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                    // Try it out
                    y.dlShiftTo(j, t);
                    r.subTo(t, r);
                    while (r[i] < --qd) {
                        r.subTo(t, r);
                    }
                }
            }
            if (q != null) {
                r.drShiftTo(ys, q);
                if (ts != ms) {
                    BigInteger.ZERO.subTo(q, q);
                }
            }
            r.t = ys;
            r.clamp();
            if (nsh > 0) {
                r.rShiftTo(nsh, r);
            } // Denormalize remainder
            if (ts < 0) {
                BigInteger.ZERO.subTo(r, r);
            }
        };
        // BigInteger.prototype.invDigit = bnpInvDigit;
        // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
        // justification:
        //         xy == 1 (mod m)
        //         xy =  1+km
        //   xy(2-xy) = (1+km)(1-km)
        // x[y(2-xy)] = 1-k^2m^2
        // x[y(2-xy)] == 1 (mod m^2)
        // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
        // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
        // JS multiply "overflows" differently from C/C++, so care is needed here.
        BigInteger.prototype.invDigit = function () {
            if (this.t < 1) {
                return 0;
            }
            var x = this[0];
            if ((x & 1) == 0) {
                return 0;
            }
            var y = x & 3; // y == 1/x mod 2^2
            y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4
            y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8
            y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
            // last step - calculate inverse mod DV directly;
            // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
            y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
            // we really want the negative inverse, and -DV < y < DV
            return y > 0 ? this.DV - y : -y;
        };
        // BigInteger.prototype.isEven = bnpIsEven;
        // (protected) true iff this is even
        BigInteger.prototype.isEven = function () {
            return (this.t > 0 ? this[0] & 1 : this.s) == 0;
        };
        // BigInteger.prototype.exp = bnpExp;
        // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
        BigInteger.prototype.exp = function (e, z) {
            if (e > 0xffffffff || e < 1) {
                return BigInteger.ONE;
            }
            var r = nbi();
            var r2 = nbi();
            var g = z.convert(this);
            var i = nbits(e) - 1;
            g.copyTo(r);
            while (--i >= 0) {
                z.sqrTo(r, r2);
                if ((e & 1 << i) > 0) {
                    z.mulTo(r2, g, r);
                } else {
                    var t = r;
                    r = r2;
                    r2 = t;
                }
            }
            return z.revert(r);
        };
        // BigInteger.prototype.chunkSize = bnpChunkSize;
        // (protected) return x s.t. r^x < DV
        BigInteger.prototype.chunkSize = function (r) {
            return Math.floor(Math.LN2 * this.DB / Math.log(r));
        };
        // BigInteger.prototype.toRadix = bnpToRadix;
        // (protected) convert to radix string
        BigInteger.prototype.toRadix = function (b) {
            if (b == null) {
                b = 10;
            }
            if (this.signum() == 0 || b < 2 || b > 36) {
                return "0";
            }
            var cs = this.chunkSize(b);
            var a = Math.pow(b, cs);
            var d = nbv(a);
            var y = nbi();
            var z = nbi();
            var r = "";
            this.divRemTo(d, y, z);
            while (y.signum() > 0) {
                r = (a + z.intValue()).toString(b).substr(1) + r;
                y.divRemTo(d, y, z);
            }
            return z.intValue().toString(b) + r;
        };
        // BigInteger.prototype.fromRadix = bnpFromRadix;
        // (protected) convert from radix string
        BigInteger.prototype.fromRadix = function (s, b) {
            this.fromInt(0);
            if (b == null) {
                b = 10;
            }
            var cs = this.chunkSize(b);
            var d = Math.pow(b, cs);
            var mi = false;
            var j = 0;
            var w = 0;
            for (var i = 0; i < s.length; ++i) {
                var x = intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-" && this.signum() == 0) {
                        mi = true;
                    }
                    continue;
                }
                w = b * w + x;
                if (++j >= cs) {
                    this.dMultiply(d);
                    this.dAddOffset(w, 0);
                    j = 0;
                    w = 0;
                }
            }
            if (j > 0) {
                this.dMultiply(Math.pow(b, j));
                this.dAddOffset(w, 0);
            }
            if (mi) {
                BigInteger.ZERO.subTo(this, this);
            }
        };
        // BigInteger.prototype.fromNumber = bnpFromNumber;
        // (protected) alternate constructor
        BigInteger.prototype.fromNumber = function (a, b, c) {
            if ("number" == typeof b) {
                // new BigInteger(int,int,RNG)
                if (a < 2) {
                    this.fromInt(1);
                } else {
                    this.fromNumber(a, c);
                    if (!this.testBit(a - 1)) {
                        // force MSB set
                        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                    }
                    if (this.isEven()) {
                        this.dAddOffset(1, 0);
                    } // force odd
                    while (!this.isProbablePrime(b)) {
                        this.dAddOffset(2, 0);
                        if (this.bitLength() > a) {
                            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                        }
                    }
                }
            } else {
                // new BigInteger(int,RNG)
                var x = [];
                var t = a & 7;
                x.length = (a >> 3) + 1;
                b.nextBytes(x);
                if (t > 0) {
                    x[0] &= (1 << t) - 1;
                } else {
                    x[0] = 0;
                }
                this.fromString(x, 256);
            }
        };
        // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
        // (protected) r = this op a (bitwise)
        BigInteger.prototype.bitwiseTo = function (a, op, r) {
            var i;
            var f;
            var m = Math.min(a.t, this.t);
            for (i = 0; i < m; ++i) {
                r[i] = op(this[i], a[i]);
            }
            if (a.t < this.t) {
                f = a.s & this.DM;
                for (i = m; i < this.t; ++i) {
                    r[i] = op(this[i], f);
                }
                r.t = this.t;
            } else {
                f = this.s & this.DM;
                for (i = m; i < a.t; ++i) {
                    r[i] = op(f, a[i]);
                }
                r.t = a.t;
            }
            r.s = op(this.s, a.s);
            r.clamp();
        };
        // BigInteger.prototype.changeBit = bnpChangeBit;
        // (protected) this op (1<<n)
        BigInteger.prototype.changeBit = function (n, op) {
            var r = BigInteger.ONE.shiftLeft(n);
            this.bitwiseTo(r, op, r);
            return r;
        };
        // BigInteger.prototype.addTo = bnpAddTo;
        // (protected) r = this + a
        BigInteger.prototype.addTo = function (a, r) {
            var i = 0;
            var c = 0;
            var m = Math.min(a.t, this.t);
            while (i < m) {
                c += this[i] + a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            if (a.t < this.t) {
                c += a.s;
                while (i < this.t) {
                    c += this[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += this.s;
            } else {
                c += this.s;
                while (i < a.t) {
                    c += a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c > 0) {
                r[i++] = c;
            } else if (c < -1) {
                r[i++] = this.DV + c;
            }
            r.t = i;
            r.clamp();
        };
        // BigInteger.prototype.dMultiply = bnpDMultiply;
        // (protected) this *= n, this >= 0, 1 < n < DV
        BigInteger.prototype.dMultiply = function (n) {
            this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp();
        };
        // BigInteger.prototype.dAddOffset = bnpDAddOffset;
        // (protected) this += n << w words, this >= 0
        BigInteger.prototype.dAddOffset = function (n, w) {
            if (n == 0) {
                return;
            }
            while (this.t <= w) {
                this[this.t++] = 0;
            }
            this[w] += n;
            while (this[w] >= this.DV) {
                this[w] -= this.DV;
                if (++w >= this.t) {
                    this[this.t++] = 0;
                }
                ++this[w];
            }
        };
        // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
        // (protected) r = lower n words of "this * a", a.t <= n
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
            var i = Math.min(this.t + a.t, n);
            r.s = 0; // assumes a,this >= 0
            r.t = i;
            while (i > 0) {
                r[--i] = 0;
            }
            for (var j = r.t - this.t; i < j; ++i) {
                r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
            }
            for (var j = Math.min(a.t, n); i < j; ++i) {
                this.am(0, a[i], r, i, 0, n - i);
            }
            r.clamp();
        };
        // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
        // (protected) r = "this * a" without lower n words, n > 0
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
            --n;
            var i = r.t = this.t + a.t - n;
            r.s = 0; // assumes a,this >= 0
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
                r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
            }
            r.clamp();
            r.drShiftTo(1, r);
        };
        // BigInteger.prototype.modInt = bnpModInt;
        // (protected) this % n, n < 2^26
        BigInteger.prototype.modInt = function (n) {
            if (n <= 0) {
                return 0;
            }
            var d = this.DV % n;
            var r = this.s < 0 ? n - 1 : 0;
            if (this.t > 0) {
                if (d == 0) {
                    r = this[0] % n;
                } else {
                    for (var i = this.t - 1; i >= 0; --i) {
                        r = (d * r + this[i]) % n;
                    }
                }
            }
            return r;
        };
        // BigInteger.prototype.millerRabin = bnpMillerRabin;
        // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
        BigInteger.prototype.millerRabin = function (t) {
            var n1 = this.subtract(BigInteger.ONE);
            var k = n1.getLowestSetBit();
            if (k <= 0) {
                return false;
            }
            var r = n1.shiftRight(k);
            t = t + 1 >> 1;
            if (t > lowprimes.length) {
                t = lowprimes.length;
            }
            var a = nbi();
            for (var i = 0; i < t; ++i) {
                // Pick bases at random, instead of starting at 2
                a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
                var y = a.modPow(r, this);
                if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                    var j = 1;
                    while (j++ < k && y.compareTo(n1) != 0) {
                        y = y.modPowInt(2, this);
                        if (y.compareTo(BigInteger.ONE) == 0) {
                            return false;
                        }
                    }
                    if (y.compareTo(n1) != 0) {
                        return false;
                    }
                }
            }
            return true;
        };
        // BigInteger.prototype.square = bnSquare;
        // (public) this^2
        BigInteger.prototype.square = function () {
            var r = nbi();
            this.squareTo(r);
            return r;
        };
        //#region ASYNC
        // Public API method
        BigInteger.prototype.gcda = function (a, callback) {
            var x = this.s < 0 ? this.negate() : this.clone();
            var y = a.s < 0 ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
                var t = x;
                x = y;
                y = t;
            }
            var i = x.getLowestSetBit();
            var g = y.getLowestSetBit();
            if (g < 0) {
                callback(x);
                return;
            }
            if (i < g) {
                g = i;
            }
            if (g > 0) {
                x.rShiftTo(g, x);
                y.rShiftTo(g, y);
            }
            // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
            var gcda1 = function gcda1() {
                if ((i = x.getLowestSetBit()) > 0) {
                    x.rShiftTo(i, x);
                }
                if ((i = y.getLowestSetBit()) > 0) {
                    y.rShiftTo(i, y);
                }
                if (x.compareTo(y) >= 0) {
                    x.subTo(y, x);
                    x.rShiftTo(1, x);
                } else {
                    y.subTo(x, y);
                    y.rShiftTo(1, y);
                }
                if (!(x.signum() > 0)) {
                    if (g > 0) {
                        y.lShiftTo(g, y);
                    }
                    setTimeout(function () {
                        callback(y);
                    }, 0); // escape
                } else {
                    setTimeout(gcda1, 0);
                }
            };
            setTimeout(gcda1, 10);
        };
        // (protected) alternate constructor
        BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
            if ("number" == typeof b) {
                if (a < 2) {
                    this.fromInt(1);
                } else {
                    this.fromNumber(a, c);
                    if (!this.testBit(a - 1)) {
                        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                    }
                    if (this.isEven()) {
                        this.dAddOffset(1, 0);
                    }
                    var bnp_1 = this;
                    var bnpfn1_1 = function bnpfn1_1() {
                        bnp_1.dAddOffset(2, 0);
                        if (bnp_1.bitLength() > a) {
                            bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                        }
                        if (bnp_1.isProbablePrime(b)) {
                            setTimeout(function () {
                                callback();
                            }, 0); // escape
                        } else {
                            setTimeout(bnpfn1_1, 0);
                        }
                    };
                    setTimeout(bnpfn1_1, 0);
                }
            } else {
                var x = [];
                var t = a & 7;
                x.length = (a >> 3) + 1;
                b.nextBytes(x);
                if (t > 0) {
                    x[0] &= (1 << t) - 1;
                } else {
                    x[0] = 0;
                }
                this.fromString(x, 256);
            }
        };

        //#region REDUCERS
        //#region NullExp
        var NullExp = /** @class */function () {
            function NullExp() {
            }

            // NullExp.prototype.convert = nNop;
            NullExp.prototype.convert = function (x) {
                return x;
            };
            // NullExp.prototype.revert = nNop;
            NullExp.prototype.revert = function (x) {
                return x;
            };
            // NullExp.prototype.mulTo = nMulTo;
            NullExp.prototype.mulTo = function (x, y, r) {
                x.multiplyTo(y, r);
            };
            // NullExp.prototype.sqrTo = nSqrTo;
            NullExp.prototype.sqrTo = function (x, r) {
                x.squareTo(r);
            };
            return NullExp;
        }();
        // Modular reduction using "classic" algorithm
        var Classic = /** @class */function () {
            function Classic(m) {
                this.m = m;
            }

            // Classic.prototype.convert = cConvert;
            Classic.prototype.convert = function (x) {
                if (x.s < 0 || x.compareTo(this.m) >= 0) {
                    return x.mod(this.m);
                } else {
                    return x;
                }
            };
            // Classic.prototype.revert = cRevert;
            Classic.prototype.revert = function (x) {
                return x;
            };
            // Classic.prototype.reduce = cReduce;
            Classic.prototype.reduce = function (x) {
                x.divRemTo(this.m, null, x);
            };
            // Classic.prototype.mulTo = cMulTo;
            Classic.prototype.mulTo = function (x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r);
            };
            // Classic.prototype.sqrTo = cSqrTo;
            Classic.prototype.sqrTo = function (x, r) {
                x.squareTo(r);
                this.reduce(r);
            };
            return Classic;
        }();
        //#endregion
        //#region Montgomery
        // Montgomery reduction
        var Montgomery = /** @class */function () {
            function Montgomery(m) {
                this.m = m;
                this.mp = m.invDigit();
                this.mpl = this.mp & 0x7fff;
                this.mph = this.mp >> 15;
                this.um = (1 << m.DB - 15) - 1;
                this.mt2 = 2 * m.t;
            }

            // Montgomery.prototype.convert = montConvert;
            // xR mod m
            Montgomery.prototype.convert = function (x) {
                var r = nbi();
                x.abs().dlShiftTo(this.m.t, r);
                r.divRemTo(this.m, null, r);
                if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
                    this.m.subTo(r, r);
                }
                return r;
            };
            // Montgomery.prototype.revert = montRevert;
            // x/R mod m
            Montgomery.prototype.revert = function (x) {
                var r = nbi();
                x.copyTo(r);
                this.reduce(r);
                return r;
            };
            // Montgomery.prototype.reduce = montReduce;
            // x = x/R mod m (HAC 14.32)
            Montgomery.prototype.reduce = function (x) {
                while (x.t <= this.mt2) {
                    // pad x so am has enough room later
                    x[x.t++] = 0;
                }
                for (var i = 0; i < this.m.t; ++i) {
                    // faster way of calculating u0 = x[i]*mp mod DV
                    var j = x[i] & 0x7fff;
                    var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
                    // use am to combine the multiply-shift-add into one call
                    j = i + this.m.t;
                    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
                    // propagate carry
                    while (x[j] >= x.DV) {
                        x[j] -= x.DV;
                        x[++j]++;
                    }
                }
                x.clamp();
                x.drShiftTo(this.m.t, x);
                if (x.compareTo(this.m) >= 0) {
                    x.subTo(this.m, x);
                }
            };
            // Montgomery.prototype.mulTo = montMulTo;
            // r = "xy/R mod m"; x,y != r
            Montgomery.prototype.mulTo = function (x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r);
            };
            // Montgomery.prototype.sqrTo = montSqrTo;
            // r = "x^2/R mod m"; x != r
            Montgomery.prototype.sqrTo = function (x, r) {
                x.squareTo(r);
                this.reduce(r);
            };
            return Montgomery;
        }();
        //#endregion Montgomery
        //#region Barrett
        // Barrett modular reduction
        var Barrett = /** @class */function () {
            function Barrett(m) {
                this.m = m;
                // setup Barrett
                this.r2 = nbi();
                this.q3 = nbi();
                BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
                this.mu = this.r2.divide(m);
            }

            // Barrett.prototype.convert = barrettConvert;
            Barrett.prototype.convert = function (x) {
                if (x.s < 0 || x.t > 2 * this.m.t) {
                    return x.mod(this.m);
                } else if (x.compareTo(this.m) < 0) {
                    return x;
                } else {
                    var r = nbi();
                    x.copyTo(r);
                    this.reduce(r);
                    return r;
                }
            };
            // Barrett.prototype.revert = barrettRevert;
            Barrett.prototype.revert = function (x) {
                return x;
            };
            // Barrett.prototype.reduce = barrettReduce;
            // x = x mod m (HAC 14.42)
            Barrett.prototype.reduce = function (x) {
                x.drShiftTo(this.m.t - 1, this.r2);
                if (x.t > this.m.t + 1) {
                    x.t = this.m.t + 1;
                    x.clamp();
                }
                this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
                this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
                while (x.compareTo(this.r2) < 0) {
                    x.dAddOffset(1, this.m.t + 1);
                }
                x.subTo(this.r2, x);
                while (x.compareTo(this.m) >= 0) {
                    x.subTo(this.m, x);
                }
            };
            // Barrett.prototype.mulTo = barrettMulTo;
            // r = x*y mod m; x,y != r
            Barrett.prototype.mulTo = function (x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r);
            };
            // Barrett.prototype.sqrTo = barrettSqrTo;
            // r = x^2 mod m; x != r
            Barrett.prototype.sqrTo = function (x, r) {
                x.squareTo(r);
                this.reduce(r);
            };
            return Barrett;
        }();
        //#endregion
        //#endregion REDUCERS
        // return new, unset BigInteger
        function nbi() {
            return new BigInteger(null);
        }

        function parseBigInt(str, r) {
            return new BigInteger(str, r);
        }

        function am3(i, x, w, j, c, n) {
            var xl = x & 0x3fff;
            var xh = x >> 14;
            while (--n >= 0) {
                var l = this[i] & 0x3fff;
                var h = this[i++] >> 14;
                var m = xh * l + h * xl;
                l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
                c = (l >> 28) + (m >> 14) + xh * h;
                w[j++] = l & 0xfffffff;
            }
            return c;
        }

        // Mozilla/Netscape seems to prefer am3
        BigInteger.prototype.am = am3;
        dbits = 28;
        BigInteger.prototype.DB = dbits;
        BigInteger.prototype.DM = (1 << dbits) - 1;
        BigInteger.prototype.DV = 1 << dbits;
        var BI_FP = 52;
        BigInteger.prototype.FV = Math.pow(2, BI_FP);
        BigInteger.prototype.F1 = BI_FP - dbits;
        BigInteger.prototype.F2 = 2 * dbits - BI_FP;
        // Digit conversions
        var BI_RC = [];
        var rr;
        var vv;
        rr = "0".charCodeAt(0);
        for (vv = 0; vv <= 9; ++vv) {
            BI_RC[rr++] = vv;
        }
        rr = "a".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) {
            BI_RC[rr++] = vv;
        }
        rr = "A".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) {
            BI_RC[rr++] = vv;
        }

        function intAt(s, i) {
            var c = BI_RC[s.charCodeAt(i)];
            return c == null ? -1 : c;
        }

        // return bigint initialized to value
        function nbv(i) {
            var r = nbi();
            r.fromInt(i);
            return r;
        }

        // returns bit length of the integer x
        function nbits(x) {
            var r = 1;
            var t;
            if ((t = x >>> 16) != 0) {
                x = t;
                r += 16;
            }
            if ((t = x >> 8) != 0) {
                x = t;
                r += 8;
            }
            if ((t = x >> 4) != 0) {
                x = t;
                r += 4;
            }
            if ((t = x >> 2) != 0) {
                x = t;
                r += 2;
            }
            if ((t = x >> 1) != 0) {
                x = t;
                r += 1;
            }
            return r;
        }

        // "constants"
        BigInteger.ZERO = nbv(0);
        BigInteger.ONE = nbv(1);

        // prng4.js - uses Arcfour as a PRNG
        var Arcfour = /** @class */function () {
            function Arcfour() {
                this.i = 0;
                this.j = 0;
                this.S = [];
            }

            // Arcfour.prototype.init = ARC4init;
            // Initialize arcfour context from key, an array of ints, each from [0..255]
            Arcfour.prototype.init = function (key) {
                var i;
                var j;
                var t;
                for (i = 0; i < 256; ++i) {
                    this.S[i] = i;
                }
                j = 0;
                for (i = 0; i < 256; ++i) {
                    j = j + this.S[i] + key[i % key.length] & 255;
                    t = this.S[i];
                    this.S[i] = this.S[j];
                    this.S[j] = t;
                }
                this.i = 0;
                this.j = 0;
            };
            // Arcfour.prototype.next = ARC4next;
            Arcfour.prototype.next = function () {
                var t;
                this.i = this.i + 1 & 255;
                this.j = this.j + this.S[this.i] & 255;
                t = this.S[this.i];
                this.S[this.i] = this.S[this.j];
                this.S[this.j] = t;
                return this.S[t + this.S[this.i] & 255];
            };
            return Arcfour;
        }();

        // Plug in your RNG constructor here
        function prng_newstate() {
            return new Arcfour();
        }

        // Pool size must be a multiple of 4 and greater than 32.
        // An array of bytes the size of the pool will be passed to init()
        var rng_psize = 256;

        // Random number generator - requires a PRNG backend, e.g. prng4.js
        var rng_state;
        var rng_pool = null;
        var rng_pptr;
        // Initialize the pool with junk if needed.
        if (rng_pool == null) {
            rng_pool = [];
            rng_pptr = 0;
            var t = void 0;
            // Extract entropy (2048 bits) from RNG if available
            var z = new Uint32Array(256);
            for (i = 0; i < z.length; i++) {
                z[i] = Math.random() * 10000000000;
            }
            for (t = 0; t < z.length; ++t) {
                rng_pool[rng_pptr++] = z[t] & 255;
            }
            // Use mouse events for entropy, if we do not have enough entropy by the time
            // we need it, entropy will be generated by Math.random.
            // var onMouseMoveListener_1 = function onMouseMoveListener_1(ev) {
            //     this.count = this.count || 0;
            //     if (this.count >= 256 || rng_pptr >= rng_psize) {
            //         if (window.removeEventListener) {
            //             window.removeEventListener("mousemove", onMouseMoveListener_1, false);
            //         } else if (window.detachEvent) {
            //             window.detachEvent("onmousemove", onMouseMoveListener_1);
            //         }
            //         return;
            //     }
            //     try {
            //         var mouseCoordinates = ev.x + ev.y;
            //         rng_pool[rng_pptr++] = mouseCoordinates & 255;
            //         this.count += 1;
            //     } catch (e) {
            //         // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
            //     }
            // };
            // if (window.addEventListener) {
            //     window.addEventListener("mousemove", onMouseMoveListener_1, false);
            // } else if (window.attachEvent) {
            //     window.attachEvent("onmousemove", onMouseMoveListener_1);
            // }
        }

        function rng_get_byte() {
            if (rng_state == null) {
                rng_state = prng_newstate();
                // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
                while (rng_pptr < rng_psize) {
                    var random = Math.floor(65536 * Math.random());
                    rng_pool[rng_pptr++] = random & 255;
                }
                rng_state.init(rng_pool);
                for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
                    rng_pool[rng_pptr] = 0;
                }
                rng_pptr = 0;
            }
            // TODO: allow reseeding after first request
            return rng_state.next();
        }

        function SecureRandom() {
        }

        SecureRandom.prototype.nextBytes = function (ba) {
            for (var i = 0; i < ba.length; ++i) {
                ba[i] = rng_get_byte();
            }
        };

        // Depends on jsbn.js and rng.js
        // function linebrk(s,n) {
        //   var ret = "";
        //   var i = 0;
        //   while(i + n < s.length) {
        //     ret += s.substring(i,i+n) + "\n";
        //     i += n;
        //   }
        //   return ret + s.substring(i,s.length);
        // }
        // function byte2Hex(b) {
        //   if(b < 0x10)
        //     return "0" + b.toString(16);
        //   else
        //     return b.toString(16);
        // }
        function pkcs1pad1(s, n) {
            if (n < s.length + 22) {
                console.error("Message too long for RSA");
                return null;
            }
            var len = n - s.length - 6;
            var filler = "";
            for (var f = 0; f < len; f += 2) {
                filler += "ff";
            }
            var m = "0001" + filler + "00" + s;
            return parseBigInt(m, 16);
        }

        // PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
        function pkcs1pad2(s, n) {
            if (n < s.length + 11) {
                // TODO: fix for utf-8
                console.error("Message too long for RSA");
                return null;
            }
            var ba = [];
            var i = s.length - 1;
            while (i >= 0 && n > 0) {
                var c = s.charCodeAt(i--);
                if (c < 128) {
                    // encode using utf-8
                    ba[--n] = c;
                } else if (c > 127 && c < 1024) {
                    ba[--n] = c & 63 | 128;
                    ba[--n] = c >> 6 | 192;
                } else {
                    ba[--n] = c & 63 | 128;
                    ba[--n] = c >> 6 & 63 | 128;
                    ba[--n] = c >> 12 | 224;
                }
            }
            ba[--n] = 0;
            var rng = new SecureRandom();
            var x = [];
            while (n > 2) {
                // random non-zero pad
                x[0] = 0;
                while (x[0] == 0) {
                    rng.nextBytes(x);
                }
                ba[--n] = x[0];
            }
            ba[--n] = 2;
            ba[--n] = 0;
            return new BigInteger(ba);
        }


        function Stream(enc, pos) {
            this.hexDigits = "0123456789ABCDEF";
            if (enc instanceof Stream) {
                this.enc = enc.enc;
                this.pos = enc.pos;
            } else {
                // enc should be an array or a binary string
                this.enc = enc;
                this.pos = pos;
            }
        }

        Stream.prototype.get = function (pos) {
            if (pos === undefined) {
                pos = this.pos++;
            }
            if (pos >= this.enc.length) {
                throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
            }
            return "string" === typeof this.enc ? this.enc.charCodeAt(pos) : this.enc[pos];
        };
        Stream.prototype.hexByte = function (b) {
            return this.hexDigits.charAt(b >> 4 & 0xF) + this.hexDigits.charAt(b & 0xF);
        };
        Stream.prototype.hexDump = function (start, end, raw) {
            var s = "";
            for (var i = start; i < end; ++i) {
                s += this.hexByte(this.get(i));
                if (raw !== true) {
                    switch (i & 0xF) {
                        case 0x7:
                            s += "  ";
                            break;
                        case 0xF:
                            s += "\n";
                            break;
                        default:
                            s += " ";
                    }
                }
            }
            return s;
        };
        Stream.prototype.isASCII = function (start, end) {
            for (var i = start; i < end; ++i) {
                var c = this.get(i);
                if (c < 32 || c > 176) {
                    return false;
                }
            }
            return true;
        };
        Stream.prototype.parseStringISO = function (start, end) {
            var s = "";
            for (var i = start; i < end; ++i) {
                s += String.fromCharCode(this.get(i));
            }
            return s;
        };
        Stream.prototype.parseStringUTF = function (start, end) {
            var s = "";
            for (var i = start; i < end;) {
                var c = this.get(i++);
                if (c < 128) {
                    s += String.fromCharCode(c);
                } else if (c > 191 && c < 224) {
                    s += String.fromCharCode((c & 0x1F) << 6 | this.get(i++) & 0x3F);
                } else {
                    s += String.fromCharCode((c & 0x0F) << 12 | (this.get(i++) & 0x3F) << 6 | this.get(i++) & 0x3F);
                }
            }
            return s;
        };
        Stream.prototype.parseStringBMP = function (start, end) {
            var str = "";
            var hi;
            var lo;
            for (var i = start; i < end;) {
                hi = this.get(i++);
                lo = this.get(i++);
                str += String.fromCharCode(hi << 8 | lo);
            }
            return str;
        };
        Stream.prototype.parseTime = function (start, end, shortYear) {
            var s = this.parseStringISO(start, end);
            var m = (shortYear ? reTimeS : reTimeL).exec(s);
            if (!m) {
                return "Unrecognized time: " + s;
            }
            if (shortYear) {
                // to avoid querying the timer, use the fixed range [1970, 2069]
                // it will conform with ITU X.400 [-10, +40] sliding window until 2030
                m[1] = +m[1];
                m[1] += +m[1] < 70 ? 2000 : 1900;
            }
            s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
            if (m[5]) {
                s += ":" + m[5];
                if (m[6]) {
                    s += ":" + m[6];
                    if (m[7]) {
                        s += "." + m[7];
                    }
                }
            }
            if (m[8]) {
                s += " UTC";
                if (m[8] != "Z") {
                    s += m[8];
                    if (m[9]) {
                        s += ":" + m[9];
                    }
                }
            }
            return s;
        };
        Stream.prototype.parseInteger = function (start, end) {
            var v = this.get(start);
            var neg = v > 127;
            var pad = neg ? 255 : 0;
            var len;
            var s = "";
            // skip unuseful bits (not allowed in DER)
            while (v == pad && ++start < end) {
                v = this.get(start);
            }
            len = end - start;
            if (len === 0) {
                return neg ? -1 : 0;
            }
            // show bit length of huge integers
            if (len > 4) {
                s = v;
                len <<= 3;
                while (((+s ^ pad) & 0x80) == 0) {
                    s = +s << 1;
                    --len;
                }
                s = "(" + len + " bit)\n";
            }
            // decode the integer
            if (neg) {
                v = v - 256;
            }
            var n = new Int10(v);
            for (var i = start + 1; i < end; ++i) {
                n.mulAdd(256, this.get(i));
            }
            return s + n.toString();
        };
        Stream.prototype.parseBitString = function (start, end, maxLength) {
            var unusedBit = this.get(start);
            var lenBit = (end - start - 1 << 3) - unusedBit;
            var intro = "(" + lenBit + " bit)\n";
            var s = "";
            for (var i = start + 1; i < end; ++i) {
                var b = this.get(i);
                var skip = i == end - 1 ? unusedBit : 0;
                for (var j = 7; j >= skip; --j) {
                    s += b >> j & 1 ? "1" : "0";
                }
                if (s.length > maxLength) {
                    return intro + stringCut(s, maxLength);
                }
            }
            return intro + s;
        };
        Stream.prototype.parseOctetString = function (start, end, maxLength) {
            if (this.isASCII(start, end)) {
                return stringCut(this.parseStringISO(start, end), maxLength);
            }
            var len = end - start;
            var s = "(" + len + " byte)\n";
            maxLength /= 2; // we work in bytes
            if (len > maxLength) {
                end = start + maxLength;
            }
            for (var i = start; i < end; ++i) {
                s += this.hexByte(this.get(i));
            }
            if (len > maxLength) {
                s += ellipsis;
            }
            return s;
        };
        Stream.prototype.parseOID = function (start, end, maxLength) {
            var s = "";
            var n = new Int10();
            var bits = 0;
            for (var i = start; i < end; ++i) {
                var v = this.get(i);
                n.mulAdd(128, v & 0x7F);
                bits += 7;
                if (!(v & 0x80)) {
                    // finished
                    if (s === "") {
                        n = n.simplify();
                        if (n instanceof Int10) {
                            n.sub(80);
                            s = "2." + n.toString();
                        } else {
                            var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                            s = m + "." + (n - m * 40);
                        }
                    } else {
                        s += "." + n.toString();
                    }
                    if (s.length > maxLength) {
                        return stringCut(s, maxLength);
                    }
                    n = new Int10();
                    bits = 0;
                }
            }
            if (bits > 0) {
                s += ".incomplete";
            }
            return s;
        };


        function ASN1(stream, header, length, tag, sub) {
            if (!(tag instanceof ASN1Tag)) {
                throw new Error("Invalid tag value.");
            }
            this.stream = stream;
            this.header = header;
            this.length = length;
            this.tag = tag;
            this.sub = sub;
        }

        ASN1.prototype.typeName = function () {
            switch (this.tag.tagClass) {
                case 0:
                    // universal
                    switch (this.tag.tagNumber) {
                        case 0x00:
                            return "EOC";
                        case 0x01:
                            return "BOOLEAN";
                        case 0x02:
                            return "INTEGER";
                        case 0x03:
                            return "BIT_STRING";
                        case 0x04:
                            return "OCTET_STRING";
                        case 0x05:
                            return "NULL";
                        case 0x06:
                            return "OBJECT_IDENTIFIER";
                        case 0x07:
                            return "ObjectDescriptor";
                        case 0x08:
                            return "EXTERNAL";
                        case 0x09:
                            return "REAL";
                        case 0x0A:
                            return "ENUMERATED";
                        case 0x0B:
                            return "EMBEDDED_PDV";
                        case 0x0C:
                            return "UTF8String";
                        case 0x10:
                            return "SEQUENCE";
                        case 0x11:
                            return "SET";
                        case 0x12:
                            return "NumericString";
                        case 0x13:
                            return "PrintableString"; // ASCII subset
                        case 0x14:
                            return "TeletexString"; // aka T61String
                        case 0x15:
                            return "VideotexString";
                        case 0x16:
                            return "IA5String"; // ASCII
                        case 0x17:
                            return "UTCTime";
                        case 0x18:
                            return "GeneralizedTime";
                        case 0x19:
                            return "GraphicString";
                        case 0x1A:
                            return "VisibleString"; // ASCII subset
                        case 0x1B:
                            return "GeneralString";
                        case 0x1C:
                            return "UniversalString";
                        case 0x1E:
                            return "BMPString";
                    }
                    return "Universal_" + this.tag.tagNumber.toString();
                case 1:
                    return "Application_" + this.tag.tagNumber.toString();
                case 2:
                    return "[" + this.tag.tagNumber.toString() + "]"; // Context
                case 3:
                    return "Private_" + this.tag.tagNumber.toString();
            }
        };
        ASN1.prototype.content = function (maxLength) {
            if (this.tag === undefined) {
                return null;
            }
            if (maxLength === undefined) {
                maxLength = Infinity;
            }
            var content = this.posContent();
            var len = Math.abs(this.length);
            if (!this.tag.isUniversal()) {
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                return this.stream.parseOctetString(content, content + len, maxLength);
            }
            switch (this.tag.tagNumber) {
                case 0x01:
                    // BOOLEAN
                    return this.stream.get(content) === 0 ? "false" : "true";
                case 0x02:
                    // INTEGER
                    return this.stream.parseInteger(content, content + len);
                case 0x03:
                    // BIT_STRING
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(content, content + len, maxLength);
                case 0x04:
                    // OCTET_STRING
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(content, content + len, maxLength);
                // case 0x05: // NULL
                case 0x06:
                    // OBJECT_IDENTIFIER
                    return this.stream.parseOID(content, content + len, maxLength);
                // case 0x07: // ObjectDescriptor
                // case 0x08: // EXTERNAL
                // case 0x09: // REAL
                // case 0x0A: // ENUMERATED
                // case 0x0B: // EMBEDDED_PDV
                case 0x10: // SEQUENCE
                case 0x11:
                    // SET
                    if (this.sub !== null) {
                        return "(" + this.sub.length + " elem)";
                    } else {
                        return "(no elem)";
                    }
                case 0x0C:
                    // UTF8String
                    return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
                case 0x12: // NumericString
                case 0x13: // PrintableString
                case 0x14: // TeletexString
                case 0x15: // VideotexString
                case 0x16: // IA5String
                // case 0x19: // GraphicString
                case 0x1A:
                    // VisibleString
                    // case 0x1B: // GeneralString
                    // case 0x1C: // UniversalString
                    return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
                case 0x1E:
                    // BMPString
                    return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
                case 0x17: // UTCTime
                case 0x18:
                    // GeneralizedTime
                    return this.stream.parseTime(content, content + len, this.tag.tagNumber == 0x17);
            }
            return null;
        };
        ASN1.prototype.toString = function () {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (this.sub === null ? "null" : this.sub.length) + "]";
        };
        ASN1.prototype.toPrettyString = function (indent) {
            if (indent === undefined) {
                indent = "";
            }
            var s = indent + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0) {
                s += "+";
            }
            s += this.length;
            if (this.tag.tagConstructed) {
                s += " (constructed)";
            } else if (this.tag.isUniversal() && (this.tag.tagNumber == 0x03 || this.tag.tagNumber == 0x04) && this.sub !== null) {
                s += " (encapsulates)";
            }
            s += "\n";
            if (this.sub !== null) {
                indent += "  ";
                for (var i = 0, max = this.sub.length; i < max; ++i) {
                    s += this.sub[i].toPrettyString(indent);
                }
            }
            return s;
        };
        ASN1.prototype.posStart = function () {
            return this.stream.pos;
        };
        ASN1.prototype.posContent = function () {
            return this.stream.pos + this.header;
        };
        ASN1.prototype.posEnd = function () {
            return this.stream.pos + this.header + Math.abs(this.length);
        };
        ASN1.prototype.toHexString = function () {
            return this.stream.hexDump(this.posStart(), this.posEnd(), true);
        };
        ASN1.decodeLength = function (stream) {
            var buf = stream.get();
            var len = buf & 0x7F;
            if (len == buf) {
                return len;
            }
            // no reason to use Int10, as it would be a huge buffer anyways
            if (len > 6) {
                throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
            }
            if (len === 0) {
                return null;
            } // undefined
            buf = 0;
            for (var i = 0; i < len; ++i) {
                buf = buf * 256 + stream.get();
            }
            return buf;
        };
        /**
         * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
         * @returns {string}
         * @public
         */
        ASN1.prototype.getHexStringValue = function () {
            var hexString = this.toHexString();
            var offset = this.header * 2;
            var length = this.length * 2;
            return hexString.substr(offset, length);
        };
        ASN1.decode = function (str) {
            var stream;
            if (!(str instanceof Stream)) {
                stream = new Stream(str, 0);
            } else {
                stream = str;
            }
            var streamStart = new Stream(stream);
            var tag = new ASN1Tag(stream);
            var len = ASN1.decodeLength(stream);
            var start = stream.pos;
            var header = start - streamStart.pos;
            var sub = null;
            var getSub = function getSub() {
                var ret = [];
                if (len !== null) {
                    // definite length
                    var end = start + len;
                    while (stream.pos < end) {
                        ret[ret.length] = ASN1.decode(stream);
                    }
                    if (stream.pos != end) {
                        throw new Error("Content size is not correct for container starting at offset " + start);
                    }
                } else {
                    // undefined length
                    try {
                        for (; ;) {
                            var s = ASN1.decode(stream);
                            if (s.tag.isEOC()) {
                                break;
                            }
                            ret[ret.length] = s;
                        }
                        len = start - stream.pos; // undefined lengths are represented as negative values
                    } catch (e) {
                        throw new Error("Exception while decoding undefined length content: " + e);
                    }
                }
                return ret;
            };
            if (tag.tagConstructed) {
                // must have valid content
                sub = getSub();
            } else if (tag.isUniversal() && (tag.tagNumber == 0x03 || tag.tagNumber == 0x04)) {
                // sometimes BitString and OctetString are used to encapsulate ASN.1
                try {
                    if (tag.tagNumber == 0x03) {
                        if (stream.get() != 0) {
                            throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                        }
                    }
                    sub = getSub();
                    for (var i = 0; i < sub.length; ++i) {
                        if (sub[i].tag.isEOC()) {
                            throw new Error("EOC is not supposed to be actual content.");
                        }
                    }
                } catch (e) {
                    // but silently ignore when they don't
                    sub = null;
                }
            }
            if (sub === null) {
                if (len === null) {
                    throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
                }
                stream.pos = start + Math.abs(len);
            }
            return new ASN1(streamStart, header, len, tag, sub);
        };

        function ASN1Tag(stream) {
            var buf = stream.get();
            this.tagClass = buf >> 6;
            this.tagConstructed = (buf & 0x20) !== 0;
            this.tagNumber = buf & 0x1F;
            if (this.tagNumber == 0x1F) {
                // long tag
                var n = new Int10();
                do {
                    buf = stream.get();
                    n.mulAdd(128, buf & 0x7F);
                } while (buf & 0x80);
                this.tagNumber = n.simplify();
            }
        }

        ASN1Tag.prototype.isUniversal = function () {
            return this.tagClass === 0x00;
        };
        ASN1Tag.prototype.isEOC = function () {
            return this.tagClass === 0x00 && this.tagNumber === 0x00;
        };

        function RSAKey() {
            this.n = null;
            this.e = 0;
            this.d = null;
            this.p = null;
            this.q = null;
            this.dmp1 = null;
            this.dmq1 = null;
            this.coeff = null;
        }

        //#region PROTECTED
        // protected
        // RSAKey.prototype.doPublic = RSADoPublic;
        // Perform raw public operation on "x": return x^e (mod n)
        RSAKey.prototype.doPublic = function (x) {
            return x.modPowInt(this.e, this.n);
        };
        // RSAKey.prototype.doPrivate = RSADoPrivate;
        // Perform raw private operation on "x": return x^d (mod n)
        RSAKey.prototype.doPrivate = function (x) {
            if (this.p == null || this.q == null) {
                return x.modPow(this.d, this.n);
            }
            // TODO: re-calculate any missing CRT params
            var xp = x.mod(this.p).modPow(this.dmp1, this.p);
            var xq = x.mod(this.q).modPow(this.dmq1, this.q);
            while (xp.compareTo(xq) < 0) {
                xp = xp.add(this.p);
            }
            return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
        };
        //#endregion PROTECTED
        //#region PUBLIC
        // RSAKey.prototype.setPublic = RSASetPublic;
        // Set the public key fields N and e from hex strings
        RSAKey.prototype.setPublic = function (N, E) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = parseBigInt(N, 16);
                this.e = parseInt(E, 16);
            } else {
                console.error("Invalid RSA public key");
            }
        };
        // RSAKey.prototype.encrypt = RSAEncrypt;
        // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
        RSAKey.prototype.encrypt = function (text) {

            var m = pkcs1pad2(text, this.n.bitLength() + 7 >> 3);
            if (m == null) {
                return null;
            }
            var c = this.doPublic(m);
            if (c == null) {
                return null;
            }
            var h = c.toString(16);
            if ((h.length & 1) == 0) {
                return h;
            } else {
                return "0" + h;
            }
        };
        // RSAKey.prototype.setPrivate = RSASetPrivate;
        // Set the private key fields N, e, and d from hex strings
        RSAKey.prototype.setPrivate = function (N, E, D) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = parseBigInt(N, 16);
                this.e = parseInt(E, 16);
                this.d = parseBigInt(D, 16);
            } else {
                console.error("Invalid RSA private key");
            }
        };
        // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
        // Set the private key fields N, e, d and CRT params from hex strings
        RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = parseBigInt(N, 16);
                this.e = parseInt(E, 16);
                this.d = parseBigInt(D, 16);
                this.p = parseBigInt(P, 16);
                this.q = parseBigInt(Q, 16);
                this.dmp1 = parseBigInt(DP, 16);
                this.dmq1 = parseBigInt(DQ, 16);
                this.coeff = parseBigInt(C, 16);
            } else {
                console.error("Invalid RSA private key");
            }
        };
        // RSAKey.prototype.generate = RSAGenerate;
        // Generate a new random private key B bits long, using public expt E
        RSAKey.prototype.generate = function (B, E) {
            var rng = new SecureRandom();
            var qs = B >> 1;
            this.e = parseInt(E, 16);
            var ee = new BigInteger(E, 16);
            for (; ;) {
                for (; ;) {
                    this.p = new BigInteger(B - qs, 1, rng);
                    if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                        break;
                    }
                }
                for (; ;) {
                    this.q = new BigInteger(qs, 1, rng);
                    if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                        break;
                    }
                }
                if (this.p.compareTo(this.q) <= 0) {
                    var t = this.p;
                    this.p = this.q;
                    this.q = t;
                }
                var p1 = this.p.subtract(BigInteger.ONE);
                var q1 = this.q.subtract(BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                    this.n = this.p.multiply(this.q);
                    this.d = ee.modInverse(phi);
                    this.dmp1 = this.d.mod(p1);
                    this.dmq1 = this.d.mod(q1);
                    this.coeff = this.q.modInverse(this.p);
                    break;
                }
            }
        };
        // RSAKey.prototype.decrypt = RSADecrypt;
        // Return the PKCS#1 RSA decryption of "ctext".
        // "ctext" is an even-length hex string and the output is a plain string.
        RSAKey.prototype.decrypt = function (ctext) {
            var c = parseBigInt(ctext, 16);
            var m = this.doPrivate(c);
            if (m == null) {
                return null;
            }
            return pkcs1unpad2(m, this.n.bitLength() + 7 >> 3);
        };
        // Generate a new random private key B bits long, using public expt E
        RSAKey.prototype.generateAsync = function (B, E, callback) {
            var rng = new SecureRandom();
            var qs = B >> 1;
            this.e = parseInt(E, 16);
            var ee = new BigInteger(E, 16);
            var rsa = this;
            // These functions have non-descript names because they were originally for(;;) loops.
            // I don't know about cryptography to give them better names than loop1-4.
            var loop1 = function loop1() {
                var loop4 = function loop4() {
                    if (rsa.p.compareTo(rsa.q) <= 0) {
                        var t = rsa.p;
                        rsa.p = rsa.q;
                        rsa.q = t;
                    }
                    var p1 = rsa.p.subtract(BigInteger.ONE);
                    var q1 = rsa.q.subtract(BigInteger.ONE);
                    var phi = p1.multiply(q1);
                    if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                        rsa.n = rsa.p.multiply(rsa.q);
                        rsa.d = ee.modInverse(phi);
                        rsa.dmp1 = rsa.d.mod(p1);
                        rsa.dmq1 = rsa.d.mod(q1);
                        rsa.coeff = rsa.q.modInverse(rsa.p);
                        setTimeout(function () {
                            callback();
                        }, 0); // escape
                    } else {
                        setTimeout(loop1, 0);
                    }
                };
                var loop3 = function loop3() {
                    rsa.q = nbi();
                    rsa.q.fromNumberAsync(qs, 1, rng, function () {
                        rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
                            if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                                setTimeout(loop4, 0);
                            } else {
                                setTimeout(loop3, 0);
                            }
                        });
                    });
                };
                var loop2 = function loop2() {
                    rsa.p = nbi();
                    rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                        rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
                            if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                                setTimeout(loop3, 0);
                            } else {
                                setTimeout(loop2, 0);
                            }
                        });
                    });
                };
                setTimeout(loop2, 0);
            };
            setTimeout(loop1, 0);
        };
        RSAKey.prototype.sign = function (text, digestMethod, digestName) {
            var header = getDigestHeader(digestName);
            var digest = header + digestMethod(text).toString();
            var m = pkcs1pad1(digest, this.n.bitLength() / 4);
            if (m == null) {
                return null;
            }
            var c = this.doPrivate(m);
            if (c == null) {
                return null;
            }
            var h = c.toString(16);
            if ((h.length & 1) == 0) {
                return h;
            } else {
                return "0" + h;
            }
        };
        RSAKey.prototype.verify = function (text, signature, digestMethod) {
            var c = parseBigInt(signature, 16);
            var m = this.doPublic(c);
            if (m == null) {
                return null;
            }
            var unpadded = m.toString(16).replace(/^1f+00/, "");
            var digest = removeDigestHeader(unpadded);
            return digest == digestMethod(text).toString();
        };


        var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var b64pad = "=";

        function hex2b64(h) {
            var i;
            var c;
            var ret = "";
            for (i = 0; i + 3 <= h.length; i += 3) {
                c = parseInt(h.substring(i, i + 3), 16);
                ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
            }
            if (i + 1 == h.length) {
                c = parseInt(h.substring(i, i + 1), 16);
                ret += b64map.charAt(c << 2);
            } else if (i + 2 == h.length) {
                c = parseInt(h.substring(i, i + 2), 16);
                ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
            }
            while ((ret.length & 3) > 0) {
                ret += b64pad;
            }
            return ret;
        }


        _super = RSAKey

        function JSEncryptRSAKey(key) {
            var _this = _super.call(this) || this;
            // Call the super constructor.
            //  RSAKey.call(this);
            // If a key key was provided.
            if (key) {
                // If this is a string...
                if (typeof key === "string") {
                    _this.parseKey(key);
                } else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) || JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                    // Set the values for the key.
                    _this.parsePropertiesFrom(key);
                }
            }
            return _this;
        }

        JSEncryptRSAKey.prototype = new RSAKey();
        JSEncryptRSAKey.prototype.constructor = JSEncryptRSAKey;
        /**
         * Method to parse a pem encoded string containing both a public or private key.
         * The method will translate the pem encoded string in a der encoded string and
         * will parse private key and public key parameters. This method accepts public key
         * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
         *
         * @todo Check how many rsa formats use the same format of pkcs #1.
         *
         * The format is defined as:
         * PublicKeyInfo ::= SEQUENCE {
         *   algorithm       AlgorithmIdentifier,
         *   PublicKey       BIT STRING
         * }
         * Where AlgorithmIdentifier is:
         * AlgorithmIdentifier ::= SEQUENCE {
         *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
         *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
         * }
         * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
         * RSAPublicKey ::= SEQUENCE {
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER   -- e
         * }
         * it's possible to examine the structure of the keys obtained from openssl using
         * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
         * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
         * @private
         */
        JSEncryptRSAKey.prototype.parseKey = function (pem) {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = parseBigInt(coefficient, 16);
            } else if (asn1.sub.length === 2) {
                // Parse the public key.
                var bit_string = asn1.sub[1];
                var sequence = bit_string.sub[0];
                modulus = sequence.sub[0].getHexStringValue();
                this.n = parseBigInt(modulus, 16);
                public_exponent = sequence.sub[1].getHexStringValue();
                this.e = parseInt(public_exponent, 16);
            } else {
                return false;
            }
            return true;
        };
        /**
         * Translate rsa parameters in a hex encoded string representing the rsa key.
         *
         * The translation follow the ASN.1 notation :
         * RSAPrivateKey ::= SEQUENCE {
         *   version           Version,
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER,  -- e
         *   privateExponent   INTEGER,  -- d
         *   prime1            INTEGER,  -- p
         *   prime2            INTEGER,  -- q
         *   exponent1         INTEGER,  -- d mod (p1)
         *   exponent2         INTEGER,  -- d mod (q-1)
         *   coefficient       INTEGER,  -- (inverse of q) mod p
         * }
         * @returns {string}  DER Encoded String representing the rsa private key
         * @private
         */
        JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
            var options = {
                array: [new KJUR.asn1.DERInteger({int: 0}), new KJUR.asn1.DERInteger({bigint: this.n}), new KJUR.asn1.DERInteger({int: this.e}), new KJUR.asn1.DERInteger({bigint: this.d}), new KJUR.asn1.DERInteger({bigint: this.p}), new KJUR.asn1.DERInteger({bigint: this.q}), new KJUR.asn1.DERInteger({bigint: this.dmp1}), new KJUR.asn1.DERInteger({bigint: this.dmq1}), new KJUR.asn1.DERInteger({bigint: this.coeff})]
            };
            var seq = new KJUR.asn1.DERSequence(options);
            return seq.getEncodedHex();
        };
        /**
         * base64 (pem) encoded version of the DER encoded representation
         * @returns {string} pem encoded representation without header and footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
            return hex2b64(this.getPrivateBaseKey());
        };
        /**
         * Translate rsa parameters in a hex encoded string representing the rsa public key.
         * The representation follow the ASN.1 notation :
         * PublicKeyInfo ::= SEQUENCE {
         *   algorithm       AlgorithmIdentifier,
         *   PublicKey       BIT STRING
         * }
         * Where AlgorithmIdentifier is:
         * AlgorithmIdentifier ::= SEQUENCE {
         *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
         *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
         * }
         * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
         * RSAPublicKey ::= SEQUENCE {
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER   -- e
         * }
         * @returns {string} DER Encoded String representing the rsa public key
         * @private
         */
        JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
            var first_sequence = new KJUR.asn1.DERSequence({
                array: [new KJUR.asn1.DERObjectIdentifier({oid: "1.2.840.113549.1.1.1"}), new KJUR.asn1.DERNull()]
            });
            var second_sequence = new KJUR.asn1.DERSequence({
                array: [new KJUR.asn1.DERInteger({bigint: this.n}), new KJUR.asn1.DERInteger({int: this.e})]
            });
            var bit_string = new KJUR.asn1.DERBitString({
                hex: "00" + second_sequence.getEncodedHex()
            });
            var seq = new KJUR.asn1.DERSequence({
                array: [first_sequence, bit_string]
            });
            return seq.getEncodedHex();
        };
        /**
         * base64 (pem) encoded version of the DER encoded representation
         * @returns {string} pem encoded representation without header and footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
            return hex2b64(this.getPublicBaseKey());
        };
        /**
         * wrap the string in block of width chars. The default value for rsa keys is 64
         * characters.
         * @param {string} str the pem encoded string without header and footer
         * @param {Number} [width=64] - the length the string has to be wrapped at
         * @returns {string}
         * @private
         */
        JSEncryptRSAKey.wordwrap = function (str, width) {
            width = width || 64;
            if (!str) {
                return str;
            }
            var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
            return str.match(RegExp(regex, "g")).join("\n");
        };
        /**
         * Retrieve the pem encoded private key
         * @returns {string} the pem encoded private key with header/footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPrivateKey = function () {
            var key = "-----BEGIN RSA PRIVATE KEY-----\n";
            key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
            key += "-----END RSA PRIVATE KEY-----";
            return key;
        };
        /**
         * Retrieve the pem encoded public key
         * @returns {string} the pem encoded public key with header/footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPublicKey = function () {
            var key = "-----BEGIN PUBLIC KEY-----\n";
            var key = JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
            key += "-----END PUBLIC KEY-----";
            return key;
        };
        /**
         * Check if the object contains the necessary parameters to populate the rsa modulus
         * and public exponent parameters.
         * @param {Object} [obj={}] - An object that may contain the two public key
         * parameters
         * @returns {boolean} true if the object contains both the modulus and the public exponent
         * properties (n and e)
         * @todo check for types of n and e. N should be a parseable bigInt object, E should
         * be a parseable integer number
         * @private
         */
        JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
            obj = obj || {};
            return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
        };
        /**
         * Check if the object contains ALL the parameters of an RSA key.
         * @param {Object} [obj={}] - An object that may contain nine rsa key
         * parameters
         * @returns {boolean} true if the object contains all the parameters needed
         * @todo check for types of the parameters all the parameters but the public exponent
         * should be parseable bigint objects, the public exponent should be a parseable integer number
         * @private
         */
        JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
            obj = obj || {};
            return obj.hasOwnProperty("n") && obj.hasOwnProperty("e") && obj.hasOwnProperty("d") && obj.hasOwnProperty("p") && obj.hasOwnProperty("q") && obj.hasOwnProperty("dmp1") && obj.hasOwnProperty("dmq1") && obj.hasOwnProperty("coeff");
        };
        /**
         * Parse the properties of obj in the current rsa object. Obj should AT LEAST
         * include the modulus and public exponent (n, e) parameters.
         * @param {Object} obj - the object containing rsa parameters
         * @private
         */
        JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
            this.n = obj.n;
            this.e = obj.e;
            if (obj.hasOwnProperty("d")) {
                this.d = obj.d;
                this.p = obj.p;
                this.q = obj.q;
                this.dmp1 = obj.dmp1;
                this.dmq1 = obj.dmq1;
                this.coeff = obj.coeff;
            }
        };


        function JSEncrypt(options) {
            options = options || {};
            this.default_key_size = parseInt(options.default_key_size, 10) || 1024;
            this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
            this.log = options.log || false;
            // The private and public key.
            this.key = null;
        }

        /**
         * Method to set the rsa key parameter (one method is enough to set both the public
         * and the private key, since the private key contains the public key paramenters)
         * Log a warning if logs are enabled
         * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
         * @public
         */
        JSEncrypt.prototype.setKey = function (key) {
            if (this.log && this.key) {
                console.warn("A key was already set, overriding existing.");
            }
            this.key = new JSEncryptRSAKey(key);
        };
        /**
         * Proxy method for setKey, for api compatibility
         * @see setKey
         * @public
         */
        JSEncrypt.prototype.setPrivateKey = function (privkey) {
            // Create the key.
            this.setKey(privkey);
        };
        /**
         * Proxy method for setKey, for api compatibility
         * @see setKey
         * @public
         */
        JSEncrypt.prototype.setPublicKey = function (pubkey) {
            // Sets the public key.
            this.setKey(pubkey);
        };
        /**
         * Proxy method for RSAKey object's decrypt, decrypt the string using the private
         * components of the rsa key object. Note that if the object was not set will be created
         * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
         * @param {string} str base64 encoded crypted string to decrypt
         * @return {string} the decrypted string
         * @public
         */
        JSEncrypt.prototype.decrypt = function (str) {
            // Return the decrypted string.
            try {
                return this.getKey().decrypt(b64tohex(str));
            } catch (ex) {
                return false;
            }
        };
        /**
         * Proxy method for RSAKey object's encrypt, encrypt the string using the public
         * components of the rsa key object. Note that if the object was not set will be created
         * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
         * @param {string} str the string to encrypt
         * @return {string} the encrypted string encoded in base64
         * @public
         */
        JSEncrypt.prototype.encrypt = function (str) {

            var k = this.getKey();
            var maxLength = (k.n.bitLength() + 7 >> 3) - 11;
            // var maxLength = 117;


            var lt = "";
            var ct = "";

            if (str.length > maxLength) {
                lt = str.match(/.{1,117}/g);
                lt.forEach(function (entry) {
                    var t1 = k.encrypt(entry);
                    ct += t1;
                });
                return hex2b64(ct);
            }
            var t = k.encrypt(str);
            var y = hex2b64(t);
            return y;
            // Return the encrypted string.
            // try {
            //     return hex2b64(this.getKey().encrypt(str));
            // }
            // catch (ex) {
            //     return false;
            // }
        };

        JSEncrypt.prototype.decryptLong = function (string) {
            var k = this.getKey();
            var maxLength = k.n.bitLength() + 7 >> 3;
            var string = b64tohex(string);

            var ct = "";
            if (string.length > maxLength) {
                var lt = string.match(/.{1,256}/g);
                lt.forEach(function (entry) {
                    var t1 = k.decrypt(entry);

                    ct += t1;
                });
            }

            var y = k.decrypt(b64tohex(string));
            return y;

            //var maxLength = 128;
            // try {
            //     var string = b64tohex(string);
            //     var ct = "";
            //     if (string.length > maxLength) {
            //     var lt = string.match(/.{1,256}/g);
            //     lt.forEach(function(entry) {
            //         var t1 = k.decrypt(entry);
            //         ct += t1;
            //     });
            //     }
            //     var y = k.decrypt(b64tohex(string));
            //     return y;
            // } catch (ex) {
            //     return false;
            // }
        };

        /**
         * Proxy method for RSAKey object's sign.
         * @param {string} str the string to sign
         * @param {function} digestMethod hash method
         * @param {string} digestName the name of the hash algorithm
         * @return {string} the signature encoded in base64
         * @public
         */
        JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
            // return the RSA signature of 'str' in 'hex' format.
            try {
                return hex2b64(this.getKey().sign(str, digestMethod, digestName));
            } catch (ex) {
                return false;
            }
        };
        /**
         * Proxy method for RSAKey object's verify.
         * @param {string} str the string to verify
         * @param {string} signature the signature encoded in base64 to compare the string to
         * @param {function} digestMethod hash method
         * @return {boolean} whether the data and signature match
         * @public
         */
        JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
            // Return the decrypted 'digest' of the signature.
            try {
                return this.getKey().verify(str, b64tohex(signature), digestMethod);
            } catch (ex) {
                return false;
            }
        };
        /**
         * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
         * will be created and returned
         * @param {callback} [cb] the callback to be called if we want the key to be generated
         * in an async fashion
         * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
         * @public
         */
        JSEncrypt.prototype.getKey = function (cb) {
            // Only create new if it does not exist.
            if (!this.key) {
                // Get a new private key.
                this.key = new JSEncryptRSAKey();
                if (cb && {}.toString.call(cb) === "[object Function]") {
                    this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                    return;
                }
                // Generate the key.
                this.key.generate(this.default_key_size, this.default_public_exponent);
            }
            return this.key;
        };
        /**
         * Returns the pem encoded representation of the private key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the private key WITH header and footer
         * @public
         */
        JSEncrypt.prototype.getPrivateKey = function () {
            // Return the private representation of this key.
            return this.getKey().getPrivateKey();
        };
        /**
         * Returns the pem encoded representation of the private key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the private key WITHOUT header and footer
         * @public
         */
        JSEncrypt.prototype.getPrivateKeyB64 = function () {
            // Return the private representation of this key.
            return this.getKey().getPrivateBaseKeyB64();
        };
        /**
         * Returns the pem encoded representation of the public key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the public key WITH header and footer
         * @public
         */
        JSEncrypt.prototype.getPublicKey = function () {
            // Return the private representation of this key.
            return this.getKey().getPublicKey();
        };
        /**
         * Returns the pem encoded representation of the public key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the public key WITHOUT header and footer
         * @public
         */
        JSEncrypt.prototype.getPublicKeyB64 = function () {
            // Return the private representation of this key.
            return this.getKey().getPublicBaseKeyB64();
        };
        JSEncrypt.version = "3.0.0-rc.1";

        var PUCLIC_KEY = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAL5YpsHnm490e1lcgxfeyuSyX2DKc5KWwdMHJQaAMKgyWmXoiXrfw02HXIbf6P+hmwA/6BAX5EUmue/QrEvGBvX+hxoplRlL5CEny26+0AdAEbt9N95IJk1RVgBQHe5ORr/qdo03dGtTo6hcI9Wj4ViPlgHflwyMupQA5enGfMYTAgMBAAECgYARxac0PZK5ry+BJXEb/nJFLh5XpC9sRWUtdeJQHBHu8lycXTzQ2ymaCIRsF2Xi0Ezvlgft0L1Ac6AysvITVRb7IaKtRMNJPZT7AkidtIxngyUfEZsDBwVNQs4wNGjerwGAq8OeWEePcO0+a34shvB/sakJ/Sq4iEIRAFKiBmRa6QJBAN57J3ftjclmbb4SRBA3xChhN2oakoGnXtkVbOXsY7Adn+10E7pmsXOsn/SXtW+YUKdsIT9fz7Pcp5FawSPoBzcCQQDbBhhJdRbqckvlvlrfCY3KTnutR7EvyRi4c/4zDKMuaA+pKAofd+t5GekJrq6ndhAO9SLC6SQJ6qGSvmT2fW4FAkEAy44ubGHjClQ3MGKR96yuQqvAAcpSJWI3O7OIsU15YBeaza0Yp8Fxtn5I04dCr9nSYXxjZxKIfO30Ot+oOuv+PQJBAIv7gz4/pZvF3RhC5xUxp/uq2YTQE0C1SCVrjQXXh9u7CndUbdPa8xZ9JuHXUS0aWf0VU1g7ZZso6Ic/RIv9cnkCQH0ZZXCml2RzwgUg+q1aAi+/K+9lRLDNvutFTpY5JtHDWH65Bu8MTKWlll5usksAP46HWTWPacLyCeWtf3RHkyw=';
        var jsencrypt = new JSEncrypt();
        jsencrypt.setPublicKey(PUCLIC_KEY);
        var enData = jsencrypt.encrypt(data);
        return enData
    }

    var defaultIp = "171.113.252.84";
    var commonParameters = {
        lng: '114.3234106445313', //经度
        lat: '30.46910129123264', //纬度
        version: '2.3.0',
        deviceType: '3',
        // channelIp: returnCitySN["cip"] ? returnCitySN["cip"] : defaultIp, //ip地址
        channelIp: defaultIp, //ip地址
        clientId: guid(), //设备唯一标识
        os: 2,
        // ip: returnCitySN["cip"] ? returnCitySN["cip"] : defaultIp //ip地址
        ip: defaultIp //ip地址

        //设备唯一标识，公共参数
    };
    data = commonParameters;
    data["loginname"] = loginname;
    data["password"] = pwdencrypt(password);
    var param = params(data);
    return param
}
console.log(getparams("13612345678","123456789"))