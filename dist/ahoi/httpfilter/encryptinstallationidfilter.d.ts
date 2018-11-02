import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { InstallationIdCryptService } from '../cryptservice/installationidcryptservice';
import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';
export declare class EncryptInstallationIdFilter extends AbstractHttpFilter {
    private installationIdCryptService;
    private useEncryption;
    private idCache;
    constructor(installationIdCryptService: InstallationIdCryptService, ahoiClientTokenService: AhoiClientTokenService, ahoiBankingTokenService: AhoiBankingTokenService, useEncryption?: boolean);
    /**
     * Decrypts installationid if it is available and encrypted. Encrypts installationid's that are
     * requested from AHOI Registration endpoint if encryption of installationid's is activated in
     * configuration ({AhoiConfig.encryptInstallationId).
     *
     * @param {HttpContext} httpContext
     * @returns {Promise<boolean>}
     * @memberof InstallationIdCryptFilter
     */
    matches(httpContext: HttpContext): Promise<boolean>;
    protected filterRequest(httpContext: HttpContext): Promise<void>;
    protected filterResponse(httpContext: HttpContext): Promise<any>;
    protected decryptInstallationId(encInstallationId: string): string;
}
