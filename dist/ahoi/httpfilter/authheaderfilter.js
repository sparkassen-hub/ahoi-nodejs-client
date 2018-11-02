"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstracthttpfilter_1 = require("./abstracthttpfilter");
class AuthHeaderFilter extends abstracthttpfilter_1.AbstractHttpFilter {
    async matches(httpContext) {
        // add bearer token from client authentication or user authentication (banking token) to all
        // requests
        return httpContext.isrequest;
    }
    /**
     * Set the OAuth 2 authentication header (Bearer token). Depepending on called endpoint, the
     * client auth token or the banking token will be set.
     *
     * @protected
     * @param {HttpContext} httpContext
     * @returns {Promise<void>}
     * @memberof AuthHeaderFilter
     */
    async filterRequest(httpContext) {
        // FIXME: registration update (PUT) -> client or banking token?
        let bearerToken;
        if (httpContext.url.endsWith('/registration') && this.usesMethod(httpContext, 'POST')
            || httpContext.url.endsWith('/registration/keys')) {
            bearerToken = await this.getAuthToken(httpContext);
        }
        else {
            bearerToken = await this.getBankingToken(httpContext);
        }
        this.setHeader(httpContext, 'Authorization', `Bearer ${bearerToken.getAccessToken()}`);
        // debug(httpContext.options.headers);
    }
}
exports.AuthHeaderFilter = AuthHeaderFilter;
