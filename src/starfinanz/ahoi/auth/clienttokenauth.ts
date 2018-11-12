import { AbstractAhoiAuthenticationService } from './abstractauth';
import { Token } from './token';
import { debug } from 'console';

export class AhoiClientTokenService extends AbstractAhoiAuthenticationService {

  private accesstoken!: Token;

  /**
   * Authenticate and authorize the client using clientId and client-Secret against AHOI using the
   * OAuth 2.0 protocol.<br/>
   * The returned authorization token is needed to register new users.<br/>
   * see: https://banking-sandbox.starfinanz.de/ahoi/docs/cookbook/index.html#authentication
   *
   * @returns {Promise<Token>}
   * @memberof AhoiClientTokenService
   */
  public async authenticate(): Promise<Token> {
    if (this.accesstoken && !this.accesstoken.isExpired()) {
      debug('Client token is not expired, return %o', this.accesstoken);
      return this.accesstoken;
    }

    this.accesstoken = await this.callAhoiOAuthServer();
    debug('Get new client token, return %o', this.accesstoken);
    return this.accesstoken;
  }

}
