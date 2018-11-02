"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class CryptUtil {
    constructor() { }
    static async createRandomKey(keyLen = 32) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(keyLen, (err, buf) => {
                if (err || !buf) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(buf.toString('base64'));
                }
            });
        });
    }
    static generateNonce(length = 32) {
        return [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    }
}
exports.CryptUtil = CryptUtil;
