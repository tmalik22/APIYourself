import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponseExternalUnifiedEvent } from '../models/CollectionResponseExternalUnifiedEvent';
import { VisibleExternalEventTypeNames } from '../models/VisibleExternalEventTypeNames';
export declare class EventsApiRequestFactory extends BaseAPIRequestFactory {
    getPage(objectType?: string, eventType?: string, after?: string, before?: string, limit?: number, sort?: Array<string>, occurredAfter?: Date, occurredBefore?: Date, objectId?: number, objectPropertyPropname?: any, propertyPropname?: any, id?: Array<string>, _options?: Configuration): Promise<RequestContext>;
    getTypes(_options?: Configuration): Promise<RequestContext>;
}
export declare class EventsApiResponseProcessor {
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseExternalUnifiedEvent>>;
    getTypesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<VisibleExternalEventTypeNames>>;
}
