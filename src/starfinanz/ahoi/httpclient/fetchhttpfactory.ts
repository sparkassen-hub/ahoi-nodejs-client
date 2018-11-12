import { debug, error } from 'console';

import { FetchAPI } from 'ahoi-swagger-fetchclient';
import nodeFetch, { FetchError, RequestInit, Response } from 'node-fetch';

import { Token } from '../auth/token';
import { HttpContext, HttpFilter } from '../lib/httpfilter/httpfilter';

/**
 * This class provides an fetch http client to send requests the AHOI API. Request parameter, header
 * and data and the response from AHOI can be changed using filters {@link FetchHttpFilter}.
 *
 * @export
 * @class FetchHttpFactory
 */
export class FetchHttpFactory {

  private httpRequestFilters: HttpFilter[] = [];
  // same as request filters but in reverse order
  private httpResponseFilters: HttpFilter[] = [];

  constructor() { }

  /**
   * Set http filters that will be applied to every request and response. The filters will be called
   * in given order for requests and in reverse order for responses.
   *
   * @param {HttpFilter[]} httpFilters
   * @memberof FetchHttpFactory
   */
  public setHttpFilter(httpFilters: HttpFilter[]): void {
    this.httpRequestFilters = [...httpFilters];
    this.httpResponseFilters = [...httpFilters].reverse();
  }

  /**
   * The generated AHOI API client takes as initialization parameters a configuration, a baseurl and
   * an httpclient {FetchAPI}. This method returns a function as an implementation of the FetchAPI
   * that allows to change request to the AHOI API and the response using filters
   * {@link FetchHttpFilter}.
   *
   * @param {string} [installationId='']
   * @returns {FetchAPI}
   * @memberof FetchHttpFactory
   */
  public getHttpClient(installationId?: string, bankingToken?: string): FetchAPI {
    return async (url: string,
                  options: RequestInit,
                  installationid: string | undefined = installationId,
                  bankingtoken: string | undefined = bankingToken): Promise<any> => {

      const httpContext: HttpContext = {
        url,
        installationid,
        // default http options: timeout 5 sec and use compression if available
        options: { compress: true, timeout: 5000, ...options },
        data: new Map<string, any>(),
        isrequest: true,
        bankingToken: bankingtoken ? new Token(bankingtoken) : undefined,
      };

      debug('get http client for %s', httpContext.url);
      return this.applyFilterAndExecuteRequest(httpContext);
    };
  }

  private async applyFilterAndExecuteRequest(httpContext: HttpContext): Promise<Response> {
    // apply request filters, e.g. to set authentication header (Bearer token) or encrypted
    // session key and encrypted installationid if encryption is needed
    debug('apply filters request for %s', httpContext.url);

    await this.applyFilters(httpContext, this.httpRequestFilters);

    debug(httpContext.options);
    try {
      // execute request using fetch http client
      const response: Response = await nodeFetch(httpContext.url, httpContext.options);
      if (response.ok) {
        httpContext.response = response;
      } else {
        const errorMsg = await response.text();
        throw new FetchError(errorMsg, 'ahoi-api-error', '');
      }
    } catch (err) {
      error(err);
      throw err instanceof Error ? err : new Error(err);
    }

    // debug(await httpContext.response.json());

    // apply response filters (same as for request) e.g. to decrypt encrypted installationid
    debug('Apply filters response for %s', httpContext.url);
    await this.applyFilters({ ...httpContext, isrequest: false }, this.httpResponseFilters);
    return httpContext.response;
  }

  private async applyFilters(httpContext: HttpContext, httpFilters: HttpFilter[]): Promise<void> {
    debug('Context is %s', httpContext.isrequest ? 'request' : 'response');
    for await (const filter of httpFilters) {
      debug('Apply filter %s for %s', filter.constructor.name, httpContext.url);
      if (await filter.matches(httpContext)) {
        debug('Before do filter %s for url %s', filter.constructor.name, httpContext.url);
        await filter.doFilter(httpContext);
        debug('After do filter %s for url %s', filter.constructor.name, httpContext.url);
      }
    }
  }

}
