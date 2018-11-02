"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const encinstallationidcache_1 = require("../cache/encinstallationidcache");
const abstracthttpfilter_1 = require("./abstracthttpfilter");
class EncryptInstallationIdFilter extends abstracthttpfilter_1.AbstractHttpFilter {
    constructor(installationIdCryptService, ahoiClientTokenService, ahoiBankingTokenService, useEncryption = true) {
        super(ahoiClientTokenService, ahoiBankingTokenService);
        this.installationIdCryptService = installationIdCryptService;
        this.useEncryption = useEncryption;
        this.idCache = new encinstallationidcache_1.EncInstallationIdCache();
    }
    /**
     * Decrypts installationid if it is available and encrypted. Encrypts installationid's that are
     * requested from AHOI Registration endpoint if encryption of installationid's is activated in
     * configuration ({AhoiConfig.encryptInstallationId).
     *
     * @param {HttpContext} httpContext
     * @returns {Promise<boolean>}
     * @memberof InstallationIdCryptFilter
     */
    async matches(httpContext) {
        if (httpContext.installationid
            && httpContext.isrequest
            || !httpContext.isrequest
                && this.useEncryption
                && httpContext.url.endsWith('/registration')
                && this.usesMethod(httpContext, 'POST')) {
            return true;
        }
        return false;
    }
    async filterRequest(httpContext) {
        if (httpContext.installationid
            && this.installationIdCryptService.isEncrypted(httpContext.installationid)) {
            try {
                httpContext.installationid = this.decryptInstallationId(httpContext.installationid);
            }
            catch (e) {
                console_1.error(e);
                throw new Error('InstallationId is invalid and can not be decrypted');
            }
        }
    }
    async filterResponse(httpContext) {
        const response = await httpContext.response.json();
        if (response.installation) {
            const encryptedInstallationId = await this.installationIdCryptService.encryptInstallationId(response.installation);
            this.idCache.set(encryptedInstallationId, response.installation);
            return {
                installation: encryptedInstallationId,
            };
        }
        console_1.debug('Installationid is empty in filterResponse');
        return null;
    }
    decryptInstallationId(encInstallationId) {
        let decInstallationId = this.idCache.get(encInstallationId);
        if (!decInstallationId) {
            try {
                decInstallationId = this.installationIdCryptService.decryptInstallationId(encInstallationId);
            }
            catch (e) {
                console_1.error(e);
                throw e instanceof Error ? e : new Error(e);
            }
            this.idCache.set(encInstallationId, decInstallationId);
        }
        return decInstallationId;
    }
}
exports.EncryptInstallationIdFilter = EncryptInstallationIdFilter;
