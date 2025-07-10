import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { IdentificationTokenGenerationRequest } from '../models/IdentificationTokenGenerationRequest';
import { IdentificationTokenResponse } from '../models/IdentificationTokenResponse';
export declare class GenerateApiRequestFactory extends BaseAPIRequestFactory {
    generateToken(identificationTokenGenerationRequest: IdentificationTokenGenerationRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class GenerateApiResponseProcessor {
    generateTokenWithHttpInfo(response: ResponseContext): Promise<HttpInfo<IdentificationTokenResponse>>;
}
