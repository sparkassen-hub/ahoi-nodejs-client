import { BasicCache } from '../lib/cache/basiccache';

export class EncInstallationIdCache extends BasicCache<string> {

  public static readonly DECRYPTED_INSTALLATIONID_CACHE_SIZE = 1000;

  constructor() {
    super(EncInstallationIdCache.DECRYPTED_INSTALLATIONID_CACHE_SIZE);
  }

}
