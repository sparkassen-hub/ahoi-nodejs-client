import { AhoiPublicKeyService } from '../auth/ahoipublickey';
export declare class AhoiSessionKeyHeaderService {
    private ahoiPublicKeyService;
    static readonly SESSIONKEY_HEADER_NAME = "X-Ahoi-Session-Security";
    constructor(ahoiPublicKeyService: AhoiPublicKeyService);
    getHeader(sessionKey?: string): Promise<string>;
    generateSessionKey(): Promise<string>;
    private encryptSessionKey;
    private createSessionKeyHeader;
}
