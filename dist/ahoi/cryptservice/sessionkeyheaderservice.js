"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base64util_1 = require("../lib/crypt/base64util");
const cryptutil_1 = require("../lib/crypt/cryptutil");
const rsacrypt_1 = require("../lib/crypt/rsacrypt");
class AhoiSessionKeyHeaderService {
    constructor(ahoiPublicKeyService) {
        this.ahoiPublicKeyService = ahoiPublicKeyService;
    }
    async getHeader(sessionKey) {
        const publicKey = await this.ahoiPublicKeyService.getPublicKey();
        const useSessionKey = sessionKey ? sessionKey : await this.generateSessionKey();
        const encryptedSessionKey = this.encryptSessionKey(useSessionKey, publicKey);
        return this.createSessionKeyHeader(publicKey, encryptedSessionKey);
    }
    async generateSessionKey() {
        // 32 byte random string that is used to encrypt the installationid using AES 256 CBC
        return cryptutil_1.CryptUtil.createRandomKey(32);
    }
    encryptSessionKey(sessionKey, publicAhoiKey) {
        const pubKey = publicAhoiKey.publicKey.value;
        return rsacrypt_1.RSACrypt.encryptWithRsaPublicKey(sessionKey, pubKey);
    }
    createSessionKeyHeader(publicKey, encryptedSessionKey) {
        const sessionSecHeader = JSON.stringify({
            publicKeyId: publicKey.keyId,
            sessionKey: encryptedSessionKey,
            keySpecification: 'AES',
        });
        return base64util_1.Base64Util.urlSafeBase64Encode(sessionSecHeader);
    }
}
AhoiSessionKeyHeaderService.SESSIONKEY_HEADER_NAME = 'X-Ahoi-Session-Security';
exports.AhoiSessionKeyHeaderService = AhoiSessionKeyHeaderService;
