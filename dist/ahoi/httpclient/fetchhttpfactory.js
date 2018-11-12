"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const node_fetch_1 = require("node-fetch");
const token_1 = require("../auth/token");
/**
 * This class provides an fetch http client to send requests the AHOI API. Request parameter, header
 * and data and the response from AHOI can be changed using filters {@link FetchHttpFilter}.
 *
 * @export
 * @class FetchHttpFactory
 */
class FetchHttpFactory {
    constructor() {
        this.httpRequestFilters = [];
        // same as request filters but in reverse order
        this.httpResponseFilters = [];
    }
    /**
     * Set http filters that will be applied to every request and response. The filters will be called
     * in given order for requests and in reverse order for responses.
     *
     * @param {HttpFilter[]} httpFilters
     * @memberof FetchHttpFactory
     */
    setHttpFilter(httpFilters) {
        this.httpRequestFilters = [...httpFilters];
        this.httpResponseFilters = [...httpFilters].reverse();
    }
    /**
     * The generated AHOI API client takes as initialization parameters a configuration, a baseurl and
     * an httpclient {FetchAPI}. This method returns a function as an implementation of the FetchAPI
     * that allows to change request to the AHOI API and the response using filters
     * {@link FetchHttpFilter}.
     *
     * @param {string} [installationId='']
     * @returns {FetchAPI}
     * @memberof FetchHttpFactory
     */
    getHttpClient(installationId, bankingToken) {
        return async (url, options, installationid = installationId, bankingtoken = bankingToken) => {
            const httpContext = {
                url,
                installationid,
                // default http options: timeout 5 sec and use compression if available
                options: Object.assign({ compress: true, timeout: 5000 }, options),
                data: new Map(),
                isrequest: true,
                bankingToken: bankingtoken ? new token_1.Token(bankingtoken) : undefined,
            };
            console_1.debug('get http client for %s', httpContext.url);
            return this.applyFilterAndExecuteRequest(httpContext);
        };
    }
    async applyFilterAndExecuteRequest(httpContext) {
        // apply request filters, e.g. to set authentication header (Bearer token) or encrypted
        // session key and encrypted installationid if encryption is needed
        console_1.debug('apply filters request for %s', httpContext.url);
        await this.applyFilters(httpContext, this.httpRequestFilters);
        console_1.debug(httpContext.options);
        try {
            // execute request using fetch http client
            const response = await node_fetch_1.default(httpContext.url, httpContext.options);
            if (response.ok) {
                httpContext.response = response;
            }
            else {
                const errorMsg = await response.text();
                throw new node_fetch_1.FetchError(errorMsg, 'ahoi-api-error', '');
            }
        }
        catch (err) {
            console_1.error(err);
            throw err instanceof Error ? err : new Error(err);
        }
        // debug(await httpContext.response.json());
        // apply response filters (same as for request) e.g. to decrypt encrypted installationid
        console_1.debug('Apply filters response for %s', httpContext.url);
        await this.applyFilters(Object.assign({}, httpContext, { isrequest: false }), this.httpResponseFilters);
        return httpContext.response;
    }
    async applyFilters(httpContext, httpFilters) {
        var e_1, _a;
        console_1.debug('Context is %s', httpContext.isrequest ? 'request' : 'response');
        try {
            for (var httpFilters_1 = __asyncValues(httpFilters), httpFilters_1_1; httpFilters_1_1 = await httpFilters_1.next(), !httpFilters_1_1.done;) {
                const filter = httpFilters_1_1.value;
                console_1.debug('Apply filter %s for %s', filter.constructor.name, httpContext.url);
                if (await filter.matches(httpContext)) {
                    console_1.debug('Before do filter %s for url %s', filter.constructor.name, httpContext.url);
                    await filter.doFilter(httpContext);
                    console_1.debug('After do filter %s for url %s', filter.constructor.name, httpContext.url);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (httpFilters_1_1 && !httpFilters_1_1.done && (_a = httpFilters_1.return)) await _a.call(httpFilters_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
exports.FetchHttpFactory = FetchHttpFactory;
