"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants = require("constants");
const crypto = require("crypto");
const base64util_1 = require("./base64util");
class RSACrypt {
    // Class has only static methods, instantiation should not be possible
    constructor() { }
    static encryptWithRsaPublicKey(text, key, padding = constants.RSA_PKCS1_OAEP_PADDING) {
        const pemKey = key.startsWith(RSACrypt.PEM_KEY_START) ? key : RSACrypt.keyToPEMKey(key);
        return base64util_1.Base64Util.urlSafeBase64Encode(crypto.publicEncrypt({ padding, key: pemKey }, Buffer.from(text, 'base64')));
    }
    static keyToPEMKey(key) {
        const splitted = (base64util_1.Base64Util.urlSafeBase64ToBase64(key || '').match(/.{1,64}/g));
        if (splitted) {
            return `${RSACrypt.PEM_KEY_START}\n${splitted.join('\n')}\n${this.PEM_KEY_END}`;
        }
        throw new Error('Unable to convert public key into PEM key. \
                        Given public key is null or too short.');
    }
}
RSACrypt.PEM_KEY_START = '-----BEGIN PUBLIC KEY-----';
RSACrypt.PEM_KEY_END = '-----END PUBLIC KEY-----';
exports.RSACrypt = RSACrypt;
