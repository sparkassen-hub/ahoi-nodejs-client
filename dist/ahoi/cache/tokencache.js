"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basiccache_1 = require("../lib/cache/basiccache");
class TokenCache extends basiccache_1.BasicCache {
    constructor(maxEntries = TokenCache.MAX_ENTRIES, cleanInterval = TokenCache.CLEAN_INTERVAL) {
        super(maxEntries, TokenCache.cleanCache(), cleanInterval);
    }
    static cleanCache() {
        return (token) => {
            return token.isExpired();
        };
    }
}
TokenCache.CLEAN_INTERVAL = 1000 * 60 * 30; // 30 min.
TokenCache.MAX_ENTRIES = 100000;
exports.TokenCache = TokenCache;
