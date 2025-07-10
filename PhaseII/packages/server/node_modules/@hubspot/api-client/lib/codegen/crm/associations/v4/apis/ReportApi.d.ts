import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ReportCreationResponse } from '../models/ReportCreationResponse';
export declare class ReportApiRequestFactory extends BaseAPIRequestFactory {
    request(userId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class ReportApiResponseProcessor {
    requestWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ReportCreationResponse>>;
}
