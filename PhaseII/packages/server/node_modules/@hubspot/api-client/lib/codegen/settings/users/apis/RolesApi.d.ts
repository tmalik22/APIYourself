import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicPermissionSetNoPaging } from '../models/CollectionResponsePublicPermissionSetNoPaging';
export declare class RolesApiRequestFactory extends BaseAPIRequestFactory {
    getAll(_options?: Configuration): Promise<RequestContext>;
}
export declare class RolesApiResponseProcessor {
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicPermissionSetNoPaging>>;
}
