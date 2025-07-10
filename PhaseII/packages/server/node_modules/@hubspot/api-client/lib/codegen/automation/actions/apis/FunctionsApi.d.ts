import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicActionFunctionIdentifierNoPaging } from '../models/CollectionResponsePublicActionFunctionIdentifierNoPaging';
import { PublicActionFunction } from '../models/PublicActionFunction';
import { PublicActionFunctionIdentifier } from '../models/PublicActionFunctionIdentifier';
export declare class FunctionsApiRequestFactory extends BaseAPIRequestFactory {
    archive(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', functionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    archiveByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', appId: number, _options?: Configuration): Promise<RequestContext>;
    createOrReplace(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', functionId: string, appId: number, body: string, _options?: Configuration): Promise<RequestContext>;
    createOrReplaceByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', appId: number, body: string, _options?: Configuration): Promise<RequestContext>;
    getByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS' | 'POST_ACTION_EXECUTION', functionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    getPage(definitionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class FunctionsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    archiveByFunctionTypeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createOrReplaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionFunctionIdentifier>>;
    createOrReplaceByFunctionTypeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionFunctionIdentifier>>;
    getByFunctionTypeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionFunction>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionFunction>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicActionFunctionIdentifierNoPaging>>;
}
