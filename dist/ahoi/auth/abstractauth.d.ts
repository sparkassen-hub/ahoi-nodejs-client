import { AhoiConfig } from '../config/ahoiconfig';
import { Token } from './token';
export declare abstract class AbstractAhoiAuthenticationService {
    protected config: AhoiConfig;
    static readonly AUTH_URI: string;
    static readonly AUTH_CREDENTIALS_PARAMETER = "grant_type=client_credentials";
    protected readonly uri: string;
    constructor(config: AhoiConfig);
    protected callAhoiOAuthServer(headerMap?: Map<string, string>): Promise<Token>;
    private mergeHeaders;
    private createAuthHeaders;
    /**
     * Extracts protocol and domain from given url<br/>
     * Given 'https://banking-sandbox.starfinanz.de/ahoi/api/v2' the result is
     * 'https://banking-sandbox.starfinanz.de'<br/>
     * This helper function is needed as the base url for the AHOI authorization server may have a
     * different base url than the resource server (currently: /auth/v1 vs. /ahoi/api/v2)
     *
     * @private
     * @param {string} baseUrl
     * @returns {string}
     * @memberof AhoiAuthenticationService
     */
    private getBaseUrl;
}
