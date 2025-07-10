import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputMarketingEventEmailSubscriber } from '../models/BatchInputMarketingEventEmailSubscriber';
import { BatchInputMarketingEventSubscriber } from '../models/BatchInputMarketingEventSubscriber';
import { BatchResponseSubscriberEmailResponse } from '../models/BatchResponseSubscriberEmailResponse';
import { BatchResponseSubscriberVidResponse } from '../models/BatchResponseSubscriberVidResponse';
export declare class AttendanceSubscriberStateChangesApiRequestFactory extends BaseAPIRequestFactory {
    recordByContactEmails(externalEventId: string, subscriberState: string, batchInputMarketingEventEmailSubscriber: BatchInputMarketingEventEmailSubscriber, externalAccountId?: string, _options?: Configuration): Promise<RequestContext>;
    recordByContactIds(externalEventId: string, subscriberState: string, batchInputMarketingEventSubscriber: BatchInputMarketingEventSubscriber, externalAccountId?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class AttendanceSubscriberStateChangesApiResponseProcessor {
    recordByContactEmailsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseSubscriberEmailResponse>>;
    recordByContactIdsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseSubscriberVidResponse>>;
}
