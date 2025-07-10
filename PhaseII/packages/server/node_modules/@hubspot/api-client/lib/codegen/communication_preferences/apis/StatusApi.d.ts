import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { PublicSubscriptionStatus } from '../models/PublicSubscriptionStatus';
import { PublicSubscriptionStatusesResponse } from '../models/PublicSubscriptionStatusesResponse';
import { PublicUpdateSubscriptionStatusRequest } from '../models/PublicUpdateSubscriptionStatusRequest';
export declare class StatusApiRequestFactory extends BaseAPIRequestFactory {
    getEmailStatus(emailAddress: string, _options?: Configuration): Promise<RequestContext>;
    subscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Promise<RequestContext>;
    unsubscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class StatusApiResponseProcessor {
    getEmailStatusWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicSubscriptionStatusesResponse>>;
    subscribeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicSubscriptionStatus>>;
    unsubscribeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicSubscriptionStatus>>;
}
