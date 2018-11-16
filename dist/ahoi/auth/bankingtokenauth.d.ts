import { AhoiConfig } from '../config/ahoiconfig';
import { AbstractAhoiAuthenticationService } from './abstractauth';
import { AhoiClientTokenService } from './clienttokenauth';
import { Token } from './token';
export declare class AhoiBankingTokenService extends AbstractAhoiAuthenticationService {
    private ahoiClientTokenService;
    static readonly AUTH_BANKINGTOKEN_HEADER = "X-Authorization-Ahoi";
    private readonly tokencache;
    constructor(config: AhoiConfig, ahoiClientTokenService: AhoiClientTokenService, baseUrl: string);
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
    authenticate(installationId: string): Promise<Token>;
    private createAuthHeader;
    private useEncryption;
}
