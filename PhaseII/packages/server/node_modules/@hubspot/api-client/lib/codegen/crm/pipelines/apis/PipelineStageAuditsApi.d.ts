import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicAuditInfoNoPaging } from '../models/CollectionResponsePublicAuditInfoNoPaging';
export declare class PipelineStageAuditsApiRequestFactory extends BaseAPIRequestFactory {
    getAudit(objectType: string, stageId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelineStageAuditsApiResponseProcessor {
    getAuditWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicAuditInfoNoPaging>>;
}
