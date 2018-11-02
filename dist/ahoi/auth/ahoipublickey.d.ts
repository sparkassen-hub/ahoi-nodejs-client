import { RegistrationPublicKey } from 'ahoi-swagger-fetchclient';
import { FetchHttpFactory } from '../httpclient/fetchhttpfactory';
export declare class AhoiPublicKeyService {
    private readonly httpClientFactory;
    static readonly PUBLIC_KEY_URI: string;
    private static readonly headers;
    private publicKey;
    private readonly uri;
    constructor(httpClientFactory: FetchHttpFactory, baseUrl: string);
    getPublicKey(): Promise<RegistrationPublicKey>;
    private isExpired;
}
