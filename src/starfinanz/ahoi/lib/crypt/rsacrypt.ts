import * as constants from 'constants';
import * as crypto from 'crypto';

import { Base64Util } from './base64util';

export class RSACrypt {

  private static readonly PEM_KEY_START = '-----BEGIN PUBLIC KEY-----';
  private static readonly PEM_KEY_END = '-----END PUBLIC KEY-----';

  // Class has only static methods, instantiation should not be possible
  private constructor() {}

  public static encryptWithRsaPublicKey(text: string,
                                        key: string,
                                        padding: number = constants.RSA_PKCS1_OAEP_PADDING): string {
    const pemKey = key.startsWith(RSACrypt.PEM_KEY_START) ? key : RSACrypt.keyToPEMKey(key);
    return Base64Util.urlSafeBase64Encode(
      crypto.publicEncrypt({ padding, key: pemKey }, Buffer.from(text, 'base64')),
    );
  }

  public static keyToPEMKey(key: string): string {
    const splitted = (Base64Util.urlSafeBase64ToBase64(key || '').match(/.{1,64}/g));
    if (splitted) {
      return `${RSACrypt.PEM_KEY_START}\n${splitted.join('\n')}\n${this.PEM_KEY_END}`;
    }
    throw new Error('Unable to convert public key into PEM key. \
                        Given public key is null or too short.');
  }

}
