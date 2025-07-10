import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputCallbackCompletionBatchRequest } from '../models/BatchInputCallbackCompletionBatchRequest';
import { CallbackCompletionRequest } from '../models/CallbackCompletionRequest';
export declare class CallbacksApiRequestFactory extends BaseAPIRequestFactory {
    complete(callbackId: string, callbackCompletionRequest: CallbackCompletionRequest, _options?: Configuration): Promise<RequestContext>;
    completeBatch(batchInputCallbackCompletionBatchRequest: BatchInputCallbackCompletionBatchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class CallbacksApiResponseProcessor {
    completeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    completeBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
