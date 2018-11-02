import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { AhoiSessionKeyHeaderService } from '../cryptservice/sessionkeyheaderservice';
import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';
/**
 * This filter is active only if encryption is needed.<br/>
 * It adds AHOI session security filter with encrypted session key and encrypted banking
 * access data for Access endpoint if encryption is active. It decrypts installationId from AHOI
 * Registration endpoint response if encryption is active.
 *
 * @export
 * @class EncryptSessionFilter
 * @extends {AbstractHttpFilter}
 */
export declare class EncryptSessionFilter extends AbstractHttpFilter {
    private ahoiSessionKeyHeaderService;
    static readonly SESSIONKEY_ITEM_NAME = "sessionKey";
    private static readonly ACCESS_DTO_NAMES;
    constructor(ahoiSessionKeyHeaderService: AhoiSessionKeyHeaderService, ahoiClientTokenService: AhoiClientTokenService, ahoiBankingTokenService: AhoiBankingTokenService);
    /**
     * Filter requests to Registration and Access endpoint (register new client/user in AHOI, grant
     * bank access) and responses from Registration endpoint if encryption is active to add AHOI
     * session security header and decrypt installationId from AHOI response
     *
     * @param {HttpContext} httpContext
     * @returns {Promise<boolean>}
     * @memberof SessionEncryptionFilter
     */
    matches(httpContext: HttpContext): Promise<boolean>;
    protected filterRequest(httpContext: HttpContext): Promise<void>;
    /**
     * Encrypt access data (PIN, USERNAME, CUSTOMERNUMBER) with session key when sending a request to
     * the Access endpoint
     *
     * @private
     * @param {HttpContext} httpContext
     * @returns {Promise<void>}
     * @memberof EncryptSessionFilter
     */
    private encryptBankAccessData;
    /**
     * Decrypt installationid with session key if endpoint is Registration
     *
     * @protected
     * @param {HttpContext} httpContext
     * @returns {Promise<any>}
     * @memberof SessionEncryptionFilter
     */
    protected filterResponse(httpContext: HttpContext): Promise<any>;
    /**
     * Create new {@link RegistrationResponse} with decrypted installationId that is used to replace
     * the response from AHOI with encrypted installationId
     *
     * @private
     * @param {string} encInstallationId
     * @param {string} sessionKey
     * @returns {RegistrationResponse}
     * @memberof SessionEncryptionFilter
     */
    private createResponseWithDecryptedInstallationId;
    private isRegistrationOrAccessesEndpoint;
    private useEncryption;
}
