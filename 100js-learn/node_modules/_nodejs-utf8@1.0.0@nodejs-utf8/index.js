module.exports = {
  encode (string) {
    string = string.replace(/\r\n/g, '\n');

    let utfString = '';
    string.split('').forEach((v) => {
      const c = v.charCodeAt(0);
      if (c < 128) {
        utfString += String.fromCharCode(c);
      }
      else if (c > 127 && c < 2048) {
        utfString += String.fromCharCode((c >> 6) | 192);
        utfString += String.fromCharCode((c & 63) | 128);
      }
      else {
        utfString += String.fromCharCode((c >> 12) | 224);
        utfString += String.fromCharCode(((c >> 6) & 63) | 128);
        utfString += String.fromCharCode((c & 63) | 128);
      }
    });

    return utfString;
  },
  decode (utfString) {
    let string = '',
      i = 0,
      c = 0, c2 = 0, c3 = 0;

    while (i < utfString.length) {
      c = utfString.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if (c > 191 && c < 224) {
        c2 = utfString.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utfString.charCodeAt(i + 1);
        c3 = utfString.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }

    return string;
  }
};

