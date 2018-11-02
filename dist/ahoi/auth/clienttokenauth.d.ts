import { AbstractAhoiAuthenticationService } from './abstractauth';
import { Token } from './token';
export declare class AhoiClientTokenService extends AbstractAhoiAuthenticationService {
    private accesstoken;
    /**
     * Authenticate and authorize the client using clientId and client-Secret against AHOI using the
     * OAuth 2.0 protocol.<br/>
     * The returned authorization token is needed to register new users.<br/>
     * see: https://banking-sandbox.starfinanz.de/ahoi/docs/cookbook/index.html#authentication
     *
     * @returns {Promise<Token>}
     * @memberof AhoiClientTokenService
     */
    authenticate(): Promise<Token>;
}
