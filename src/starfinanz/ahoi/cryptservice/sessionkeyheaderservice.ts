import { RegistrationPublicKey } from 'ahoi-swagger-fetchclient';

import { AhoiPublicKeyService } from '../auth/ahoipublickey';
import { Base64Util } from '../lib/crypt/base64util';
import { CryptUtil } from '../lib/crypt/cryptutil';
import { RSACrypt } from '../lib/crypt/rsacrypt';

export class AhoiSessionKeyHeaderService {

  public static readonly SESSIONKEY_HEADER_NAME = 'X-Ahoi-Session-Security';

  constructor(private ahoiPublicKeyService: AhoiPublicKeyService) { }

  public async getHeader(sessionKey?: string): Promise<string> {
    const publicKey: RegistrationPublicKey = await this.ahoiPublicKeyService.getPublicKey();
    const useSessionKey = sessionKey ? sessionKey : await this.generateSessionKey();
    const encryptedSessionKey: string = this.encryptSessionKey(useSessionKey, publicKey);
    return this.createSessionKeyHeader(publicKey, encryptedSessionKey);
  }

  public async generateSessionKey(): Promise<string> {
    // 32 byte random string that is used to encrypt the installationid using AES 256 CBC
    return CryptUtil.createRandomKey(32);
  }

  private encryptSessionKey(sessionKey: string, publicAhoiKey: RegistrationPublicKey): string {
    const pubKey = publicAhoiKey.publicKey.value;
    return RSACrypt.encryptWithRsaPublicKey(sessionKey, pubKey);
  }

  private createSessionKeyHeader(publicKey: RegistrationPublicKey,
                                 encryptedSessionKey: string): string {
    const sessionSecHeader = JSON.stringify({
      publicKeyId: publicKey.keyId,
      sessionKey: encryptedSessionKey,
      keySpecification: 'AES', // AES/CBC/PKCS5Padding, SHA-256
    });
    return Base64Util.urlSafeBase64Encode(sessionSecHeader);
  }

}
