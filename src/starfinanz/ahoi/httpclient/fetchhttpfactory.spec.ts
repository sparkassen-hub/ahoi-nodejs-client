import { FetchHttpFactory } from './fetchhttpfactory';
import nodeFetch, { FetchError } from 'node-fetch';
import { FetchAPI } from 'ahoi-swagger-fetchclient';

jest.mock('node-fetch');
const nodeFetchMock = (nodeFetch as unknown as jest.Mock);
const requestOptions = {
  method: 'GET',
  timeout: 5000, // 5 sec,
  compress: true,
};

let factory: FetchHttpFactory;
let httpClient: FetchAPI;

describe('Simple expression tests', () => {
  beforeEach(() => {
    factory = new FetchHttpFactory();
    httpClient = factory.getHttpClient('installationIdZ123');

  });

  it('Should successfully request the httpClient ', async () => {

    nodeFetchMock.mockResolvedValue({
      ok: true,
      text: () => new Promise((resolve, reject) => {
        resolve('OK :-)');
      }),
    });

    const httpClientResp = await httpClient('https://url.de', requestOptions);
    console.log(httpClientResp);

    expect(httpClientResp.ok).toBeTruthy();
  });

  it('Should return a failed request to the httpClient ', async () => {
    nodeFetchMock.mockResolvedValue({
      ok: false,
      text: () => new Promise((resolve, reject) => {
        resolve('sorry, request failed....');
      }),
    });

    const factory = new FetchHttpFactory();
    const httpClient = factory.getHttpClient('installationIdZ123');
    await expect(
      httpClient('https://url.de', requestOptions)
    ).rejects.toThrowError(Error);
  });
});
