(function() {
    this.SrPago._PUBLIC_KEY = "pk_dev_5f35d48a7cbe46KJKW";
 
     this.SrPago.encryption = (function() {
         function encryption() {}
 
         encryption.encrypt = function(plainData) {
             if ((typeof plainData) !== "string") {
                 plainData = JSON.stringify(plainData);
             }

             console.log(plainData);
 
             var publicKey = SrPago._PUBLIC_KEY;
 
             var plainKey = encryption.random(56, '#aA').substr(0, 32);
             var numberFill = 16 - (plainData.length % 16);
             while (numberFill > 0) {
                 numberFill--;
                 plainData += ' ';
             }
             var key = aesjs.util.convertStringToBytes(plainKey);
             var plainBytes = aesjs.util.convertStringToBytes(plainData);
             var aesEcb = new aesjs.ModeOfOperation.ecb(key);
             var encryptedBytes = aesEcb.encrypt(plainBytes);
             var dataBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBytes)));
 
             var encrypt = new JSEncrypt();
             encrypt.setPublicKey(publicKey);
             var encryptedKey = encrypt.encrypt(plainKey);
 
             return {
                 key: "" + encryptedKey,
                 data: "" + dataBase64
             }
         };
 
         encryption.random = function(length, chars) {
             var mask = '';
             if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
             if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
             if (chars.indexOf('#') > -1) mask += '0123456789';
             if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
             var result = '';
             for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
             return result;
         };
 
         return encryption;
     })();
 }).call(this);