import { RequestInit } from 'node-fetch';
import { Token } from '../../auth/token';
export interface HttpFilter {
    matches(httpContext: HttpContext): Promise<boolean>;
    doFilter(httpContext: HttpContext): Promise<void>;
}
export interface HttpContext {
    url: string;
    options: RequestInit;
    isrequest: boolean;
    data: Map<string, any>;
    installationid?: string;
    response?: any;
    authToken?: Token;
    bankingToken?: Token;
}
