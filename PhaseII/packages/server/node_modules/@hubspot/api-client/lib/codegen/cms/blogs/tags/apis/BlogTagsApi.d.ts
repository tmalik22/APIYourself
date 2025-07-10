import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AttachToLangPrimaryRequestVNext } from '../models/AttachToLangPrimaryRequestVNext';
import { BatchInputJsonNode } from '../models/BatchInputJsonNode';
import { BatchInputString } from '../models/BatchInputString';
import { BatchInputTag } from '../models/BatchInputTag';
import { BatchResponseTag } from '../models/BatchResponseTag';
import { BatchResponseTagWithErrors } from '../models/BatchResponseTagWithErrors';
import { CollectionResponseWithTotalTagForwardPaging } from '../models/CollectionResponseWithTotalTagForwardPaging';
import { DetachFromLangGroupRequestVNext } from '../models/DetachFromLangGroupRequestVNext';
import { SetNewLanguagePrimaryRequestVNext } from '../models/SetNewLanguagePrimaryRequestVNext';
import { Tag } from '../models/Tag';
import { TagCloneRequestVNext } from '../models/TagCloneRequestVNext';
import { UpdateLanguagesRequestVNext } from '../models/UpdateLanguagesRequestVNext';
export declare class BlogTagsApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveBatch(batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    attachToLangGroup(attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    create(tag: Tag, _options?: Configuration): Promise<RequestContext>;
    createBatch(batchInputTag: BatchInputTag, _options?: Configuration): Promise<RequestContext>;
    createLangVariation(tagCloneRequestVNext: TagCloneRequestVNext, _options?: Configuration): Promise<RequestContext>;
    detachFromLangGroup(detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext, _options?: Configuration): Promise<RequestContext>;
    getById(objectId: string, archived?: boolean, property?: string, _options?: Configuration): Promise<RequestContext>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, property?: string, _options?: Configuration): Promise<RequestContext>;
    readBatch(batchInputString: BatchInputString, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    setLangPrimary(setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    update(objectId: string, tag: Tag, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateBatch(batchInputJsonNode: BatchInputJsonNode, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateLangs(updateLanguagesRequestVNext: UpdateLanguagesRequestVNext, _options?: Configuration): Promise<RequestContext>;
}
export declare class BlogTagsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    archiveBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    attachToLangGroupWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Tag>>;
    createBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseTag | BatchResponseTagWithErrors>>;
    createLangVariationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Tag>>;
    detachFromLangGroupWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Tag>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalTagForwardPaging>>;
    readBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseTag | BatchResponseTagWithErrors>>;
    setLangPrimaryWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Tag>>;
    updateBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseTag | BatchResponseTagWithErrors>>;
    updateLangsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
