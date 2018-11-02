import { Token } from '../auth/token';
import { BasicCache, SimpleCacheCleaner } from '../lib/cache/basiccache';

export class TokenCache extends BasicCache<Token> {

  private static readonly CLEAN_INTERVAL: number = 1000 * 60 * 30; // 30 min.
  public static readonly MAX_ENTRIES = 100000;

  constructor(maxEntries = TokenCache.MAX_ENTRIES,
              cleanInterval: number = TokenCache.CLEAN_INTERVAL) {
    super(maxEntries, TokenCache.cleanCache(), cleanInterval);
  }

  private static cleanCache(): SimpleCacheCleaner<Token> {
    return (token: Token) => {
      return token.isExpired();
    };
  }

}
