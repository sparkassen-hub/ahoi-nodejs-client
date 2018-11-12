import { debug } from 'console';

import { Headers } from 'node-fetch';

import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { Token } from '../auth/token';
import { HttpContext, HttpFilter } from '../lib/httpfilter/httpfilter';

export abstract class AbstractHttpFilter implements HttpFilter {

  constructor(protected ahoiClientTokenService: AhoiClientTokenService,
              protected ahoiBankingTokenService: AhoiBankingTokenService) { }

  public async matches(httpContext: HttpContext): Promise<boolean> {
    return false;
  }

  public async doFilter(httpContext: HttpContext): Promise<void> {
    if (httpContext.isrequest) {
      debug('doFilter %s', httpContext.url);
      await this.filterRequest(httpContext);
    } else {
      if (httpContext.response.status >= 200 && httpContext.response.status < 300) {
        const responseData = await this.filterResponse(httpContext);
        if (responseData) {
          httpContext.response.json = async () => {
            return responseData;
          };
        }
      }
    }
  }

  protected async filterRequest(httpContext: HttpContext): Promise<void> { }

  protected async filterResponse(httpContext: HttpContext): Promise<any> { return null; }

  protected usesMethod(httpContext: HttpContext, method: string): boolean {
    if (httpContext.options.method && method) {
      return httpContext.options.method.toLowerCase() === method.toLowerCase();
    }
    return false;
  }

  protected async getResponse<T>(httpContext: HttpContext): Promise<T> {
    const responseData = await httpContext.response.json();
    return responseData as T;
  }

  protected setHeader(httpContext: HttpContext, name: string, value: any): void {
    if (httpContext.options.headers instanceof Headers) {
      httpContext.options.headers.set(name, value);
    } else {
      httpContext.options.headers = { ...httpContext.options.headers, [name]: value };
    }
  }

  protected async getAuthToken(httpContext: HttpContext): Promise<Token> {
    if (!httpContext.authToken) {
      httpContext.authToken = await this.ahoiClientTokenService.authenticate();
    }
    return httpContext.authToken;
  }

  protected async getBankingToken(httpContext: HttpContext): Promise<Token> {
    if (!httpContext.bankingToken) {
      if (!httpContext.installationid) {
        throw ('Can not get banking token without installationId.');
      }
      debug('fetch banking token');
      httpContext.bankingToken = await this.ahoiBankingTokenService.authenticate(httpContext.installationid);
      debug('token is %o', httpContext.bankingToken);
    }
    return httpContext.bankingToken;
  }

  protected async getToken(httpContext: HttpContext): Promise<Token> {
    return httpContext.installationid ? this.getBankingToken(httpContext) : this.getAuthToken(httpContext);
  }

}
