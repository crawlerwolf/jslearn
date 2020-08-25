[Pidcrypt](https://www.pidder.de/pidcrypt/) (JS encryption library) for node.js/browserify
==========================================================================================

This is a copy of the [pidCrypt javascript crypto library](https://www.pidder.de/pidcrypt/) with some modifications to make it compatible with node.js and browserify. Pidcrypt submodules are all accessible via `require`, and will automatically pull in any other submodule dependencies if needed.

Installation
============

``` bash
npm install --save pidcrypt
```

Usage:
======

### Encrypting text via AES (CBC)

AES CBC is a relatively easy to use symmetric encryption method that has the added convenience of being compatible with `openssl` (included on almost any \*nix machine as well)

``` javascript
// Require seedrandom.js first to increase randomness for stronger encryption
require("pidcrypt/seedrandom")
  
var pidCrypt = require("pidcrypt")
require("pidcrypt/aes_cbc")

var aes = new pidCrypt.AES.CBC()

var pw =  "some password";
var encrypted = aes.encryptText("some text", pw); 

console.log("Encrypted text is: '%s'", encrypted);
// Encrypted text is: 'U2FsdGVkX19yGT01gBIBMJCEM7cBW6vc3ND06CyKu1w='

var decrypted = aes.decryptText(encrypted, pw);

console.log("Original text was: '%s'", decrypted);
// Original text was 'some text'
```

To perform the same encryption via openssl you'd use:

``` bash
echo "some text" | openssl enc -aes-256-cbc -a -pass 'pass:some password'
```

### Decyrpting text via AES (CBC)

``` javascript
// Require seedrandom.js first to increase randomness for stronger encryption
require("pidcrypt/seedrandom")
  
var pidCrypt = require("pidcrypt")
require("pidcrypt/aes_cbc")

var aes = new pidCrypt.AES.CBC()

var pw =  "some password";

var encryptedText = 'U2FsdGVkX19yGT01gBIBMJCEM7cBW6vc3ND06CyKu1w=';

var decrypted = aes.decryptText(encryptedText, pw);

console.log("Decrypted text is: '%s'", decrypted);
// Decrypted text is: 'some text'
```

To decrypt this via `openssl` you'd use:

``` bash
echo U2FsdGVkX19yGT01gBIBMJCEM7cBW6vc3ND06CyKu1w= | openssl enc -aes-256-cbc -d -a -pass 'pass:some password'
```

Other encryption formats
========================

You can load any of the modules included with pidcrypt in the same manner as the `aes_cbc` module. For convenience here are all the included encryption/decryption modules:

-   `aes_cbc`
-   `aes_ctr`
-   `asn1`
-   `jsbn`
-   `md5`
-   `prng4`
-   `rsa`
-   `sha1`
-   `sha256`
-   `sha512`

You can use any module in the same manner as above:

``` javascript
// load pidcrypt
var pidCrypt = require("pidcrypt");

// grab your module
require("pidcrypt/<your module>");

// do stuff as per the pidcrypt documentation for that module...
```

See documentation on the [pidcrypt site](https://www.pidder.de/pidcrypt/) for more details.

