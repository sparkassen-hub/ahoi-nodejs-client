"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base64Util {
    static urlSafeBase64ToBase64(text) {
        return text.replace(/-/g, '+').replace(/_/g, '/');
    }
    static base64ToUrlSafeBase64(text) {
        return text.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    static urlSafeBase64Encode(text) {
        let base64Text;
        if (text instanceof Buffer) {
            base64Text = text.toString('base64');
        }
        else {
            base64Text = Buffer.from(text).toString('base64');
        }
        return Base64Util.base64ToUrlSafeBase64(base64Text);
    }
    static urlSafeBase64Decode(text) {
        if (!text) {
            return Buffer.alloc(0);
        }
        return Buffer.from(Base64Util.urlSafeBase64ToBase64(text), 'base64');
    }
}
exports.Base64Util = Base64Util;
