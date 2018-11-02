import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';

export class HttpRequestTimeoutFilter extends AbstractHttpFilter {

  public async matches(httpContext: HttpContext): Promise<boolean> {
    // set timeout header if granting new bank access
    return httpContext.url.endsWith('/accesses') && this.usesMethod(httpContext, 'POST');
  }

  protected async filterRequest(httpContext: HttpContext): Promise<void> {
    // currently granting bank access in AHOI is an synchronous process that can take some time
    // to complete as all account data will be fetched from the banking provider
    httpContext.options.timeout = 60000; // 60 sec
  }

}
