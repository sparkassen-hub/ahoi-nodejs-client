import { Token } from '../auth/token';
import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';

export class AuthHeaderFilter extends AbstractHttpFilter {

  public async matches(httpContext: HttpContext): Promise<boolean> {
    // add bearer token from client authentication or user authentication (banking token) to all
    // requests
    return httpContext.isrequest;
  }

  /**
   * Set the OAuth 2 authentication header (Bearer token). Depepending on called endpoint, the
   * client auth token or the banking token will be set.
   *
   * @protected
   * @param {HttpContext} httpContext
   * @returns {Promise<void>}
   * @memberof AuthHeaderFilter
   */
  protected async filterRequest(httpContext: HttpContext): Promise<void> {
    // FIXME: registration update (PUT) -> client or banking token?
    let bearerToken: Token;
    if (httpContext.url.endsWith('/registration') && this.usesMethod(httpContext, 'POST')
      || httpContext.url.endsWith('/registration/keys')) {
      bearerToken = await this.getAuthToken(httpContext);
    } else {
      bearerToken = await this.getBankingToken(httpContext);
    }
    this.setHeader(httpContext, 'Authorization', `Bearer ${bearerToken.getAccessToken()}`);
    // debug(httpContext.options.headers);
  }

}
