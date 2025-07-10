import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { PublicMergeInput } from '../models/PublicMergeInput';
import { SimplePublicObject } from '../models/SimplePublicObject';
export declare class MergeApiRequestFactory extends BaseAPIRequestFactory {
    merge(publicMergeInput: PublicMergeInput, _options?: Configuration): Promise<RequestContext>;
}
export declare class MergeApiResponseProcessor {
    mergeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SimplePublicObject>>;
}
