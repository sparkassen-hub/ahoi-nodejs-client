"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aescrypt_1 = require("../lib/crypt/aescrypt");
class InstallationIdCryptService {
    constructor(cryptKey) {
        this.cryptKey = cryptKey;
    }
    async encryptInstallationId(installationId) {
        return InstallationIdCryptService.PREFIX +
            await aescrypt_1.AESCrypt.encryptRandomIV(installationId, this.cryptKey);
    }
    decryptInstallationId(encryptedInstallationId) {
        if (this.isEncrypted(encryptedInstallationId)) {
            const idWithoutPrefix = encryptedInstallationId.substring(InstallationIdCryptService.PREFIX.length);
            return aescrypt_1.AESCrypt.decryptRandomIV(idWithoutPrefix, this.cryptKey);
        }
        return encryptedInstallationId;
    }
    isEncrypted(installationId) {
        return installationId.startsWith(InstallationIdCryptService.PREFIX);
    }
}
InstallationIdCryptService.PREFIX = 'enc-';
exports.InstallationIdCryptService = InstallationIdCryptService;
