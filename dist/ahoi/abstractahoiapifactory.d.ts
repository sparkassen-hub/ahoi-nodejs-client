import { Configuration, FetchAPI } from 'ahoi-swagger-fetchclient';
import { AhoiConfig } from './config/ahoiconfig';
import { AhoiHelper } from './ahoihelper';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';
import { FetchHttpFactory } from './httpclient/fetchhttpfactory';
export declare abstract class AbstractAhoiApiFactory {
    protected config: AhoiConfig;
    protected fetchHttpFactory: FetchHttpFactory;
    protected installationIdCryptService: InstallationIdCryptService;
    protected ahoiHelper: AhoiHelper;
    protected ahoiConfiguration: Configuration;
    protected baseUrl: string;
    protected apiUrl: string;
    constructor(config: AhoiConfig);
    protected getApiInstance<T>(api: (new (configuration: Configuration, basePath: string, fetch: FetchAPI) => T), installationId: string, bankingToken?: string): Promise<T>;
    private initHttpFilters;
    private checkConfig;
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
