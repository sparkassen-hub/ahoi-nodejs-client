"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstracthttpfilter_1 = require("./abstracthttpfilter");
class HttpRequestTimeoutFilter extends abstracthttpfilter_1.AbstractHttpFilter {
    async matches(httpContext) {
        // set timeout header if granting new bank access
        return httpContext.url.endsWith('/accesses') && this.usesMethod(httpContext, 'POST');
    }
    async filterRequest(httpContext) {
        // currently granting bank access in AHOI is an synchronous process that can take some time
        // to complete as all account data will be fetched from the banking provider
        httpContext.options.timeout = 60000; // 60 sec
    }
}
exports.HttpRequestTimeoutFilter = HttpRequestTimeoutFilter;
