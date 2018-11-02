export { AhoiConfig } from './ahoi/config/ahoiconfig';
export { AhoiApiFactory } from './ahoi/ahoiapifactory';
export { Token } from './ahoi/auth/token';

if (+process.version.substring(1, 3) < 10) {
  (<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}
