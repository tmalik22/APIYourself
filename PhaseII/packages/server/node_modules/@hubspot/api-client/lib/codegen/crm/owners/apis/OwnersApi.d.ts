import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicOwnerForwardPaging } from '../models/CollectionResponsePublicOwnerForwardPaging';
import { PublicOwner } from '../models/PublicOwner';
export declare class OwnersApiRequestFactory extends BaseAPIRequestFactory {
    getById(ownerId: number, idProperty?: 'id' | 'userId', archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(email?: string, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class OwnersApiResponseProcessor {
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicOwner>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicOwnerForwardPaging>>;
}
