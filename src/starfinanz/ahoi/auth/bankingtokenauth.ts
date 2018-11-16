import { debug } from 'console';

import { AhoiConfig } from '../config/ahoiconfig';
import { TokenCache } from '../cache/tokencache';
import { AESCrypt, Cipher } from '../lib/crypt/aescrypt';
import { Base64Util } from '../lib/crypt/base64util';
import { CryptUtil } from '../lib/crypt/cryptutil';
import { AbstractAhoiAuthenticationService } from './abstractauth';
import { AhoiClientTokenService } from './clienttokenauth';
import { Token } from './token';

export class AhoiBankingTokenService extends AbstractAhoiAuthenticationService {

  public static readonly AUTH_BANKINGTOKEN_HEADER = 'X-Authorization-Ahoi';

  private readonly tokencache: TokenCache;

  constructor(config: AhoiConfig,
              private ahoiClientTokenService: AhoiClientTokenService,
              baseUrl: string) {
    super(config, baseUrl);
    this.tokencache = new TokenCache();
  }

  /**
   * Authenticate and authorize the user with the given installationId against AHOI using OAuth 2.0
   * protocol. The returned authorization token called 'banking token' is needed to access the AHOI
   * endpoints e.g. to get transactions.<br/>
   * see: https://banking-sandbox.starfinanz.de/ahoi/docs/cookbook/index.html#authentication
   *
   * @param {string} installationid
   * @returns {Promise<Token>}
   * @memberof AhoiBankingTokenService
   */
  public async authenticate(installationId: string): Promise<Token> {
    const token = this.tokencache.get(installationId);
    debug('Get token from cache %s', token);
    if (token && !token.isExpired()) {
      debug('Get banking token from cache %o', token);
      return token;
    }

    const authHeader: Map<string, string> = await this.createAuthHeader(installationId);
    debug('AuthHeader %o', authHeader);
    const bankingtoken = await this.callAhoiOAuthServer(authHeader);
    this.tokencache.set(installationId, bankingtoken);
    debug('Return banking token %o', bankingtoken);
    return bankingtoken;
  }

  private async createAuthHeader(installationId: string): Promise<Map<string, string>> {
    const authHeaders = new Map<string, string>();
    const xAuthHeader: string = JSON.stringify({
      installationId,
      // 32 byte random string
      nonce: await CryptUtil.generateNonce(32),
      timestamp: new Date().toISOString(),
    });
    debug(xAuthHeader);

    const useEncryption = await this.useEncryption();
    let encXAuthHeader: string = '';
    if (useEncryption) {
      debug('Header must be encrypted, encrypt header...');
      // encrypt xAuthHeader (X-Authorization - Ahoi)
      encXAuthHeader = await AESCrypt.encrypt(xAuthHeader,
                                              Base64Util.urlSafeBase64Decode(this.config.appSecretKey!),
                                              Cipher.AES_CBC,
                                              this.config.appSecretIv!);
    }

    authHeaders.set(AhoiBankingTokenService.AUTH_BANKINGTOKEN_HEADER,
                    encXAuthHeader ? Base64Util.base64ToUrlSafeBase64(encXAuthHeader)
        : Base64Util.urlSafeBase64Encode(xAuthHeader));
    return authHeaders;
  }

  private async useEncryption(): Promise<boolean> {
    const accessToken: Token = await this.ahoiClientTokenService.authenticate();
    if (accessToken.useEncryption() && this.config.appSecretKey && this.config.appSecretIv) {
      return true;
    }
    return false;
  }

}
