import { Configuration, FetchAPI } from 'ahoi-swagger-fetchclient';

import { AhoiConfig } from './config/ahoiconfig';
import { AhoiHelper } from './ahoihelper';
import { AhoiPublicKeyService } from './auth/ahoipublickey';
import { AhoiBankingTokenService } from './auth/bankingtokenauth';
import { AhoiClientTokenService } from './auth/clienttokenauth';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';
import { AhoiSessionKeyHeaderService } from './cryptservice/sessionkeyheaderservice';
import { FetchHttpFactory } from './httpclient/fetchhttpfactory';
import { AuthHeaderFilter } from './httpfilter/authheaderfilter';
import { EncryptInstallationIdFilter } from './httpfilter/encryptinstallationidfilter';
import { EncryptSessionFilter } from './httpfilter/encryptsessionfilter';
import { HttpFilter } from './lib/httpfilter/httpfilter';
import { HttpRequestTimeoutFilter } from './httpfilter/httprequesttimeoutfilter';
import { debug, warn } from 'console';

export abstract class AbstractAhoiApiFactory {

  protected fetchHttpFactory: FetchHttpFactory;
  protected installationIdCryptService!: InstallationIdCryptService;
  protected ahoiHelper: AhoiHelper;
  protected ahoiConfiguration: Configuration;
  protected baseUrl: string;
  protected apiUrl: string;

  constructor(protected config: AhoiConfig) {

    this.checkConfig(config);

    this.apiUrl = config.baseurl;
    this.baseUrl = this.getBaseUrl(this.apiUrl);

    /* init services */
    this.fetchHttpFactory = new FetchHttpFactory();
    const ahoiPublicKeyService: AhoiPublicKeyService = new AhoiPublicKeyService(this.fetchHttpFactory, config.baseurl);
    const ahoiSessionKeyHeaderService = new AhoiSessionKeyHeaderService(ahoiPublicKeyService);
    const ahoiClientTokenService = new AhoiClientTokenService(config, this.baseUrl);
    const ahoiBankingTokenService = new AhoiBankingTokenService(config, ahoiClientTokenService, this.baseUrl);

    // Try to fetch auth token on startup without blocking the thread by using await
    ahoiClientTokenService.authenticate();

    this.ahoiConfiguration = new Configuration({ basePath: config.baseurl });
    if (config.cryptKey) {
      this.installationIdCryptService = new InstallationIdCryptService(config.cryptKey);
    }
    this.ahoiHelper = new AhoiHelper(this.installationIdCryptService,
                                     ahoiClientTokenService,
                                     ahoiBankingTokenService,
                                     this.baseUrl,
                                     this.apiUrl);

    /* init http filters */
    const httpfilter: HttpFilter[] =
      this.initHttpFilters(ahoiClientTokenService,
                           ahoiBankingTokenService,
                           ahoiSessionKeyHeaderService,
                           this.installationIdCryptService);
    this.fetchHttpFactory.setHttpFilter(httpfilter);
  }

  protected async getApiInstance<T>(api: (new (configuration: Configuration,
                                               basePath: string, fetch: FetchAPI) => T),
                                    installationId: string,
                                    bankingToken?: string): Promise<T> {
    debug('InstallationId %s', installationId);
    return new api(this.ahoiConfiguration, this.ahoiConfiguration.basePath || '',
                   this.fetchHttpFactory.getHttpClient(installationId, bankingToken));
  }

  private initHttpFilters(ahoiClientTokenService: AhoiClientTokenService,
                          ahoiBankingTokenService: AhoiBankingTokenService,
                          ahoiSessionKeyHeaderService: AhoiSessionKeyHeaderService,
                          installationIdCryptService: InstallationIdCryptService): HttpFilter[] {
    const filters: HttpFilter[] = [];
    if (installationIdCryptService) {
      filters.push(new EncryptInstallationIdFilter(installationIdCryptService,
                                                   ahoiClientTokenService,
                                                   ahoiBankingTokenService));
    }
    filters.push(new EncryptSessionFilter(ahoiSessionKeyHeaderService,
                                          ahoiClientTokenService,
                                          ahoiBankingTokenService));
    filters.push(new AuthHeaderFilter(ahoiClientTokenService, ahoiBankingTokenService));
    filters.push(new HttpRequestTimeoutFilter(ahoiClientTokenService, ahoiBankingTokenService));
    return filters;
  }

  private checkConfig(config: AhoiConfig): void {
    if (!config.baseurl) {
      throw new Error('URL to AHOI API is missing in configuration (property: baseurl');
    }
    if (!config.clientId || !config.clientSecret) {
      throw new Error('Credentials for the AHOI API missed in given configuration \
      (properties: clientId, clientSecret)');
    }
    if (!config.appSecretIv || !config.appSecretKey) {
      warn('Secret or SecreIV are missing in configuration. \
      Encryption support is not available (properties appSecretKey, appSecretIv)');
    }
    if (!config.cryptKey) {
      warn('CryptKey missed in configuration. CryptSupport for InstallationId is not \
      available (property: cryptKey)');
    }
  }

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
  private getBaseUrl(baseUrl: string): string {
    const start = baseUrl.search(/\/\//);
    const protocol = baseUrl.substring(0, start === -1 ? 0 : start + 2);
    const domain = (baseUrl.substring(protocol.length).match(/[^\/]+/) || [''])[0];
    return protocol + domain;
  }

}
