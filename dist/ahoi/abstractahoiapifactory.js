"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ahoi_swagger_fetchclient_1 = require("ahoi-swagger-fetchclient");
const ahoihelper_1 = require("./ahoihelper");
const ahoipublickey_1 = require("./auth/ahoipublickey");
const bankingtokenauth_1 = require("./auth/bankingtokenauth");
const clienttokenauth_1 = require("./auth/clienttokenauth");
const installationidcryptservice_1 = require("./cryptservice/installationidcryptservice");
const sessionkeyheaderservice_1 = require("./cryptservice/sessionkeyheaderservice");
const fetchhttpfactory_1 = require("./httpclient/fetchhttpfactory");
const authheaderfilter_1 = require("./httpfilter/authheaderfilter");
const encryptinstallationidfilter_1 = require("./httpfilter/encryptinstallationidfilter");
const encryptsessionfilter_1 = require("./httpfilter/encryptsessionfilter");
const httprequesttimeoutfilter_1 = require("./httpfilter/httprequesttimeoutfilter");
const console_1 = require("console");
class AbstractAhoiApiFactory {
    constructor(config) {
        this.config = config;
        this.checkConfig(config);
        /* init services */
        this.fetchHttpFactory = new fetchhttpfactory_1.FetchHttpFactory();
        const ahoiPublicKeyService = new ahoipublickey_1.AhoiPublicKeyService(this.fetchHttpFactory, config.baseurl);
        const ahoiSessionKeyHeaderService = new sessionkeyheaderservice_1.AhoiSessionKeyHeaderService(ahoiPublicKeyService);
        const ahoiClientTokenService = new clienttokenauth_1.AhoiClientTokenService(config);
        const ahoiBankingTokenService = new bankingtokenauth_1.AhoiBankingTokenService(config, ahoiClientTokenService);
        // Try to fetch auth token on startup without blocking the thread by using await
        ahoiClientTokenService.authenticate();
        this.ahoiConfiguration = new ahoi_swagger_fetchclient_1.Configuration({ basePath: config.baseurl });
        if (config.cryptKey) {
            this.installationIdCryptService = new installationidcryptservice_1.InstallationIdCryptService(config.cryptKey);
        }
        this.ahoiHelper = new ahoihelper_1.AhoiHelper(this.installationIdCryptService, ahoiClientTokenService, ahoiBankingTokenService);
        /* init http filters */
        const httpfilter = this.initHttpFilters(ahoiClientTokenService, ahoiBankingTokenService, ahoiSessionKeyHeaderService, this.installationIdCryptService);
        this.fetchHttpFactory.setHttpFilter(httpfilter);
    }
    async getApiInstance(api, installationId, bankingToken) {
        console_1.debug('InstallationId %s', installationId);
        return new api(this.ahoiConfiguration, this.ahoiConfiguration.basePath || '', this.fetchHttpFactory.getHttpClient(installationId, bankingToken));
    }
    initHttpFilters(ahoiClientTokenService, ahoiBankingTokenService, ahoiSessionKeyHeaderService, installationIdCryptService) {
        const filters = [];
        if (installationIdCryptService) {
            filters.push(new encryptinstallationidfilter_1.EncryptInstallationIdFilter(installationIdCryptService, ahoiClientTokenService, ahoiBankingTokenService));
        }
        filters.push(new encryptsessionfilter_1.EncryptSessionFilter(ahoiSessionKeyHeaderService, ahoiClientTokenService, ahoiBankingTokenService));
        filters.push(new authheaderfilter_1.AuthHeaderFilter(ahoiClientTokenService, ahoiBankingTokenService));
        filters.push(new httprequesttimeoutfilter_1.HttpRequestTimeoutFilter(ahoiClientTokenService, ahoiBankingTokenService));
        return filters;
    }
    checkConfig(config) {
        if (!config.baseurl) {
            throw new Error('URL to AHOI API is missing in configuration (property: baseurl');
        }
        if (!config.clientId || !config.clientSecret) {
            throw new Error('Credentials for the AHOI API missed in given configuration \
      (properties: clientId, clientSecret)');
        }
        if (!config.appSecretIv || !config.appSecretKey) {
            console_1.warn('Secret or SecreIV are missing in configuration. \
      Encryption support is not available (properties appSecretKey, appSecretIv)');
        }
        if (!config.cryptKey) {
            console_1.warn('CryptKey missed in configuration. CryptSupport for InstallationId is not \
      available (property: cryptKey)');
        }
    }
}
exports.AbstractAhoiApiFactory = AbstractAhoiApiFactory;
