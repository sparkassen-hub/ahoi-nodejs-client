"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basiccache_1 = require("../lib/cache/basiccache");
class EncInstallationIdCache extends basiccache_1.BasicCache {
    constructor() {
        super(EncInstallationIdCache.DECRYPTED_INSTALLATIONID_CACHE_SIZE);
    }
}
EncInstallationIdCache.DECRYPTED_INSTALLATIONID_CACHE_SIZE = 1000;
exports.EncInstallationIdCache = EncInstallationIdCache;
