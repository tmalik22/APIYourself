import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicAssociationDefinitionNoPaging } from '../models/CollectionResponsePublicAssociationDefinitionNoPaging';
export declare class TypesApiRequestFactory extends BaseAPIRequestFactory {
    getAll(fromObjectType: string, toObjectType: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class TypesApiResponseProcessor {
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicAssociationDefinitionNoPaging>>;
}
