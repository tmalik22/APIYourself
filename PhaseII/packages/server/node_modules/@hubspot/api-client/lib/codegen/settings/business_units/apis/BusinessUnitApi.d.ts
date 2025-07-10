import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicBusinessUnitNoPaging } from '../models/CollectionResponsePublicBusinessUnitNoPaging';
export declare class BusinessUnitApiRequestFactory extends BaseAPIRequestFactory {
    getByUserID(userId: string, properties?: Array<string>, name?: Array<string>, _options?: Configuration): Promise<RequestContext>;
}
export declare class BusinessUnitApiResponseProcessor {
    getByUserIDWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicBusinessUnitNoPaging>>;
}
