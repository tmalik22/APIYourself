import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { PublicBatchMigrationMapping } from '../models/PublicBatchMigrationMapping';
import { PublicMigrationMapping } from '../models/PublicMigrationMapping';
export declare class MappingApiRequestFactory extends BaseAPIRequestFactory {
    translateLegacyListIdToListId(legacyListId?: string, _options?: Configuration): Promise<RequestContext>;
    translateLegacyListIdToListIdBatch(requestBody: Array<string>, _options?: Configuration): Promise<RequestContext>;
}
export declare class MappingApiResponseProcessor {
    translateLegacyListIdToListIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicMigrationMapping>>;
    translateLegacyListIdToListIdBatchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicBatchMigrationMapping>>;
}
