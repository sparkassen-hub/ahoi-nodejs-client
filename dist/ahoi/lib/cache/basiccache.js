"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const crypto = require("crypto");
class BasicCache {
    constructor(maxEntries, tidyFunction, cleanInterval = 1000 * 60 * 30) {
        this.maxEntries = maxEntries;
        this.cacheMap = new Map();
        if (tidyFunction) {
            this.startCleanerJob(tidyFunction, cleanInterval);
        }
    }
    set(key, value) {
        this.cacheMap.set(this.hashKey(key), value);
        this.ensureCapacity();
    }
    get(key) {
        const hashedKey = this.hashKey(key);
        const value = this.cacheMap.get(hashedKey);
        // Move value to last position to ensure, never or rarely used items are at the top of the list.
        // If cache size exceeds, values are deletet from top to bottom. So rarely used items will be
        // deleted first.
        if (value) {
            this.cacheMap.delete(hashedKey);
            this.cacheMap.set(hashedKey, value);
        }
        return value;
    }
    hashKey(key) {
        return key.length < 20 ? key : crypto.createHash('sha1').update(key).digest('base64');
    }
    // remove oldest cache value if cache size exceeds
    ensureCapacity() {
        if (this.cacheMap.size > this.maxEntries) {
            // delete first item
            for (const [key, value] of this.cacheMap) {
                this.cacheMap.delete(key);
                break;
            }
        }
    }
    startCleanerJob(tidyFunction, cleanInterval) {
        if (tidyFunction.length === 2) {
            setInterval(() => { tidyFunction.call(this.cacheMap); }, cleanInterval);
        }
        else {
            setInterval(() => { this.cleanCache(tidyFunction); }, cleanInterval);
        }
    }
    cleanCache(tidyFunction) {
        for (const [key, value] of this.cacheMap.entries()) {
            if (value) {
                const shouldRemoved = tidyFunction.apply(null, [value]);
                if (shouldRemoved) {
                    console_1.debug('Remove item %s from cache', value);
                    this.cacheMap.delete(key);
                }
            }
        }
    }
}
exports.BasicCache = BasicCache;
