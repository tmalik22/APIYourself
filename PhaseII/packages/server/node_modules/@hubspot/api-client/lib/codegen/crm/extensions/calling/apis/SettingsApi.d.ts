import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { SettingsPatchRequest } from '../models/SettingsPatchRequest';
import { SettingsRequest } from '../models/SettingsRequest';
import { SettingsResponse } from '../models/SettingsResponse';
export declare class SettingsApiRequestFactory extends BaseAPIRequestFactory {
    archive(appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, settingsRequest: SettingsRequest, _options?: Configuration): Promise<RequestContext>;
    getById(appId: number, _options?: Configuration): Promise<RequestContext>;
    update(appId: number, settingsPatchRequest: SettingsPatchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class SettingsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SettingsResponse>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SettingsResponse>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SettingsResponse>>;
}
