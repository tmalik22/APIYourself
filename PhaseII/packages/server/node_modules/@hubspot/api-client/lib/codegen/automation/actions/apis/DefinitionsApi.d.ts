import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponsePublicActionDefinitionForwardPaging } from '../models/CollectionResponsePublicActionDefinitionForwardPaging';
import { PublicActionDefinition } from '../models/PublicActionDefinition';
import { PublicActionDefinitionEgg } from '../models/PublicActionDefinitionEgg';
import { PublicActionDefinitionPatch } from '../models/PublicActionDefinitionPatch';
export declare class DefinitionsApiRequestFactory extends BaseAPIRequestFactory {
    archive(definitionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, publicActionDefinitionEgg: PublicActionDefinitionEgg, _options?: Configuration): Promise<RequestContext>;
    getById(definitionId: string, appId: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(appId: number, limit?: number, after?: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    update(definitionId: string, appId: number, publicActionDefinitionPatch: PublicActionDefinitionPatch, _options?: Configuration): Promise<RequestContext>;
}
export declare class DefinitionsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionDefinition>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionDefinition>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponsePublicActionDefinitionForwardPaging>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicActionDefinition>>;
}
