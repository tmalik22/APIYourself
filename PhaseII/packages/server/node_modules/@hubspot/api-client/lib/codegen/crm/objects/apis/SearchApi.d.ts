import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '../models/CollectionResponseWithTotalSimplePublicObjectForwardPaging';
import { PublicObjectSearchRequest } from '../models/PublicObjectSearchRequest';
export declare class SearchApiRequestFactory extends BaseAPIRequestFactory {
    doSearch(objectType: string, publicObjectSearchRequest: PublicObjectSearchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class SearchApiResponseProcessor {
    doSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalSimplePublicObjectForwardPaging>>;
}
