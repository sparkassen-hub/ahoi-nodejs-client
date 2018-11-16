"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const node_fetch_1 = require("node-fetch");
const token_1 = require("./token");
class AbstractAhoiAuthenticationService {
    constructor(config, baseUrl) {
        this.config = config;
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
}
AbstractAhoiAuthenticationService.AUTH_URI = '/auth/v1/oauth/token';
AbstractAhoiAuthenticationService.AUTH_CREDENTIALS_PARAMETER = 'grant_type=client_credentials';
exports.AbstractAhoiAuthenticationService = AbstractAhoiAuthenticationService;
