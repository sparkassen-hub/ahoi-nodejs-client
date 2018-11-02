
export class Base64Util {

  public static urlSafeBase64ToBase64(text: string): string {
    return text.replace(/-/g, '+').replace(/_/g, '/');
  }

  public static base64ToUrlSafeBase64(text: string): string {
    return text.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  public static urlSafeBase64Encode(text: string | Buffer): string {
    let base64Text: string;
    if (text instanceof Buffer) {
      base64Text = text.toString('base64');
    } else {
      base64Text = Buffer.from(text).toString('base64');
    }
    return Base64Util.base64ToUrlSafeBase64(base64Text);
  }

  public static urlSafeBase64Decode(text: string): Buffer {
    if (!text) {
      return Buffer.alloc(0);
    }
    return Buffer.from(Base64Util.urlSafeBase64ToBase64(text), 'base64');
  }
}
