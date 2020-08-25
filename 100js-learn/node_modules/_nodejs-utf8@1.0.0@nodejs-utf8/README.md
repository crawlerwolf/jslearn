[npm-image]: https://img.shields.io/npm/v/nodejs-utf8.svg
[npm-url]: https://www.npmjs.com/package/nodejs-utf8

# nodejs-utf8 [![npm][npm-image]][npm-url]
Simple UTF-8 encoder/decoder

## Installation
```shell
npm install nodejs-utf8
```

## Usage (with CommonJS)
```javascript
const utf8 = require('nodejs-utf8');

const encoded = utf8.encode('안녕하세요'); 
utf8.decode(encoded);
```