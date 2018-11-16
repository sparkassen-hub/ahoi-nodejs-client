"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const tokencache_1 = require("../cache/tokencache");
const aescrypt_1 = require("../lib/crypt/aescrypt");
const base64util_1 = require("../lib/crypt/base64util");
const cryptutil_1 = require("../lib/crypt/cryptutil");
const abstractauth_1 = require("./abstractauth");
class AhoiBankingTokenService extends abstractauth_1.AbstractAhoiAuthenticationService {
    constructor(config, ahoiClientTokenService, baseUrl) {
        super(config, baseUrl);
        this.ahoiClientTokenService = ahoiClientTokenService;
        this.tokencache = new tokencache_1.TokenCache();
    }
    /**
     * Authenticate and authorize the user with the given installationId against AHOI using OAuth 2.0
     * protocol. The returned authorization token called 'banking token' is needed to access the AHOI
     * endpoints e.g. to get transactions.<br/>
     * see: https://banking-sandbox.starfinanz.de/ahoi/docs/cookbook/index.html#authentication
     *
     * @param {string} installationid
     * @returns {Promise<Token>}
     * @memberof AhoiBankingTokenService
     */
    async authenticate(installationId) {
        const token = this.tokencache.get(installationId);
        console_1.debug('Get token from cache %s', token);
        if (token && !token.isExpired()) {
            console_1.debug('Get banking token from cache %o', token);
            return token;
        }
        const authHeader = await this.createAuthHeader(installationId);
        console_1.debug('AuthHeader %o', authHeader);
        const bankingtoken = await this.callAhoiOAuthServer(authHeader);
        this.tokencache.set(installationId, bankingtoken);
        console_1.debug('Return banking token %o', bankingtoken);
        return bankingtoken;
    }
    async createAuthHeader(installationId) {
        const authHeaders = new Map();
        const xAuthHeader = JSON.stringify({
            installationId,
            // 32 byte random string
            nonce: await cryptutil_1.CryptUtil.generateNonce(32),
            timestamp: new Date().toISOString(),
        });
        console_1.debug(xAuthHeader);
        const useEncryption = await this.useEncryption();
        let encXAuthHeader = '';
        if (useEncryption) {
            console_1.debug('Header must be encrypted, encrypt header...');
            // encrypt xAuthHeader (X-Authorization - Ahoi)
            encXAuthHeader = await aescrypt_1.AESCrypt.encrypt(xAuthHeader, base64util_1.Base64Util.urlSafeBase64Decode(this.config.appSecretKey), aescrypt_1.Cipher.AES_CBC, this.config.appSecretIv);
        }
        authHeaders.set(AhoiBankingTokenService.AUTH_BANKINGTOKEN_HEADER, encXAuthHeader ? base64util_1.Base64Util.base64ToUrlSafeBase64(encXAuthHeader)
            : base64util_1.Base64Util.urlSafeBase64Encode(xAuthHeader));
        return authHeaders;
    }
    async useEncryption() {
        const accessToken = await this.ahoiClientTokenService.authenticate();
        if (accessToken.useEncryption() && this.config.appSecretKey && this.config.appSecretIv) {
            return true;
        }
        return false;
    }
}
AhoiBankingTokenService.AUTH_BANKINGTOKEN_HEADER = 'X-Authorization-Ahoi';
exports.AhoiBankingTokenService = AhoiBankingTokenService;
