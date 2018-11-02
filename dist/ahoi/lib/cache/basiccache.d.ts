import { CacheCleaner } from './basiccache';
export interface CacheCleaner<T> {
    (cacheMap: Map<string, T>): void;
}
/**
 * Simple function used to clean cache value for value. Function should return true, if value should
 * removed from cache.<br/><br/>
 * Example implementation:
 * ```typescript
 * private static cleanCache(): SimpleCacheCleaner<Mytype> {
 *   return (value: Mytype) => {
 *     return new Date().getTime() - value.age > 10000;
 *   };
 * }
 * ```
 *
 * @export
 * @interface SimpleCacheCleaner
 * @template T
 */
export interface SimpleCacheCleaner<T> {
    (value: T): boolean;
}
export declare abstract class BasicCache<T> {
    protected maxEntries: number;
    private cacheMap;
    constructor(maxEntries: number, tidyFunction?: CacheCleaner<T> | SimpleCacheCleaner<T>, cleanInterval?: number);
    set(key: string, value: T): void;
    get(key: string): T | undefined;
    private hashKey;
    private ensureCapacity;
    private startCleanerJob;
    private cleanCache;
}
