import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicAuditInfoNoPaging } from '../models/CollectionResponsePublicAuditInfoNoPaging';
export declare class PipelineAuditsApiRequestFactory extends BaseAPIRequestFactory {
    getAudit(objectType: string, pipelineId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PipelineAuditsApiResponseProcessor {
    getAuditWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicAuditInfoNoPaging>>;
}
