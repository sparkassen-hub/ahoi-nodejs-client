import { FetchAPI } from 'ahoi-swagger-fetchclient';
import { HttpFilter } from '../lib/httpfilter/httpfilter';
/**
 * This class provides an fetch http client to send requests the AHOI API. Request parameter, header
 * and data and the response from AHOI can be changed using filters {@link FetchHttpFilter}.
 *
 * @export
 * @class FetchHttpFactory
 */
export declare class FetchHttpFactory {
    private httpRequestFilters;
    private httpResponseFilters;
    constructor();
    /**
     * Set http filters that will be applied to every request and response. The filters will be called
     * in given order for requests and in reverse order for responses.
     *
     * @param {HttpFilter[]} httpFilters
     * @memberof FetchHttpFactory
     */
    setHttpFilter(httpFilters: HttpFilter[]): void;
    /**
     * The generated AHOI API client takes as initialization parameters a configuration, a baseurl and
     * an httpclient {FetchAPI}. This method returns a function as an implementation of the FetchAPI
     * that allows to change request to the AHOI API and the response using filters
     * {@link FetchHttpFilter}.
     *
     * @param {string} [installationId='']
     * @returns {FetchAPI}
     * @memberof FetchHttpFactory
     */
    getHttpClient(installationId?: string, bankingToken?: string): FetchAPI;
    private applyFilterAndExecuteRequest;
    private applyFilters;
}
