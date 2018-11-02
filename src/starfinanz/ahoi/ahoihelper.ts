import { AhoiBankingTokenService } from './auth/bankingtokenauth';
import { AhoiClientTokenService } from './auth/clienttokenauth';
import { Token } from './auth/token';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';

export class AhoiHelper {

  constructor(private installationIdCryptService: InstallationIdCryptService,
              private ahoiClientTokenService: AhoiClientTokenService,
              private ahoiBankingTokenService: AhoiBankingTokenService) { }

  public async encryptInstallationId(installationId: string): Promise<string> {
    if (this.installationIdCryptService) {
      return this.installationIdCryptService.encryptInstallationId(installationId);
    }
    throw new Error('InstallationId can not be encrypted. No cryptKey is set in configuration');
  }

  public decryptInstallationId(encryptedInstallationId: string): string {
    if (this.installationIdCryptService) {
      return this.installationIdCryptService.decryptInstallationId(encryptedInstallationId);
    }
    throw new Error('InstallationId can not be encrypted. No cryptKey is set in configuration');
  }

  public async getBankingToken(installationId: string): Promise<Token> {
    const encInstallationId = await this.encryptInstallationId(installationId);
    return this.ahoiBankingTokenService.authenticate(encInstallationId);
  }

  public async getClientAuthToken(): Promise<Token> {
    return this.ahoiClientTokenService.authenticate();
  }
}
