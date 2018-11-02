import { AhoiBankingTokenService } from './auth/bankingtokenauth';
import { AhoiClientTokenService } from './auth/clienttokenauth';
import { Token } from './auth/token';
import { InstallationIdCryptService } from './cryptservice/installationidcryptservice';
export declare class AhoiHelper {
    private installationIdCryptService;
    private ahoiClientTokenService;
    private ahoiBankingTokenService;
    constructor(installationIdCryptService: InstallationIdCryptService, ahoiClientTokenService: AhoiClientTokenService, ahoiBankingTokenService: AhoiBankingTokenService);
    encryptInstallationId(installationId: string): Promise<string>;
    decryptInstallationId(encryptedInstallationId: string): string;
    getBankingToken(installationId: string): Promise<Token>;
    getClientAuthToken(): Promise<Token>;
}
