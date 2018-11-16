import { AhoiBankingTokenService } from './auth/bankingtokenauth';
import { AhoiClientTokenService } from './auth/clienttokenauth';
import { Token } from './auth/token';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';
export declare class AhoiHelper {
    private installationIdCryptService;
    private ahoiClientTokenService;
    private ahoiBankingTokenService;
    private baseUrl;
    private apiUrl;
    constructor(installationIdCryptService: InstallationIdCryptService, ahoiClientTokenService: AhoiClientTokenService, ahoiBankingTokenService: AhoiBankingTokenService, baseUrl: string, apiUrl: string);
    encryptInstallationId(installationId: string): Promise<string>;
    decryptInstallationId(encryptedInstallationId: string): string;
    getBankingToken(installationId: string): Promise<Token>;
    getClientAuthToken(): Promise<Token>;
    /**
     * Return the base url that is used e.g. to authenticate the app against AHOI.
     *
     * @example https://banking-sandbox.starfinanz.de
     *
     * @returns {string}
     * @memberof AhoiHelper
     */
    getBaseUrl(): string;
    /**
     * Return the API url used to get data from AHOI.
     *
     * @example https://banking-sandbox.starfinanz.de/ahoi/api/v2
     *
     * @returns {string}
     * @memberof AhoiHelper
     */
    getApiUrl(): string;
}
