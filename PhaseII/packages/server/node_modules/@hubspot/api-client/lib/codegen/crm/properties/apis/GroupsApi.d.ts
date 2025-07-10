import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePropertyGroupNoPaging } from '../models/CollectionResponsePropertyGroupNoPaging';
import { PropertyGroup } from '../models/PropertyGroup';
import { PropertyGroupCreate } from '../models/PropertyGroupCreate';
import { PropertyGroupUpdate } from '../models/PropertyGroupUpdate';
export declare class GroupsApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, groupName: string, _options?: Configuration): Promise<RequestContext>;
    create(objectType: string, propertyGroupCreate: PropertyGroupCreate, _options?: Configuration): Promise<RequestContext>;
    getAll(objectType: string, _options?: Configuration): Promise<RequestContext>;
    getByName(objectType: string, groupName: string, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, groupName: string, propertyGroupUpdate: PropertyGroupUpdate, _options?: Configuration): Promise<RequestContext>;
}
export declare class GroupsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PropertyGroup>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePropertyGroupNoPaging>>;
    getByNameWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PropertyGroup>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PropertyGroup>>;
}
