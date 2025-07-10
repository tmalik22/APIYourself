import { HttpInfo } from '../http/http';
import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { PublicPerformanceResponse } from '../models/PublicPerformanceResponse';
import { PublicPerformanceApiRequestFactory, PublicPerformanceApiResponseProcessor } from "../apis/PublicPerformanceApi";
export declare class ObservablePublicPerformanceApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PublicPerformanceApiRequestFactory, responseProcessor?: PublicPerformanceApiResponseProcessor);
    getPageWithHttpInfo(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<HttpInfo<PublicPerformanceResponse>>;
    getPage(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<PublicPerformanceResponse>;
    getUptimeWithHttpInfo(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<HttpInfo<PublicPerformanceResponse>>;
    getUptime(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<PublicPerformanceResponse>;
}
