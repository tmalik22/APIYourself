import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AssociationSpec } from '../models/AssociationSpec';
import { BatchResponsePublicDefaultAssociation } from '../models/BatchResponsePublicDefaultAssociation';
import { CollectionResponseMultiAssociatedObjectWithLabelForwardPaging } from '../models/CollectionResponseMultiAssociatedObjectWithLabelForwardPaging';
import { LabelsBetweenObjectPair } from '../models/LabelsBetweenObjectPair';
export declare class BasicApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, objectId: string, toObjectType: string, toObjectId: string, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, objectId: string, toObjectType: string, toObjectId: string, associationSpec: Array<AssociationSpec>, _options?: Configuration): Promise<RequestContext>;
    createDefault(fromObjectType: string, fromObjectId: string, toObjectType: string, toObjectId: string, _options?: Configuration): Promise<RequestContext>;
    getPage(objectType: string, objectId: string, toObjectType: string, after?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class BasicApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<LabelsBetweenObjectPair>>;
    createDefaultWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponsePublicDefaultAssociation>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseMultiAssociatedObjectWithLabelForwardPaging>>;
}
