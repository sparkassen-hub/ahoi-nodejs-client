"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const crypto = require("crypto");
const base64util_1 = require("./base64util");
const cryptutil_1 = require("./cryptutil");
var Cipher;
(function (Cipher) {
    Cipher["AES_CBC"] = "aes-${strength}-cbc";
    Cipher["AES_CTR"] = "aes-${strength}-ctr";
    Cipher["DEFAULT"] = "aes-256-cbc";
})(Cipher = exports.Cipher || (exports.Cipher = {}));
class AESCrypt {
    // Class has only static methods, instantiation should not be possible
    constructor() { }
    static async encryptRandomIV(text, cryptkey, cipher = Cipher.DEFAULT) {
        const iv = Buffer.from(await cryptutil_1.CryptUtil.createRandomKey(AESCrypt.IV_LENGTH), 'base64');
        return AESCrypt.encrypt(text, cryptkey, cipher, iv, true);
    }
    /**
     * Encrypts a string using AES.
     *
     * @param {string} text
     * @param {(string | Buffer)} cryptkey
     * @param {string} [cipher=Cipher.AES_CTR]
     * @param {(string | Buffer)} [iv=AESCrypt.DEFAULT_IV]  A {@link Buffer} or an base64 encrypted string
     * @param {boolean} [addIV=false]
     * @returns {Promise<string>}
     * @memberof AESCrypt
     */
    static async encrypt(text, cryptkey, cipher = Cipher.DEFAULT, iv = AESCrypt.DEFAULT_IV, addIV = false) {
        try {
            const bufIV = AESCrypt.iVToBuffer(iv);
            // 128, 192 or 256 bytes
            const aesKeyLenInBytes = AESCrypt.getEncryptionStrength(cryptkey).toString();
            // e.g. aes-256-cbc
            const useCipher = cipher.replace(/\$\{strength\}/, aesKeyLenInBytes);
            const useCryptKey = AESCrypt.keyToBuffer(cryptkey, useCipher);
            const cipheriv = crypto.createCipheriv(useCipher, useCryptKey, bufIV);
            // Add IV only, if it's randomly generated. IV is needed for decryption and must be part of the
            // encrypted text if no default is used.
            const encrypted = addIV ? Buffer.concat([bufIV, cipheriv.update(text), cipheriv.final()])
                : Buffer.concat([cipheriv.update(text), cipheriv.final()]);
            return encrypted.toString('base64');
        }
        catch (err) {
            console_1.error(err);
            throw err instanceof Error ? err : new Error(err);
        }
    }
    static decryptRandomIV(enctext, cryptkey, cipher = Cipher.DEFAULT) {
        return AESCrypt.decrypt(enctext, cryptkey, cipher, true);
    }
    /**
     * Decrypts an AES encrypted text
     *
     * @param {string} enctext
     * @param {string} [cipher=AESCrypt.AHOI_DEFAULT_CIPHER]
     * @returns {Promise<string>}
     * @memberof AESCrypt
     */
    static decrypt(enctext, cryptkey, cipher = Cipher.DEFAULT, containsIV = false, iv) {
        try {
            const encTextBuffer = Buffer.from(base64util_1.Base64Util.urlSafeBase64ToBase64(enctext), 'base64');
            let bufIV;
            if (containsIV) {
                bufIV = encTextBuffer.slice(0, AESCrypt.IV_LENGTH);
            }
            else if (iv) {
                bufIV = AESCrypt.iVToBuffer(iv);
            }
            else {
                bufIV = AESCrypt.DEFAULT_IV;
            }
            const encryptedText = containsIV ? encTextBuffer.slice(AESCrypt.IV_LENGTH) : encTextBuffer;
            // 128, 192 or 256 bytes
            const aesKeyLenInBytes = AESCrypt.getEncryptionStrength(cryptkey).toString();
            // e.g. aes-256-cbc
            const useCipher = cipher.replace(/\$\{strength\}/, aesKeyLenInBytes);
            const useCryptKey = AESCrypt.keyToBuffer(cryptkey, useCipher);
            const decipher = crypto.createDecipheriv(useCipher, useCryptKey, bufIV);
            return decipher.update(encryptedText, 'binary', 'utf8') + decipher.final().toString('utf8');
        }
        catch (err) {
            console_1.error(err);
            console_1.error('Error: %o', err);
            throw err instanceof Error ? err : new Error(err);
        }
    }
    static keyToBuffer(cryptKey, length = 32) {
        const len = typeof length === 'string' ? length.includes('256') ? 32 : 16 : length;
        let newBuffer;
        if (cryptKey instanceof Buffer) {
            newBuffer = Buffer.concat([cryptKey, Buffer.alloc(len)]);
        }
        else {
            newBuffer = Buffer.concat([Buffer.from(cryptKey), Buffer.alloc(len)]);
        }
        return newBuffer.slice(0, len);
    }
    static iVToBuffer(iv) {
        const decIV = iv instanceof Buffer ? iv : base64util_1.Base64Util.urlSafeBase64Decode(iv);
        return Buffer.concat([decIV, Buffer.alloc(AESCrypt.IV_LENGTH)]).slice(0, AESCrypt.IV_LENGTH);
    }
    /**
     * Get the AES encryption strength. For AES encryption allowed are only key with length 128, 192
     * or 256 bit.<br/>
     * Note: it would be more secure to throw an exception if key length does not match these
     * restrictions. On the other hand it is more user friendly to allow keys too, that do not match.
     * In this case other keys are allowed and padded or stripped to 256 bit.
     *
     * @private
     * @param {(string | Buffer)} key
     * @returns {number}
     * @memberof AESCrypt
     */
    static getEncryptionStrength(key) {
        const keyBuf = key instanceof Buffer ? key : Buffer.from(key);
        if (keyBuf.length === 16 || keyBuf.length === 24 || keyBuf.length === 32) {
            return keyBuf.length * 8;
        }
        return 256;
    }
}
AESCrypt.IV_LENGTH = 16; // For AES, this is always 16
AESCrypt.DEFAULT_IV = Buffer.alloc(AESCrypt.IV_LENGTH);
exports.AESCrypt = AESCrypt;
