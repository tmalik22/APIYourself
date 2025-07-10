import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AssetFileMetadata } from '../models/AssetFileMetadata';
export declare class MetadataApiRequestFactory extends BaseAPIRequestFactory {
    get(environment: string, path: string, properties?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class MetadataApiResponseProcessor {
    getWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AssetFileMetadata>>;
}
