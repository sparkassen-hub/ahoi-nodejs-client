export declare class InstallationIdCryptService {
    private cryptKey;
    private static readonly PREFIX;
    constructor(cryptKey: string);
    encryptInstallationId(installationId: string): Promise<string>;
    decryptInstallationId(encryptedInstallationId: string): string;
    isEncrypted(installationId: string): boolean;
}
