import { RegistrationResponse } from 'ahoi-swagger-fetchclient';

import { Base64Util } from './../lib/crypt/base64util';
import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { Token } from '../auth/token';
import { AhoiSessionKeyHeaderService } from '../cryptservice/sessionkeyheaderservice';
import { AESCrypt, Cipher } from '../lib/crypt/aescrypt';
import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';

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
export class EncryptSessionFilter extends AbstractHttpFilter {

  public static readonly SESSIONKEY_ITEM_NAME = 'sessionKey';

  // see AccessFieldsMap
  private static readonly ACCESS_DTO_NAMES = ['PIN', 'USERNAME', 'CUSTOMERNUMBER'];

  constructor(private ahoiSessionKeyHeaderService: AhoiSessionKeyHeaderService,
              ahoiClientTokenService: AhoiClientTokenService,
              ahoiBankingTokenService: AhoiBankingTokenService) {
    super(ahoiClientTokenService, ahoiBankingTokenService);
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
  public async matches(httpContext: HttpContext): Promise<boolean> {
    const matches: boolean =
      this.isRegistrationOrAccessesEndpoint(httpContext)
      && (this.usesMethod(httpContext, 'POST') || this.usesMethod(httpContext, 'PUT'))
      && await this.useEncryption(httpContext);
    return matches;
  }

  protected async filterRequest(httpContext: HttpContext): Promise<void> {
    // debug('filterRequest %s', context.url);
    // get public key from AHOI server, generate session key, encrypt session key with public key
    // and add session security header if endpoint is Registration or Access
    const sessionKey = await this.ahoiSessionKeyHeaderService.generateSessionKey();
    const ahoiSessionSecurityHeader: string = await this.ahoiSessionKeyHeaderService.getHeader(sessionKey);
    this.setHeader(httpContext, AhoiSessionKeyHeaderService.SESSIONKEY_HEADER_NAME, ahoiSessionSecurityHeader);

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
  private async encryptBankAccessData(httpContext: HttpContext, sessionKey: string): Promise<void> {
    if (httpContext.url.includes('/accesses') && httpContext.options.body) {
      const body: any = JSON.parse(httpContext.options.body.toString());
      for await (const name of EncryptSessionFilter.ACCESS_DTO_NAMES) {
        if (body['accessFields'][name]) {
          body['accessFields'][name] =
            Base64Util.base64ToUrlSafeBase64(await AESCrypt.encrypt(body['accessFields'][name],
                                                                    Buffer.from(sessionKey, 'base64'),
                                                                    Cipher.AES_CBC));
        }
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
  protected async filterResponse(httpContext: HttpContext): Promise<any> {
    if (httpContext.url.endsWith('/registration')) {
      const sessionKey: string = httpContext.data.get(EncryptSessionFilter.SESSIONKEY_ITEM_NAME);
      const response: RegistrationResponse = await this.getResponse<RegistrationResponse>(httpContext);
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
  private createResponseWithDecryptedInstallationId(encInstallationId: string,
                                                    sessionKey: string): RegistrationResponse {
    const decryptedInstallationId = AESCrypt.decrypt(encInstallationId,
                                                     Buffer.from(sessionKey, 'base64'),
                                                     Cipher.AES_CBC);
    const response: RegistrationResponse = {
      installation: decryptedInstallationId,
    };
    return response;
  }

  private isRegistrationOrAccessesEndpoint(httpContext: HttpContext): boolean {
    // /accesses/:accessid
    const accessRegEx = new RegExp('/accesses/[0-9]+$');
    return httpContext.url.endsWith('/registration')
      || httpContext.url.endsWith('/accesses')
      || accessRegEx.test(httpContext.url);
  }

  private async useEncryption(httpContext: HttpContext): Promise<boolean> {
    const token: Token = await this.getToken(httpContext);
    return token.useEncryption();
  }

}
