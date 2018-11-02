"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const node_fetch_1 = require("node-fetch");
const token_1 = require("./token");
class AbstractAhoiAuthenticationService {
    constructor(config) {
        this.config = config;
        const baseUrl = this.getBaseUrl(config.baseurl);
        // tslint:disable-next-line:max-line-length
        this.uri = `${baseUrl}${AbstractAhoiAuthenticationService.AUTH_URI}?${AbstractAhoiAuthenticationService.AUTH_CREDENTIALS_PARAMETER}`;
    }
    async callAhoiOAuthServer(headerMap) {
        const headers = this.createAuthHeaders(headerMap);
        const options = {
            headers,
            method: 'POST',
            timeout: 10000,
            compress: true,
        };
        try {
            const response = await node_fetch_1.default(this.uri, options);
            if (response.ok) {
                const token = await response.json();
                return new token_1.Token(token.access_token);
            }
            const errorMsg = await response.text();
            throw new node_fetch_1.FetchError(errorMsg, 'auth-error', '');
        }
        catch (err) {
            console_1.error(err);
            throw err instanceof Error ? err : new Error(err);
        }
    }
    mergeHeaders(headers, headerMap) {
        if (headerMap) {
            for (const [key, value] of headerMap) {
                headers.set(key, value);
            }
        }
    }
    createAuthHeaders(headerMap) {
        const authHeaders = {
            // tslint:disable-next-line:prefer-template
            Authorization: 'Basic ' + Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`)
                .toString('base64'),
            accept: 'application/json',
            'content-type': 'application/json;charset=UTF-8',
        };
        const headers = new node_fetch_1.Headers(authHeaders);
        this.mergeHeaders(headers, headerMap);
        return headers;
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
    getBaseUrl(baseUrl) {
        const start = baseUrl.search(/\/\//);
        const protocol = baseUrl.substring(0, start === -1 ? 0 : start + 2);
        const domain = (baseUrl.substring(protocol.length).match(/[^\/]+/) || [''])[0];
        return protocol + domain;
    }
}
AbstractAhoiAuthenticationService.AUTH_URI = '/auth/v1/oauth/token';
AbstractAhoiAuthenticationService.AUTH_CREDENTIALS_PARAMETER = 'grant_type=client_credentials';
exports.AbstractAhoiAuthenticationService = AbstractAhoiAuthenticationService;
