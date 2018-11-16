import { AhoiConfig } from '../config/ahoiconfig';
import { Token } from './token';
export declare abstract class AbstractAhoiAuthenticationService {
    protected config: AhoiConfig;
    static readonly AUTH_URI: string;
    static readonly AUTH_CREDENTIALS_PARAMETER = "grant_type=client_credentials";
    protected readonly uri: string;
    constructor(config: AhoiConfig, baseUrl: string);
    protected callAhoiOAuthServer(headerMap?: Map<string, string>): Promise<Token>;
    private mergeHeaders;
    private createAuthHeaders;
}
