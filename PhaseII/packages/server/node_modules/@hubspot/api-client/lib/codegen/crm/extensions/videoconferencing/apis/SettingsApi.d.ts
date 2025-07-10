import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ExternalSettings } from '../models/ExternalSettings';
export declare class SettingsApiRequestFactory extends BaseAPIRequestFactory {
    archive(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(appId: number, _options?: Configuration): Promise<RequestContext>;
    replace(appId: number, externalSettings: ExternalSettings, _options?: Configuration): Promise<RequestContext>;
}
export declare class SettingsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ExternalSettings>>;
    replaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ExternalSettings>>;
}
