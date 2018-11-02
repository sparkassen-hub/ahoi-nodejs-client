import { debug, error, info } from 'console';

import { RegistrationResponse } from 'ahoi-swagger-fetchclient';

import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { EncInstallationIdCache } from '../cache/encinstallationidcache';
import { InstallationIdCryptService } from '../cryptservice/installationidcryptservice';
import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';

export class EncryptInstallationIdFilter extends AbstractHttpFilter {

  private idCache: EncInstallationIdCache;

  constructor(private installationIdCryptService: InstallationIdCryptService,
              ahoiClientTokenService: AhoiClientTokenService,
              ahoiBankingTokenService: AhoiBankingTokenService,
              private useEncryption: boolean = true) {
    super(ahoiClientTokenService, ahoiBankingTokenService);
    this.idCache = new EncInstallationIdCache();
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
  public async matches(httpContext: HttpContext): Promise<boolean> {
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

  protected async filterRequest(httpContext: HttpContext): Promise<void> {
    if (httpContext.installationid
      && this.installationIdCryptService.isEncrypted(httpContext.installationid)) {
      try {
        httpContext.installationid = this.decryptInstallationId(httpContext.installationid);
      } catch (e) {
        error(e);
        throw new Error('InstallationId is invalid and can not be decrypted');
      }
    }
  }

  protected async filterResponse(httpContext: HttpContext): Promise<any> {
    const response: RegistrationResponse = await httpContext.response.json();
    if (response.installation) {
      const encryptedInstallationId =
        await this.installationIdCryptService.encryptInstallationId(response.installation);
      this.idCache.set(encryptedInstallationId, response.installation);
      return {
        installation: encryptedInstallationId,
      };
    }
    debug('Installationid is empty in filterResponse');
    return null;
  }

  protected decryptInstallationId(encInstallationId: string): string {
    let decInstallationId: string | undefined = this.idCache.get(encInstallationId);
    if (!decInstallationId) {
      try {
        decInstallationId = this.installationIdCryptService.decryptInstallationId(encInstallationId);
      } catch (e) {
        error(e);
        throw e instanceof Error ? e : new Error(e);
      }
      this.idCache.set(encInstallationId, decInstallationId);
    }
    return decInstallationId;
  }

}
