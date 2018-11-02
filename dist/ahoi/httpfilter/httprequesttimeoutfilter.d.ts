import { HttpContext } from '../lib/httpfilter/httpfilter';
import { AbstractHttpFilter } from './abstracthttpfilter';
export declare class HttpRequestTimeoutFilter extends AbstractHttpFilter {
    matches(httpContext: HttpContext): Promise<boolean>;
    protected filterRequest(httpContext: HttpContext): Promise<void>;
}
