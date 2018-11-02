
/**
 * Configuration data that is needed to access the AHOI API. To get the access data for the AHOI API
 * (clientId, clientSecret, appSecretIv, appSecretKey) you have to create an account before, e.g. at
 * AHOI sandbox to test the API ({@link https://banking-sandbox.starfinanz.de/sandboxmanager/}).<br/>
 * appSecretIv and appSecretKey must only be given, if sensitive data like bank access PIN must be
 * encrypted before sending a request to AHOI. Usually connections between application server and
 * AHOI are secured using client certificate (handed over to AHOI before so AHOI can verify the
 * request is from a known server) and SSL secured connection to AHOI server. If AHOI does not have
 * a client certificate from your application server, encryption must be activated. This can be done
 * in your AHOI (sandbox) account.<br/>
 * The security guidelines from AHOI require that every installationid must be stored e.g. in a
 * database encrypted to ensure, they can't be used in case they are lost or stolen (e.g. your
 * server have been hacked). If you set an cryptKey in cofiguration, all installationid's will be
 * automatically encrypt so you do not have to deal with that. It is recommended, to use this
 * feature.
 *
 *
 * @export
 * @interface AhoiConfig
 */
export interface AhoiConfig {
  clientId: string;
  clientSecret: string;
  appSecretIv?: string;
  appSecretKey?: string;
  baseurl: string;
  cryptKey?: string;
}
