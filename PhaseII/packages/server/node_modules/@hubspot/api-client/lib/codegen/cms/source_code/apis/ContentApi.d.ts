import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { AssetFileMetadata } from '../models/AssetFileMetadata';
export declare class ContentApiRequestFactory extends BaseAPIRequestFactory {
    archive(environment: string, path: string, _options?: Configuration): Promise<RequestContext>;
    create(environment: string, path: string, file?: HttpFile, _options?: Configuration): Promise<RequestContext>;
    createOrUpdate(environment: string, path: string, file?: HttpFile, _options?: Configuration): Promise<RequestContext>;
    download(environment: string, path: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class ContentApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AssetFileMetadata>>;
    createOrUpdateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AssetFileMetadata>>;
    downloadWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
