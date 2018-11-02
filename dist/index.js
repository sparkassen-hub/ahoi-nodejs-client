"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ahoiapifactory_1 = require("./ahoi/ahoiapifactory");
exports.AhoiApiFactory = ahoiapifactory_1.AhoiApiFactory;
var token_1 = require("./ahoi/auth/token");
exports.Token = token_1.Token;
if (+process.version.substring(1, 3) < 10) {
    Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}
