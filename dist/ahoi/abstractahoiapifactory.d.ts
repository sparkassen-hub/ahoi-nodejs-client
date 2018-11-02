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
    constructor(config: AhoiConfig);
    protected getApiInstance<T>(api: (new (configuration: Configuration, basePath: string, fetch: FetchAPI) => T), installationId: string, bankingToken?: string): Promise<T>;
    private initHttpFilters;
    private checkConfig;
}
