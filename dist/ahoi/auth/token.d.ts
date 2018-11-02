export declare class Token {
    static readonly ASSUMED_MAX_REQUEST_TIME: number;
    static readonly JWT_PROP_ENCRYPTION_DISABLED: string;
    private static readonly EMPTY_TOKEN;
    private tokendata;
    constructor(accesstoken: string);
    getAccessToken(): string;
    getClientId(): string;
    getContextId(): string;
    getJti(): string;
    getExpiration(): number;
    getPayload(): any;
    getHeader(): any;
    useEncryption(): boolean;
    isExpired(assumedRequestTime?: number): boolean;
    private decode;
}
