import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BehavioralEventHttpCompletionRequest } from '../models/BehavioralEventHttpCompletionRequest';
export declare class CustomEventDataApiRequestFactory extends BaseAPIRequestFactory {
    send(behavioralEventHttpCompletionRequest: BehavioralEventHttpCompletionRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class CustomEventDataApiResponseProcessor {
    sendWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
