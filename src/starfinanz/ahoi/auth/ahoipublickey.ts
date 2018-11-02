import { error } from 'console';

import { FetchAPI, RegistrationPublicKey } from 'ahoi-swagger-fetchclient';
import { FetchError, Headers, RequestInit } from 'node-fetch';

import { FetchHttpFactory } from '../httpclient/fetchhttpfactory';

export class AhoiPublicKeyService {

  public static readonly PUBLIC_KEY_URI: string = '/registration/keys';
  private static readonly headers: Headers = new Headers({
    accept: 'application/json',
    'content-type': 'application/json;charset=UTF-8',
  });

  private publicKey!: RegistrationPublicKey;
  private readonly uri: string;

  constructor(private readonly httpClientFactory: FetchHttpFactory, baseUrl: string) {
    this.uri = `${baseUrl}${AhoiPublicKeyService.PUBLIC_KEY_URI}`;
  }

  public async getPublicKey(): Promise<RegistrationPublicKey> {
    if (this.publicKey && !this.isExpired(this.publicKey)) {
      return this.publicKey;
    }

    const options: RequestInit = {
      headers: AhoiPublicKeyService.headers,
      method: 'GET',
      timeout: 5000, // 5 sec,
      compress: true,
    };

    try {
      const httpClient: FetchAPI = this.httpClientFactory.getHttpClient();
      const response = await httpClient(this.uri, options);
      if (response.ok) {
        const regPublicKey: RegistrationPublicKey = await response.json();
        this.publicKey = regPublicKey;
        return regPublicKey;
      }
      const errorMsg = await response.text();
      throw new FetchError(errorMsg, 'pubkey-error', '');
    } catch (err) {
      error(err);
      throw err instanceof Error ? err : new Error(err);
    }
  }

  private isExpired(key: RegistrationPublicKey): boolean {
    // add 1 min. as buffer to be safe if connection is slow
    return new Date(key.validUntil).getTime() + 60 * 1000 < new Date().getTime();
  }

}
