import { AccessApi, AccountApi, CategoryApi, ContractApi, ForecastApi, ProviderApi, RegistrationApi, SecurityApi, TANSchemesApi, TaskApi, TransactionApi, TransactionPatternApi, TransactionSummaryApi, TransferApi } from 'ahoi-swagger-fetchclient';
import { AbstractAhoiApiFactory } from './abstractahoiapifactory';
import { AhoiHelper } from './ahoihelper';
export declare class AhoiApiFactory extends AbstractAhoiApiFactory {
    getAhoiUtil(): AhoiHelper;
    /**
     * An access represents the connection between a provider and an account. It enables AHOI to log
     * into a (bank) account on behalf of a user. Setting up an access is relatively simple: A
     * provider id is required, and the credential fields, which are used to access the provider, have
     * to be set. The latter differ among the various providers. For example, for banks, it is common
     * to use the account number and a secret pin. Other providers might use an e-mail address and a
     * password. In a production environment, the pin has to be encrypted. Creating an access also
     * allows AHOI to start interacting with the provider: It starts creating accounts, gathering
     * transactions and classifying them. Deleting an access, on the other hand, also removes all
     * associated information. Furthermore, an access contains important information about its current
     * state — for example, whether the account has been locked.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Access
     * @param installationId
     * @param bankingToken
     */
    getAccessApi(installationId: string, bankingToken?: string): Promise<AccessApi>;
    /**
     * An account groups financial records (e.g., a bank account). In the case of a bank account, the
     * account has an owner, bank identification number, account number and a balance. For an account
     * to exist, an access first has to be created. Then, an account resource can be queried for
     * transactions, transaction patterns and summaries. Also, it is possible to transfer money from
     * one account to another. AHOI allows you to give (user-defined) names to accounts to make them
     * easily recognizable for end users. AHOIs automatic refresh of transactions and balances can
     * also be toggled.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Account
     * @param installationId
     * @param bankingToken
     */
    getAccountApi(installationId: string, bankingToken?: string): Promise<AccountApi>;
    /**
     * This endpoint handles the support of transaction categorization. Currently the one and only
     * transaction categorization is the Finlytics method.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Category
     * @param installationId
     * @param bankingToken
     */
    getCategoryApi(installationId: string, bankingToken?: string): Promise<CategoryApi>;
    /**
     * An analyzed contract list of current API user. Contracts will be identified by analyzing the
     * account transactions.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Contract
     * @param installationId
     * @param bankingToken
     */
    getContractsApi(installationId: string, bankingToken?: string): Promise<ContractApi>;
    /**
     * The forecast resource provides a balance forecast for the end of the current month based on the
     * current balance and the transaction patterns that are expected to occur up to the end of the
     * current month. The upcoming transactions are also provided. The current month is determined by
     * the latest refresh of transactions.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Forecast
     * @param installationId
     * @param bankingToken
     */
    getForecastApi(installationId: string, bankingToken?: string): Promise<ForecastApi>;
    /**
     * Providers represent financial institutions such as banks. They provide information such as the
     * name of the provider and which institutions AHOI is able to access. A provider is the starting
     * point to set up an access to a provider, to create accounts and to receive transactions.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Provider
     * @param installationId
     * @param bankingToken
     */
    getProviderApi(installationId: string, bankingToken?: string): Promise<ProviderApi>;
    /**
     * A resouce to handle registration process via OAuth2. Fetch the API public key via GET /keys and
     * registers the client using POST /registration
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Registration
     * @param installationId
     * @param bankingToken
     */
    getRegistrationApi(installationId?: string, bankingToken?: string): Promise<RegistrationApi>;
    /**
     * A security is a tradable financial asset. This part of the API is not final and subject to
     * change.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Security
     * @param installationId
     * @param bankingToken
     */
    getSecurityApi(installationId?: string, bankingToken?: string): Promise<SecurityApi>;
    /**
     * TAN schemes are the available methods for authorizing a transfer.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/TAN_schemes
     * @param installationId
     * @param bankingToken
     */
    getTANSchemesApi(installationId: string, bankingToken?: string): Promise<TANSchemesApi>;
    /**
     * Handling of asynchronous running tasks
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Task
     * @param installationId
     * @param bankingToken
     */
    getTaskApi(installationId: string, bankingToken?: string): Promise<TaskApi>;
    /**
     * A transaction represents a financial operation related to an account. A bank account
     * transaction holds information about the debtor and the creditor, the amount, information about
     * the date and time of booking, its availability and its purpose (as found in the memo field).
     * Additionally, a transaction may be related to a recurring transaction pattern. The length of
     * the transaction list depends on the provider and the amount of time in which the account has
     * already been set up within AHOI. The provided information may differ from provider to provider.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Transaction
     * @param installationId
     * @param bankingToken
     */
    getTransactionApi(installationId: string, bankingToken?: string): Promise<TransactionApi>;
    /**
     * Transaction patterns are the results of regularly recurring transactions. These patterns can be
     * automatically recognized by AHOI. The recognition process starts after every account refresh
     * and updates the previously discovered patterns. Since the process is not 100% accurate, single
     * transaction patterns can be deactivated or can be created manually by the user. Transaction
     * patterns are used to identify upcoming transactions and to calculate a balance forecast. They
     * can be configured to be monthly, quarterly, semi-annually or annually recurring. To
     * automatically create a transaction pattern, there has to be at least three transactions related
     * to this pattern. One transaction pattern refers to many transactions and one account.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Transaction_pattern
     * @param installationId
     * @param bankingToken
     */
    getTransactionPatternApi(installationId: string, bankingToken?: string): Promise<TransactionPatternApi>;
    /**
     * This resource returns a list of monthly summaries for an account for each month in which
     * transactions are available. It contains balances and the total sum of incoming and outgoing
     * transactions.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Transaction_summary
     * @param installationId
     * @param bankingToken
     */
    getTransactionSummaryApi(installationId: string, bankingToken?: string): Promise<TransactionSummaryApi>;
    /**
     * A endpoint for handling transfers.
     *
     * @see https://banking-sandbox.starfinanz.de/ahoi/docs/api/swagger-ui/index.html#!/resource/Transfer
     * @param installationId
     * @param bankingToken
     */
    getTransferApi(installationId: string, bankingToken?: string): Promise<TransferApi>;
}
