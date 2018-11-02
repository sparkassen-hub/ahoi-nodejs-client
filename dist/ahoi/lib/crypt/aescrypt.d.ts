/// <reference types="node" />
export declare enum Cipher {
    AES_CBC = "aes-${strength}-cbc",
    AES_CTR = "aes-${strength}-ctr",
    DEFAULT = "aes-256-cbc"
}
export declare class AESCrypt {
    private static readonly IV_LENGTH;
    private static readonly DEFAULT_IV;
    private constructor();
    static encryptRandomIV(text: string, cryptkey: string | Buffer, cipher?: Cipher): Promise<string>;
    /**
     * Encrypts a string using AES.
     *
     * @param {string} text
     * @param {(string | Buffer)} cryptkey
     * @param {string} [cipher=Cipher.AES_CTR]
     * @param {(string | Buffer)} [iv=AESCrypt.DEFAULT_IV]  A {@link Buffer} or an base64 encrypted string
     * @param {boolean} [addIV=false]
     * @returns {Promise<string>}
     * @memberof AESCrypt
     */
    static encrypt(text: string, cryptkey: string | Buffer, cipher?: Cipher, iv?: string | Buffer, addIV?: boolean): Promise<string>;
    static decryptRandomIV(enctext: string, cryptkey: string | Buffer, cipher?: Cipher): string;
    /**
     * Decrypts an AES encrypted text
     *
     * @param {string} enctext
     * @param {string} [cipher=AESCrypt.AHOI_DEFAULT_CIPHER]
     * @returns {Promise<string>}
     * @memberof AESCrypt
     */
    static decrypt(enctext: string, cryptkey: string | Buffer, cipher?: Cipher, containsIV?: boolean, iv?: string | Buffer): string;
    private static keyToBuffer;
    private static iVToBuffer;
    /**
     * Get the AES encryption strength. For AES encryption allowed are only key with length 128, 192
     * or 256 bit.<br/>
     * Note: it would be more secure to throw an exception if key length does not match these
     * restrictions. On the other hand it is more user friendly to allow keys too, that do not match.
     * In this case other keys are allowed and padded or stripped to 256 bit.
     *
     * @private
     * @param {(string | Buffer)} key
     * @returns {number}
     * @memberof AESCrypt
     */
    private static getEncryptionStrength;
}
