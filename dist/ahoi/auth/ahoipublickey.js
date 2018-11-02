"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const node_fetch_1 = require("node-fetch");
class AhoiPublicKeyService {
    constructor(httpClientFactory, baseUrl) {
        this.httpClientFactory = httpClientFactory;
        this.uri = `${baseUrl}${AhoiPublicKeyService.PUBLIC_KEY_URI}`;
    }
    async getPublicKey() {
        if (this.publicKey && !this.isExpired(this.publicKey)) {
            return this.publicKey;
        }
        const options = {
            headers: AhoiPublicKeyService.headers,
            method: 'GET',
            timeout: 5000,
            compress: true,
        };
        try {
            const httpClient = this.httpClientFactory.getHttpClient();
            const response = await httpClient(this.uri, options);
            if (response.ok) {
                const regPublicKey = await response.json();
                this.publicKey = regPublicKey;
                return regPublicKey;
            }
            const errorMsg = await response.text();
            throw new node_fetch_1.FetchError(errorMsg, 'pubkey-error', '');
        }
        catch (err) {
            console_1.error(err);
            throw err instanceof Error ? err : new Error(err);
        }
    }
    isExpired(key) {
        // add 1 min. as buffer to be safe if connection is slow
        return new Date(key.validUntil).getTime() + 60 * 1000 < new Date().getTime();
    }
}
AhoiPublicKeyService.PUBLIC_KEY_URI = '/registration/keys';
AhoiPublicKeyService.headers = new node_fetch_1.Headers({
    accept: 'application/json',
    'content-type': 'application/json;charset=UTF-8',
});
exports.AhoiPublicKeyService = AhoiPublicKeyService;
