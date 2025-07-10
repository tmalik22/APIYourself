import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputPropertyCreate } from '../models/BatchInputPropertyCreate';
import { BatchInputPropertyName } from '../models/BatchInputPropertyName';
import { BatchReadInputPropertyName } from '../models/BatchReadInputPropertyName';
import { BatchResponseProperty } from '../models/BatchResponseProperty';
import { BatchResponsePropertyWithErrors } from '../models/BatchResponsePropertyWithErrors';
export declare class BatchApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, batchInputPropertyName: BatchInputPropertyName, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, batchInputPropertyCreate: BatchInputPropertyCreate, _options?: Configuration): Promise<RequestContext>;
    read(objectType: string, batchReadInputPropertyName: BatchReadInputPropertyName, _options?: Configuration): Promise<RequestContext>;
}
export declare class BatchApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseProperty | BatchResponsePropertyWithErrors>>;
    readWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseProperty | BatchResponsePropertyWithErrors>>;
}
