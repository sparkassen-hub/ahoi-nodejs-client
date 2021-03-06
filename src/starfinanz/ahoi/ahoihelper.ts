import { AhoiBankingTokenService } from './auth/bankingtokenauth';
import { AhoiClientTokenService } from './auth/clienttokenauth';
import { Token } from './auth/token';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';

export class AhoiHelper {

  constructor(private installationIdCryptService: InstallationIdCryptService,
              private ahoiClientTokenService: AhoiClientTokenService,
              private ahoiBankingTokenService: AhoiBankingTokenService,
              private baseUrl: string,
              private apiUrl: string) { }

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

  /**
   * Return the base url that is used e.g. to authenticate the app against AHOI.
   *
   * @example https://banking-sandbox.starfinanz.de
   *
   * @returns {string}
   * @memberof AhoiHelper
   */
  public getBaseUrl(): string {
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
  public getApiUrl(): string {
    return this.apiUrl;
  }
}
