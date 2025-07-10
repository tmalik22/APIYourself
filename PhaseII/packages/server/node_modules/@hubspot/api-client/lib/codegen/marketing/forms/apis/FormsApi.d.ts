import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponseFormDefinitionBaseForwardPaging } from '../models/CollectionResponseFormDefinitionBaseForwardPaging';
import { FormDefinitionBase } from '../models/FormDefinitionBase';
import { FormDefinitionCreateRequestBase } from '../models/FormDefinitionCreateRequestBase';
import { HubSpotFormDefinition } from '../models/HubSpotFormDefinition';
import { HubSpotFormDefinitionPatchRequest } from '../models/HubSpotFormDefinitionPatchRequest';
export declare class FormsApiRequestFactory extends BaseAPIRequestFactory {
    archive(formId: string, _options?: Configuration): Promise<RequestContext>;
    create(formDefinitionCreateRequestBase: FormDefinitionCreateRequestBase, _options?: Configuration): Promise<RequestContext>;
    getById(formId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(after?: string, limit?: number, archived?: boolean, formTypes?: Array<'hubspot' | 'captured' | 'flow' | 'blog_comment' | 'all'>, _options?: Configuration): Promise<RequestContext>;
    replace(formId: string, hubSpotFormDefinition: HubSpotFormDefinition, _options?: Configuration): Promise<RequestContext>;
    update(formId: string, hubSpotFormDefinitionPatchRequest: HubSpotFormDefinitionPatchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class FormsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FormDefinitionBase>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FormDefinitionBase>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseFormDefinitionBaseForwardPaging>>;
    replaceWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FormDefinitionBase>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FormDefinitionBase>>;
}
