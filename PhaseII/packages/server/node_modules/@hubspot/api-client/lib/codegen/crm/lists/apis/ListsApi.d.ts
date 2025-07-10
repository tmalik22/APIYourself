import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ListCreateRequest } from '../models/ListCreateRequest';
import { ListCreateResponse } from '../models/ListCreateResponse';
import { ListFetchResponse } from '../models/ListFetchResponse';
import { ListFilterUpdateRequest } from '../models/ListFilterUpdateRequest';
import { ListSearchRequest } from '../models/ListSearchRequest';
import { ListSearchResponse } from '../models/ListSearchResponse';
import { ListUpdateResponse } from '../models/ListUpdateResponse';
import { ListsByIdResponse } from '../models/ListsByIdResponse';
export declare class ListsApiRequestFactory extends BaseAPIRequestFactory {
    create(listCreateRequest: ListCreateRequest, _options?: Configuration): Promise<RequestContext>;
    doSearch(listSearchRequest: ListSearchRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(listIds?: Array<string>, includeFilters?: boolean, _options?: Configuration): Promise<RequestContext>;
    getById(listId: string, includeFilters?: boolean, _options?: Configuration): Promise<RequestContext>;
    getByName(listName: string, objectTypeId: string, includeFilters?: boolean, _options?: Configuration): Promise<RequestContext>;
    remove(listId: string, _options?: Configuration): Promise<RequestContext>;
    restore(listId: string, _options?: Configuration): Promise<RequestContext>;
    updateListFilters(listId: string, listFilterUpdateRequest: ListFilterUpdateRequest, enrollObjectsInWorkflows?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateName(listId: string, listName?: string, includeFilters?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class ListsApiResponseProcessor {
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListCreateResponse>>;
    doSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListSearchResponse>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListsByIdResponse>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFetchResponse>>;
    getByNameWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFetchResponse>>;
    removeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    restoreWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    updateListFiltersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListUpdateResponse>>;
    updateNameWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListUpdateResponse>>;
}
