import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponseTimelineEventTemplateNoPaging } from '../models/CollectionResponseTimelineEventTemplateNoPaging';
import { TimelineEventTemplate } from '../models/TimelineEventTemplate';
import { TimelineEventTemplateCreateRequest } from '../models/TimelineEventTemplateCreateRequest';
import { TimelineEventTemplateUpdateRequest } from '../models/TimelineEventTemplateUpdateRequest';
export declare class TemplatesApiRequestFactory extends BaseAPIRequestFactory {
    archive(eventTemplateId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, timelineEventTemplateCreateRequest: TimelineEventTemplateCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(eventTemplateId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    update(eventTemplateId: string, appId: number, timelineEventTemplateUpdateRequest: TimelineEventTemplateUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class TemplatesApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TimelineEventTemplate>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseTimelineEventTemplateNoPaging>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TimelineEventTemplate>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TimelineEventTemplate>>;
}
