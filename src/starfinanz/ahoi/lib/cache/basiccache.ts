import { debug } from 'console';
import * as crypto from 'crypto';

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

export abstract class BasicCache<T> {

  private cacheMap: Map<string, T>;

  constructor(protected maxEntries: number,
              tidyFunction?: CacheCleaner<T> | SimpleCacheCleaner<T>,
              cleanInterval: number = 1000 * 60 * 30) {
    this.cacheMap = new Map<string, T>();
    if (tidyFunction) {
      this.startCleanerJob(tidyFunction, cleanInterval);
    }
  }

  public set(key: string, value: T) : void {
    this.cacheMap.set(this.hashKey(key), value);
    this.ensureCapacity();
  }

  public get(key: string) : T | undefined {
    const hashedKey = this.hashKey(key);
    const value: T | undefined = this.cacheMap.get(hashedKey);
    // Move value to last position to ensure, never or rarely used items are at the top of the list.
    // If cache size exceeds, values are deletet from top to bottom. So rarely used items will be
    // deleted first.
    if (value) {
      this.cacheMap.delete(hashedKey);
      this.cacheMap.set(hashedKey, value);
    }
    return value;
  }

  private hashKey(key: string): string {
    return key.length < 20 ? key : crypto.createHash('sha1').update(key).digest('base64');
  }

  // remove oldest cache value if cache size exceeds
  private ensureCapacity(): void {
    if (this.cacheMap.size > this.maxEntries) {
      // delete first item
      for (const [key, value] of this.cacheMap) {
        this.cacheMap.delete(key);
        break;
      }
    }
  }

  private startCleanerJob(tidyFunction: CacheCleaner<T> | SimpleCacheCleaner<T>,
                          cleanInterval: number): void {
    if (tidyFunction.length === 2) {
      setInterval(() => { tidyFunction.call(this.cacheMap); }, cleanInterval);
    } else {
      setInterval(() => { this.cleanCache(tidyFunction as SimpleCacheCleaner<T>); }, cleanInterval);
    }
  }

  private cleanCache(tidyFunction: SimpleCacheCleaner<T>): void {
    for (const [key, value] of this.cacheMap.entries()) {
      if (value) {
        const shouldRemoved = tidyFunction.apply(null, [value]);
        if (shouldRemoved) {
          debug('Remove item %s from cache', value);
          this.cacheMap.delete(key);
        }
      }
    }
  }

}
