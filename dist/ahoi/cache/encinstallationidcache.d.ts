import { BasicCache } from '../lib/cache/basiccache';
export declare class EncInstallationIdCache extends BasicCache<string> {
    static readonly DECRYPTED_INSTALLATIONID_CACHE_SIZE = 1000;
    constructor();
}
