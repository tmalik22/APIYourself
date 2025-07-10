import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputMarketingEventEmailSubscriber } from '../models/BatchInputMarketingEventEmailSubscriber';
import { BatchInputMarketingEventSubscriber } from '../models/BatchInputMarketingEventSubscriber';
export declare class SubscriberStateChangesApiRequestFactory extends BaseAPIRequestFactory {
    upsertByContactEmail(externalEventId: string, subscriberState: string, externalAccountId: string, batchInputMarketingEventEmailSubscriber: BatchInputMarketingEventEmailSubscriber, _options?: Configuration): Promise<RequestContext>;
    upsertByContactId(externalEventId: string, subscriberState: string, externalAccountId: string, batchInputMarketingEventSubscriber: BatchInputMarketingEventSubscriber, _options?: Configuration): Promise<RequestContext>;
}
export declare class SubscriberStateChangesApiResponseProcessor {
    upsertByContactEmailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    upsertByContactIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
