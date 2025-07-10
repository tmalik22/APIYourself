import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { SettingsChangeRequest } from '../models/SettingsChangeRequest';
import { SettingsResponse } from '../models/SettingsResponse';
export declare class SettingsApiRequestFactory extends BaseAPIRequestFactory {
    clear(appId: number, _options?: Configuration): Promise<RequestContext>;
    configure(appId: number, settingsChangeRequest: SettingsChangeRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class SettingsApiResponseProcessor {
    clearWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    configureWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SettingsResponse>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SettingsResponse>>;
}
