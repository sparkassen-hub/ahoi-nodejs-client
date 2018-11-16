import { error } from 'console';

import nodeFetch, { FetchError, Headers, RequestInit, Response } from 'node-fetch';

import { AhoiConfig } from '../config/ahoiconfig';
import { Token } from './token';

export abstract class AbstractAhoiAuthenticationService {

  public static readonly AUTH_URI: string = '/auth/v1/oauth/token';
  public static readonly AUTH_CREDENTIALS_PARAMETER = 'grant_type=client_credentials';

  protected readonly uri: string;

  constructor(protected config: AhoiConfig, baseUrl: string) {
    // tslint:disable-next-line:max-line-length
    this.uri = `${baseUrl}${AbstractAhoiAuthenticationService.AUTH_URI}?${AbstractAhoiAuthenticationService.AUTH_CREDENTIALS_PARAMETER}`;
  }

  protected async callAhoiOAuthServer(headerMap?: Map<string, string>): Promise<Token> {
    const headers: Headers = this.createAuthHeaders(headerMap);
    const options: RequestInit = {
      headers,
      method: 'POST',
      timeout: 10000, // 10 sec,
      compress: true,
    };

    try {
      const response: Response = await nodeFetch(this.uri, options);
      if (response.ok) {
        const token: any = await response.json();
        return new Token(token.access_token);
      }
      const errorMsg = await response.text();
      throw new FetchError(errorMsg, 'auth-error', '');
    } catch (err) {
      error(err);
      throw err instanceof Error ? err : new Error(err);
    }
  }

  private mergeHeaders(headers: Headers, headerMap?: Map<string, string>): void {
    if (headerMap) {
      for (const [key, value] of headerMap) {
        headers.set(key, value);
      }
    }
  }

  private createAuthHeaders(headerMap?: Map<string, string>): Headers {
    const authHeaders: any = {
      // tslint:disable-next-line:prefer-template
      Authorization: 'Basic ' + Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`)
        .toString('base64'),
      accept: 'application/json',
      'content-type': 'application/json;charset=UTF-8',
    };

    const headers: Headers = new Headers(authHeaders);
    this.mergeHeaders(headers, headerMap);
    return headers;
  }

}
