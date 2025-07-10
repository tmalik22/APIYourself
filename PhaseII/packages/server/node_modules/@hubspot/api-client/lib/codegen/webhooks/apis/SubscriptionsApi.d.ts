import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputSubscriptionBatchUpdateRequest } from '../models/BatchInputSubscriptionBatchUpdateRequest';
import { BatchResponseSubscriptionResponse } from '../models/BatchResponseSubscriptionResponse';
import { BatchResponseSubscriptionResponseWithErrors } from '../models/BatchResponseSubscriptionResponseWithErrors';
import { SubscriptionCreateRequest } from '../models/SubscriptionCreateRequest';
import { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import { SubscriptionPatchRequest } from '../models/SubscriptionPatchRequest';
import { SubscriptionResponse } from '../models/SubscriptionResponse';
export declare class SubscriptionsApiRequestFactory extends BaseAPIRequestFactory {
    archive(subscriptionId: number, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, subscriptionCreateRequest: SubscriptionCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(subscriptionId: number, appId: number, _options?: Configuration): Promise<RequestContext>;
    update(subscriptionId: number, appId: number, subscriptionPatchRequest: SubscriptionPatchRequest, _options?: Configuration): Promise<RequestContext>;
    updateBatch(appId: number, batchInputSubscriptionBatchUpdateRequest: BatchInputSubscriptionBatchUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class SubscriptionsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubscriptionResponse>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubscriptionListResponse>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubscriptionResponse>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubscriptionResponse>>;
    updateBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseSubscriptionResponse | BatchResponseSubscriptionResponseWithErrors>>;
}
