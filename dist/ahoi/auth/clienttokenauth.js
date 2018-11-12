"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractauth_1 = require("./abstractauth");
const console_1 = require("console");
class AhoiClientTokenService extends abstractauth_1.AbstractAhoiAuthenticationService {
    /**
     * Authenticate and authorize the client using clientId and client-Secret against AHOI using the
     * OAuth 2.0 protocol.<br/>
     * The returned authorization token is needed to register new users.<br/>
     * see: https://banking-sandbox.starfinanz.de/ahoi/docs/cookbook/index.html#authentication
     *
     * @returns {Promise<Token>}
     * @memberof AhoiClientTokenService
     */
    async authenticate() {
        if (this.accesstoken && !this.accesstoken.isExpired()) {
            console_1.debug('Client token is not expired, return %o', this.accesstoken);
            return this.accesstoken;
        }
        this.accesstoken = await this.callAhoiOAuthServer();
        console_1.debug('Get new client token, return %o', this.accesstoken);
        return this.accesstoken;
    }
}
exports.AhoiClientTokenService = AhoiClientTokenService;
