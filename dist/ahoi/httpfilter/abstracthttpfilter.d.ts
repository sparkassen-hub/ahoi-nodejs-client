import { AhoiBankingTokenService } from '../auth/bankingtokenauth';
import { AhoiClientTokenService } from '../auth/clienttokenauth';
import { Token } from '../auth/token';
import { HttpContext, HttpFilter } from '../lib/httpfilter/httpfilter';
export declare abstract class AbstractHttpFilter implements HttpFilter {
    protected ahoiClientTokenService: AhoiClientTokenService;
    protected ahoiBankingTokenService: AhoiBankingTokenService;
    constructor(ahoiClientTokenService: AhoiClientTokenService, ahoiBankingTokenService: AhoiBankingTokenService);
    matches(httpContext: HttpContext): Promise<boolean>;
    doFilter(httpContext: HttpContext): Promise<void>;
    protected filterRequest(httpContext: HttpContext): Promise<void>;
    protected filterResponse(httpContext: HttpContext): Promise<any>;
    protected usesMethod(httpContext: HttpContext, method: string): boolean;
    protected getResponse<T>(httpContext: HttpContext): Promise<T>;
    protected setHeader(httpContext: HttpContext, name: string, value: any): void;
    protected getAuthToken(httpContext: HttpContext): Promise<Token>;
    protected getBankingToken(httpContext: HttpContext): Promise<Token>;
    protected getToken(httpContext: HttpContext): Promise<Token>;
}
