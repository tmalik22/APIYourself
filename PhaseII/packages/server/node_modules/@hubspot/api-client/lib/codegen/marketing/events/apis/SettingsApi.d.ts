import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { EventDetailSettings } from '../models/EventDetailSettings';
import { EventDetailSettingsUrl } from '../models/EventDetailSettingsUrl';
export declare class SettingsApiRequestFactory extends BaseAPIRequestFactory {
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    update(appId: number, eventDetailSettingsUrl: EventDetailSettingsUrl, _options?: Configuration): Promise<RequestContext>;
}
export declare class SettingsApiResponseProcessor {
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<EventDetailSettings>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<EventDetailSettings>>;
}
