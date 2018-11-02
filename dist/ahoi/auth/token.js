"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
class Token {
    constructor(accesstoken) {
        this.tokendata = this.decode(accesstoken);
    }
    getAccessToken() {
        return this.tokendata.accesstoken;
    }
    getClientId() {
        return this.tokendata.clientid;
    }
    getContextId() {
        return this.tokendata.contextid;
    }
    getJti() {
        return this.tokendata.jti;
    }
    getExpiration() {
        return this.tokendata.expires;
    }
    getPayload() {
        return this.tokendata.payload;
    }
    getHeader() {
        return this.tokendata.header;
    }
    useEncryption() {
        return !this.tokendata.scope.includes(Token.JWT_PROP_ENCRYPTION_DISABLED);
    }
    isExpired(assumedRequestTime = Token.ASSUMED_MAX_REQUEST_TIME) {
        return this.getExpiration() - assumedRequestTime < Date.now() / 1000;
    }
    decode(accesstoken) {
        if (!accesstoken) {
            return Token.EMPTY_TOKEN;
        }
        const decoded = jwt.decode(accesstoken, { complete: true });
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
Token.ASSUMED_MAX_REQUEST_TIME = 10; // seconds
Token.JWT_PROP_ENCRYPTION_DISABLED = 'ENC_DIS';
Token.EMPTY_TOKEN = {
    accesstoken: '',
    clientid: '',
    contextid: '',
    jti: '',
    scope: [],
    expires: 0,
    payload: {},
    header: {},
};
exports.Token = Token;
