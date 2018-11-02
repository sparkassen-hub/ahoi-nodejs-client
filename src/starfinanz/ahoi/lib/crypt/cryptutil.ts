import * as crypto from 'crypto';

export class CryptUtil {

  private constructor() { }

  public static async createRandomKey(keyLen: 16 | 24 | 32 = 32): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.randomBytes(keyLen, (err: Error | null, buf: Buffer) => {
        if (err || !buf) {
          console.log(err);
          reject(err);
        } else {
          resolve(buf.toString('base64'));
        }
      });
    });
  }

  public static generateNonce(length: number = 32) {
    return [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
  }

}
