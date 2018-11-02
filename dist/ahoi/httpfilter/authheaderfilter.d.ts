import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';
export declare class AuthHeaderFilter extends AbstractHttpFilter {
    matches(httpContext: HttpContext): Promise<boolean>;
    /**
     * Set the OAuth 2 authentication header (Bearer token). Depepending on called endpoint, the
     * client auth token or the banking token will be set.
     *
     * @protected
     * @param {HttpContext} httpContext
     * @returns {Promise<void>}
     * @memberof AuthHeaderFilter
     */
    protected filterRequest(httpContext: HttpContext): Promise<void>;
}
