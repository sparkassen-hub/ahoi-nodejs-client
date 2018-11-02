import * as jwt from 'jsonwebtoken';

interface TokenData {
  readonly accesstoken: string;
  readonly clientid: string;
  readonly contextid: string;
  readonly jti: string;
  readonly scope: string[];
  readonly expires: number;
  readonly payload: any;
  readonly header: any;
}

export class Token {

  public static readonly ASSUMED_MAX_REQUEST_TIME: number = 10; // seconds
  public static readonly JWT_PROP_ENCRYPTION_DISABLED: string = 'ENC_DIS';

  private static readonly EMPTY_TOKEN: TokenData = {
    accesstoken: '',
    clientid: '',
    contextid: '',
    jti: '',
    scope: [],
    expires: 0,
    payload: {},
    header: {},
  };

  private tokendata: TokenData;

  constructor(accesstoken: string) {
    this.tokendata = this.decode(accesstoken);
  }

  public getAccessToken(): string {
    return this.tokendata.accesstoken;
  }

  public getClientId(): string {
    return this.tokendata.clientid;
  }

  public getContextId(): string {
    return this.tokendata.contextid;
  }

  public getJti(): string {
    return this.tokendata.jti;
  }

  public getExpiration(): number {
    return this.tokendata.expires;
  }

  public getPayload(): any {
    return this.tokendata.payload;
  }

  public getHeader(): any {
    return this.tokendata.header;
  }

  public useEncryption(): boolean {
    return !this.tokendata.scope.includes(Token.JWT_PROP_ENCRYPTION_DISABLED);
  }

  public isExpired(assumedRequestTime: number = Token.ASSUMED_MAX_REQUEST_TIME): boolean {
    return this.getExpiration() - assumedRequestTime < Date.now() / 1000;
  }

  private decode(accesstoken: string): TokenData {
    if (!accesstoken) {
      return Token.EMPTY_TOKEN;
    }
    const decoded: any = jwt.decode(accesstoken, { complete: true });
    return {
      accesstoken,
      clientid: decoded.payload.client_id,
      contextid: decoded.payload['CONTEXT_ID'] ? decoded.payload.CONTEXT_ID : '',
      jti: decoded.payload.jti,
      scope: decoded.payload.scope,
      expires: decoded.payload.exp,
      payload: decoded.payload,
      header: decoded.header,
    };
  }

}
