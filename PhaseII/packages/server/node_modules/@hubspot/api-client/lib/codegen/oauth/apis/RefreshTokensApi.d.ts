import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { RefreshTokenInfoResponse } from '../models/RefreshTokenInfoResponse';
export declare class RefreshTokensApiRequestFactory extends BaseAPIRequestFactory {
    archive(token: string, _options?: Configuration): Promise<RequestContext>;
    get(token: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class RefreshTokensApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    getWithHttpInfo(response: ResponseContext): Promise<HttpInfo<RefreshTokenInfoResponse>>;
}
