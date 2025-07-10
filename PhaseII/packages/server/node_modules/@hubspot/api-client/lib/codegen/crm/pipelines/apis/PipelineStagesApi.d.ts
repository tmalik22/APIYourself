import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePipelineStageNoPaging } from '../models/CollectionResponsePipelineStageNoPaging';
import { PipelineStage } from '../models/PipelineStage';
import { PipelineStageInput } from '../models/PipelineStageInput';
import { PipelineStagePatchInput } from '../models/PipelineStagePatchInput';
export declare class PipelineStagesApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, pipelineId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, pipelineId: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
    replace(objectType: string, pipelineId: string, stageId: string, pipelineStageInput: PipelineStageInput, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, pipelineId: string, stageId: string, pipelineStagePatchInput: PipelineStagePatchInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelineStagesApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PipelineStage>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePipelineStageNoPaging>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PipelineStage>>;
    replaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PipelineStage>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PipelineStage>>;
}
