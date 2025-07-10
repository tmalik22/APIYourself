import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicUserForwardPaging } from '../models/CollectionResponsePublicUserForwardPaging';
import { PublicUser } from '../models/PublicUser';
import { PublicUserUpdate } from '../models/PublicUserUpdate';
import { UserProvisionRequest } from '../models/UserProvisionRequest';
export declare class UsersApiRequestFactory extends BaseAPIRequestFactory {
    archive(userId: string, idProperty?: 'USER_ID' | 'EMAIL', _options?: Configuration): Promise<RequestContext>;
    create(userProvisionRequest: UserProvisionRequest, _options?: Configuration): Promise<RequestContext>;
    getById(userId: string, idProperty?: 'USER_ID' | 'EMAIL', _options?: Configuration): Promise<RequestContext>;
    getPage(limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
    replace(userId: string, publicUserUpdate: PublicUserUpdate, idProperty?: 'USER_ID' | 'EMAIL', _options?: Configuration): Promise<RequestContext>;
}
export declare class UsersApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicUser>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicUser>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicUserForwardPaging>>;
    replaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicUser>>;
}
