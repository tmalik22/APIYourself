import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AccessTokenInfoResponse } from '../models/AccessTokenInfoResponse';
export declare class AccessTokensApiRequestFactory extends BaseAPIRequestFactory {
    get(token: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class AccessTokensApiResponseProcessor {
    getWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AccessTokenInfoResponse>>;
}
