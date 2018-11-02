export declare class RSACrypt {
    private static readonly PEM_KEY_START;
    private static readonly PEM_KEY_END;
    private constructor();
    static encryptWithRsaPublicKey(text: string, key: string, padding?: number): string;
    static keyToPEMKey(key: string): string;
}
