/// <reference types="node" />
export declare class Base64Util {
    static urlSafeBase64ToBase64(text: string): string;
    static base64ToUrlSafeBase64(text: string): string;
    static urlSafeBase64Encode(text: string | Buffer): string;
    static urlSafeBase64Decode(text: string): Buffer;
}
