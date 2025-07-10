import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AttachToLangPrimaryRequestVNext } from '../models/AttachToLangPrimaryRequestVNext';
import { BatchInputBlogAuthor } from '../models/BatchInputBlogAuthor';
import { BatchInputJsonNode } from '../models/BatchInputJsonNode';
import { BatchInputString } from '../models/BatchInputString';
import { BatchResponseBlogAuthor } from '../models/BatchResponseBlogAuthor';
import { BatchResponseBlogAuthorWithErrors } from '../models/BatchResponseBlogAuthorWithErrors';
import { BlogAuthor } from '../models/BlogAuthor';
import { BlogAuthorCloneRequestVNext } from '../models/BlogAuthorCloneRequestVNext';
import { CollectionResponseWithTotalBlogAuthorForwardPaging } from '../models/CollectionResponseWithTotalBlogAuthorForwardPaging';
import { DetachFromLangGroupRequestVNext } from '../models/DetachFromLangGroupRequestVNext';
import { SetNewLanguagePrimaryRequestVNext } from '../models/SetNewLanguagePrimaryRequestVNext';
import { UpdateLanguagesRequestVNext } from '../models/UpdateLanguagesRequestVNext';
export declare class BlogAuthorsApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveBatch(batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    attachToLangGroup(attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    create(blogAuthor: BlogAuthor, _options?: Configuration): Promise<RequestContext>;
    createBatch(batchInputBlogAuthor: BatchInputBlogAuthor, _options?: Configuration): Promise<RequestContext>;
    createLangVariation(blogAuthorCloneRequestVNext: BlogAuthorCloneRequestVNext, _options?: Configuration): Promise<RequestContext>;
    detachFromLangGroup(detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext, _options?: Configuration): Promise<RequestContext>;
    getById(objectId: string, archived?: boolean, property?: string, _options?: Configuration): Promise<RequestContext>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, property?: string, _options?: Configuration): Promise<RequestContext>;
    readBatch(batchInputString: BatchInputString, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    setLangPrimary(setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    update(objectId: string, blogAuthor: BlogAuthor, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateBatch(batchInputJsonNode: BatchInputJsonNode, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateLangs(updateLanguagesRequestVNext: UpdateLanguagesRequestVNext, _options?: Configuration): Promise<RequestContext>;
}
export declare class BlogAuthorsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    archiveBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    attachToLangGroupWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BlogAuthor>>;
    createBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>>;
    createLangVariationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BlogAuthor>>;
    detachFromLangGroupWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BlogAuthor>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalBlogAuthorForwardPaging>>;
    readBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>>;
    setLangPrimaryWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BlogAuthor>>;
    updateBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>>;
    updateLangsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
