export declare class CryptUtil {
    private constructor();
    static createRandomKey(keyLen?: 16 | 24 | 32): Promise<string>;
    static generateNonce(length?: number): string;
}
