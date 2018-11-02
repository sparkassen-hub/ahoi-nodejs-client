"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const base64util_1 = require("./../lib/crypt/base64util");
const sessionkeyheaderservice_1 = require("../cryptservice/sessionkeyheaderservice");
const aescrypt_1 = require("../lib/crypt/aescrypt");
const abstracthttpfilter_1 = require("./abstracthttpfilter");
/**
 * This filter is active only if encryption is needed.<br/>
 * It adds AHOI session security filter with encrypted session key and encrypted banking
 * access data for Access endpoint if encryption is active. It decrypts installationId from AHOI
 * Registration endpoint response if encryption is active.
 *
 * @export
 * @class EncryptSessionFilter
 * @extends {AbstractHttpFilter}
 */
class EncryptSessionFilter extends abstracthttpfilter_1.AbstractHttpFilter {
    constructor(ahoiSessionKeyHeaderService, ahoiClientTokenService, ahoiBankingTokenService) {
        super(ahoiClientTokenService, ahoiBankingTokenService);
        this.ahoiSessionKeyHeaderService = ahoiSessionKeyHeaderService;
    }
    /**
     * Filter requests to Registration and Access endpoint (register new client/user in AHOI, grant
     * bank access) and responses from Registration endpoint if encryption is active to add AHOI
     * session security header and decrypt installationId from AHOI response
     *
     * @param {HttpContext} httpContext
     * @returns {Promise<boolean>}
     * @memberof SessionEncryptionFilter
     */
    async matches(httpContext) {
        const matches = this.isRegistrationOrAccessesEndpoint(httpContext)
            && (this.usesMethod(httpContext, 'POST') || this.usesMethod(httpContext, 'PUT'))
            && await this.useEncryption(httpContext);
        return matches;
    }
    async filterRequest(httpContext) {
        // debug('filterRequest %s', context.url);
        // get public key from AHOI server, generate session key, encrypt session key with public key
        // and add session security header if endpoint is Registration or Access
        const sessionKey = await this.ahoiSessionKeyHeaderService.generateSessionKey();
        const ahoiSessionSecurityHeader = await this.ahoiSessionKeyHeaderService.getHeader(sessionKey);
        this.setHeader(httpContext, sessionkeyheaderservice_1.AhoiSessionKeyHeaderService.SESSIONKEY_HEADER_NAME, ahoiSessionSecurityHeader);
        // add generated session key to httpContext data as it's available in response filter to decrypt
        // installationid in registration response from AHOI
        httpContext.data.set(EncryptSessionFilter.SESSIONKEY_ITEM_NAME, sessionKey);
        this.encryptBankAccessData(httpContext, sessionKey);
    }
    /**
     * Encrypt access data (PIN, USERNAME, CUSTOMERNUMBER) with session key when sending a request to
     * the Access endpoint
     *
     * @private
     * @param {HttpContext} httpContext
     * @returns {Promise<void>}
     * @memberof EncryptSessionFilter
     */
    async encryptBankAccessData(httpContext, sessionKey) {
        var e_1, _a;
        if (httpContext.url.includes('/accesses') && httpContext.options.body) {
            const body = JSON.parse(httpContext.options.body.toString());
            try {
                for (var _b = __asyncValues(EncryptSessionFilter.ACCESS_DTO_NAMES), _c; _c = await _b.next(), !_c.done;) {
                    const name = _c.value;
                    if (body['accessFields'][name]) {
                        body['accessFields'][name] =
                            base64util_1.Base64Util.base64ToUrlSafeBase64(await aescrypt_1.AESCrypt.encrypt(body['accessFields'][name], Buffer.from(sessionKey, 'base64'), aescrypt_1.Cipher.AES_CBC));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            httpContext.options.body = JSON.stringify(body);
        }
    }
    /**
     * Decrypt installationid with session key if endpoint is Registration
     *
     * @protected
     * @param {HttpContext} httpContext
     * @returns {Promise<any>}
     * @memberof SessionEncryptionFilter
     */
    async filterResponse(httpContext) {
        if (httpContext.url.endsWith('/registration')) {
            const sessionKey = httpContext.data.get(EncryptSessionFilter.SESSIONKEY_ITEM_NAME);
            const response = await this.getResponse(httpContext);
            if (response.installation) {
                return this.createResponseWithDecryptedInstallationId(response.installation, sessionKey);
            }
            return null;
        }
    }
    /**
     * Create new {@link RegistrationResponse} with decrypted installationId that is used to replace
     * the response from AHOI with encrypted installationId
     *
     * @private
     * @param {string} encInstallationId
     * @param {string} sessionKey
     * @returns {RegistrationResponse}
     * @memberof SessionEncryptionFilter
     */
    createResponseWithDecryptedInstallationId(encInstallationId, sessionKey) {
        const decryptedInstallationId = aescrypt_1.AESCrypt.decrypt(encInstallationId, Buffer.from(sessionKey, 'base64'), aescrypt_1.Cipher.AES_CBC);
        const response = {
            installation: decryptedInstallationId,
        };
        return response;
    }
    isRegistrationOrAccessesEndpoint(httpContext) {
        // /accesses/:accessid
        const accessRegEx = new RegExp('/accesses/[0-9]+$');
        return httpContext.url.endsWith('/registration')
            || httpContext.url.endsWith('/accesses')
            || accessRegEx.test(httpContext.url);
    }
    async useEncryption(httpContext) {
        const token = await this.getToken(httpContext);
        return token.useEncryption();
    }
}
EncryptSessionFilter.SESSIONKEY_ITEM_NAME = 'sessionKey';
// see AccessFieldsMap
EncryptSessionFilter.ACCESS_DTO_NAMES = ['PIN', 'USERNAME', 'CUSTOMERNUMBER'];
exports.EncryptSessionFilter = EncryptSessionFilter;
