import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePropertyNoPaging } from '../models/CollectionResponsePropertyNoPaging';
import { Property } from '../models/Property';
import { PropertyCreate } from '../models/PropertyCreate';
import { PropertyUpdate } from '../models/PropertyUpdate';
export declare class CoreApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, propertyName: string, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, propertyCreate: PropertyCreate, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, archived?: boolean, properties?: string, _options?: Configuration): Promise<RequestContext>;
    getByName(objectType: string, propertyName: string, archived?: boolean, properties?: string, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, propertyName: string, propertyUpdate: PropertyUpdate, _options?: Configuration): Promise<RequestContext>;
}
export declare class CoreApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Property>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePropertyNoPaging>>;
    getByNameWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Property>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Property>>;
}
