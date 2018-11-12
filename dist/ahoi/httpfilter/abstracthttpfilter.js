"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const node_fetch_1 = require("node-fetch");
class AbstractHttpFilter {
    constructor(ahoiClientTokenService, ahoiBankingTokenService) {
        this.ahoiClientTokenService = ahoiClientTokenService;
        this.ahoiBankingTokenService = ahoiBankingTokenService;
    }
    async matches(httpContext) {
        return false;
    }
    async doFilter(httpContext) {
        if (httpContext.isrequest) {
            console_1.debug('doFilter %s', httpContext.url);
            await this.filterRequest(httpContext);
        }
        else {
            if (httpContext.response.status >= 200 && httpContext.response.status < 300) {
                const responseData = await this.filterResponse(httpContext);
                if (responseData) {
                    httpContext.response.json = async () => {
                        return responseData;
                    };
                }
            }
        }
    }
    async filterRequest(httpContext) { }
    async filterResponse(httpContext) { return null; }
    usesMethod(httpContext, method) {
        if (httpContext.options.method && method) {
            return httpContext.options.method.toLowerCase() === method.toLowerCase();
        }
        return false;
    }
    async getResponse(httpContext) {
        const responseData = await httpContext.response.json();
        return responseData;
    }
    setHeader(httpContext, name, value) {
        if (httpContext.options.headers instanceof node_fetch_1.Headers) {
            httpContext.options.headers.set(name, value);
        }
        else {
            httpContext.options.headers = Object.assign({}, httpContext.options.headers, { [name]: value });
        }
    }
    async getAuthToken(httpContext) {
        if (!httpContext.authToken) {
            httpContext.authToken = await this.ahoiClientTokenService.authenticate();
        }
        return httpContext.authToken;
    }
    async getBankingToken(httpContext) {
        if (!httpContext.bankingToken) {
            if (!httpContext.installationid) {
                throw ('Can not get banking token without installationId.');
            }
            console_1.debug('fetch banking token');
            httpContext.bankingToken = await this.ahoiBankingTokenService.authenticate(httpContext.installationid);
            console_1.debug('token is %o', httpContext.bankingToken);
        }
        return httpContext.bankingToken;
    }
    async getToken(httpContext) {
        return httpContext.installationid ? this.getBankingToken(httpContext) : this.getAuthToken(httpContext);
    }
}
exports.AbstractHttpFilter = AbstractHttpFilter;
