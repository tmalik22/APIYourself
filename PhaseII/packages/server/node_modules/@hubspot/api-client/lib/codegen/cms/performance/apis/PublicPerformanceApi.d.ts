import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { PublicPerformanceResponse } from '../models/PublicPerformanceResponse';
export declare class PublicPerformanceApiRequestFactory extends BaseAPIRequestFactory {
    getPage(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Promise<RequestContext>;
    getUptime(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicPerformanceApiResponseProcessor {
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicPerformanceResponse>>;
    getUptimeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicPerformanceResponse>>;
}
