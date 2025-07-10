import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputTimelineEvent } from '../models/BatchInputTimelineEvent';
import { BatchResponseTimelineEventResponse } from '../models/BatchResponseTimelineEventResponse';
import { BatchResponseTimelineEventResponseWithErrors } from '../models/BatchResponseTimelineEventResponseWithErrors';
import { EventDetail } from '../models/EventDetail';
import { TimelineEvent } from '../models/TimelineEvent';
import { TimelineEventResponse } from '../models/TimelineEventResponse';
export declare class EventsApiRequestFactory extends BaseAPIRequestFactory {
    create(timelineEvent: TimelineEvent, _options?: Configuration): Promise<RequestContext>;
    createBatch(batchInputTimelineEvent: BatchInputTimelineEvent, _options?: Configuration): Promise<RequestContext>;
    getById(eventTemplateId: string, eventId: string, _options?: Configuration): Promise<RequestContext>;
    getDetailById(eventTemplateId: string, eventId: string, _options?: Configuration): Promise<RequestContext>;
    getRenderById(eventTemplateId: string, eventId: string, detail?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class EventsApiResponseProcessor {
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TimelineEventResponse>>;
    createBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseTimelineEventResponse | void | BatchResponseTimelineEventResponseWithErrors>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TimelineEventResponse>>;
    getDetailByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<EventDetail>>;
    getRenderByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
}
