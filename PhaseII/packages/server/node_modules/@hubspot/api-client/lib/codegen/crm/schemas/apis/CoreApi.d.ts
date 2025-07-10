import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AssociationDefinition } from '../models/AssociationDefinition';
import { AssociationDefinitionEgg } from '../models/AssociationDefinitionEgg';
import { CollectionResponseObjectSchemaNoPaging } from '../models/CollectionResponseObjectSchemaNoPaging';
import { ObjectSchema } from '../models/ObjectSchema';
import { ObjectSchemaEgg } from '../models/ObjectSchemaEgg';
import { ObjectTypeDefinition } from '../models/ObjectTypeDefinition';
import { ObjectTypeDefinitionPatch } from '../models/ObjectTypeDefinitionPatch';
export declare class CoreApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveAssociation(objectType: string, associationIdentifier: string, _options?: Configuration): Promise<RequestContext>;
    create(objectSchemaEgg: ObjectSchemaEgg, _options?: Configuration): Promise<RequestContext>;
    createAssociation(objectType: string, associationDefinitionEgg: AssociationDefinitionEgg, _options?: Configuration): Promise<RequestContext>;
    getAll(archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, objectTypeDefinitionPatch: ObjectTypeDefinitionPatch, _options?: Configuration): Promise<RequestContext>;
}
export declare class CoreApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    archiveAssociationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ObjectSchema>>;
    createAssociationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AssociationDefinition>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseObjectSchemaNoPaging>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ObjectSchema>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ObjectTypeDefinition>>;
}
