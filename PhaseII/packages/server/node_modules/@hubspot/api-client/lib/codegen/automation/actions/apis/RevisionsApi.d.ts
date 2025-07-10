import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicActionRevisionForwardPaging } from '../models/CollectionResponsePublicActionRevisionForwardPaging';
import { PublicActionRevision } from '../models/PublicActionRevision';
export declare class RevisionsApiRequestFactory extends BaseAPIRequestFactory {
    getById(definitionId: string, revisionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    getPage(definitionId: string, appId: number, limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class RevisionsApiResponseProcessor {
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionRevision>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicActionRevisionForwardPaging>>;
}
