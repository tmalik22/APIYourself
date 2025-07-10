import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
export declare class ValidationApiRequestFactory extends BaseAPIRequestFactory {
    doValidate(path: string, file?: HttpFile, _options?: Configuration): Promise<RequestContext>;
}
export declare class ValidationApiResponseProcessor {
    doValidateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
