"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AhoiHelper {
    constructor(installationIdCryptService, ahoiClientTokenService, ahoiBankingTokenService, baseUrl, apiUrl) {
        this.installationIdCryptService = installationIdCryptService;
        this.ahoiClientTokenService = ahoiClientTokenService;
        this.ahoiBankingTokenService = ahoiBankingTokenService;
        this.baseUrl = baseUrl;
        this.apiUrl = apiUrl;
    }
    async encryptInstallationId(installationId) {
        if (this.installationIdCryptService) {
            return this.installationIdCryptService.encryptInstallationId(installationId);
        }
        throw new Error('InstallationId can not be encrypted. No cryptKey is set in configuration');
    }
    decryptInstallationId(encryptedInstallationId) {
        if (this.installationIdCryptService) {
            return this.installationIdCryptService.decryptInstallationId(encryptedInstallationId);
        }
        throw new Error('InstallationId can not be encrypted. No cryptKey is set in configuration');
    }
    async getBankingToken(installationId) {
        const encInstallationId = await this.encryptInstallationId(installationId);
        return this.ahoiBankingTokenService.authenticate(encInstallationId);
    }
    async getClientAuthToken() {
        return this.ahoiClientTokenService.authenticate();
    }
    /**
     * Return the base url that is used e.g. to authenticate the app against AHOI.
     *
     * @example https://banking-sandbox.starfinanz.de
     *
     * @returns {string}
     * @memberof AhoiHelper
     */
    getBaseUrl() {
        return this.baseUrl;
    }
    /**
     * Return the API url used to get data from AHOI.
     *
     * @example https://banking-sandbox.starfinanz.de/ahoi/api/v2
     *
     * @returns {string}
     * @memberof AhoiHelper
     */
    getApiUrl() {
        return this.apiUrl;
    }
}
exports.AhoiHelper = AhoiHelper;
