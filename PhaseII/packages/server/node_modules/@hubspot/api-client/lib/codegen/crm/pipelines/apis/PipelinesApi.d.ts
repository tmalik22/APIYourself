import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePipelineNoPaging } from '../models/CollectionResponsePipelineNoPaging';
import { Pipeline } from '../models/Pipeline';
import { PipelineInput } from '../models/PipelineInput';
import { PipelinePatchInput } from '../models/PipelinePatchInput';
export declare class PipelinesApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, pipelineId: string, validateReferencesBeforeDelete?: boolean, validateDealStageUsagesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, pipelineInput: PipelineInput, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext>;
    replace(objectType: string, pipelineId: string, pipelineInput: PipelineInput, validateReferencesBeforeDelete?: boolean, validateDealStageUsagesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, pipelineId: string, pipelinePatchInput: PipelinePatchInput, validateReferencesBeforeDelete?: boolean, validateDealStageUsagesBeforeDelete?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelinesApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Pipeline>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePipelineNoPaging>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Pipeline>>;
    replaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Pipeline>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Pipeline>>;
}
