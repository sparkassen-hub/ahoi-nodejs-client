import { Token } from '../auth/token';
import { BasicCache } from '../lib/cache/basiccache';
export declare class TokenCache extends BasicCache<Token> {
    private static readonly CLEAN_INTERVAL;
    static readonly MAX_ENTRIES = 100000;
    constructor(maxEntries?: number, cleanInterval?: number);
    private static cleanCache;
}
