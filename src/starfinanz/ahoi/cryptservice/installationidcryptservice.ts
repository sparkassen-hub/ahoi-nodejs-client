import { AESCrypt } from '../lib/crypt/aescrypt';

export class InstallationIdCryptService {

  private static readonly PREFIX = 'enc-';

  constructor(private cryptKey: string) { }

  public async encryptInstallationId(installationId: string): Promise<string> {
    return InstallationIdCryptService.PREFIX +
      await AESCrypt.encryptRandomIV(installationId, this.cryptKey);
  }

  public decryptInstallationId(encryptedInstallationId: string): string {
    if (this.isEncrypted(encryptedInstallationId)) {
      const idWithoutPrefix = encryptedInstallationId.substring(InstallationIdCryptService.PREFIX.length);
      return AESCrypt.decryptRandomIV(idWithoutPrefix, this.cryptKey);
    }
    return encryptedInstallationId;
  }

  public isEncrypted(installationId: string): boolean {
    return installationId.startsWith(InstallationIdCryptService.PREFIX);
  }
}
