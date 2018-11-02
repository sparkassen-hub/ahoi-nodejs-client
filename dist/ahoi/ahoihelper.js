"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AhoiHelper {
    constructor(installationIdCryptService, ahoiClientTokenService, ahoiBankingTokenService) {
        this.installationIdCryptService = installationIdCryptService;
        this.ahoiClientTokenService = ahoiClientTokenService;
        this.ahoiBankingTokenService = ahoiBankingTokenService;
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
}
exports.AhoiHelper = AhoiHelper;
