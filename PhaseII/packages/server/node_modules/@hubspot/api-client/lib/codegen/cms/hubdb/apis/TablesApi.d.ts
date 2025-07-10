import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { CollectionResponseWithTotalHubDbTableV3ForwardPaging } from '../models/CollectionResponseWithTotalHubDbTableV3ForwardPaging';
import { HubDbTableCloneRequest } from '../models/HubDbTableCloneRequest';
import { HubDbTableV3 } from '../models/HubDbTableV3';
import { HubDbTableV3Request } from '../models/HubDbTableV3Request';
import { ImportResult } from '../models/ImportResult';
export declare class TablesApiRequestFactory extends BaseAPIRequestFactory {
    archiveTable(tableIdOrName: string, _options?: Configuration): Promise<RequestContext>;
    cloneDraftTable(tableIdOrName: string, hubDbTableCloneRequest: HubDbTableCloneRequest, _options?: Configuration): Promise<RequestContext>;
    createTable(hubDbTableV3Request: HubDbTableV3Request, _options?: Configuration): Promise<RequestContext>;
    exportDraftTable(tableIdOrName: string, format?: string, _options?: Configuration): Promise<RequestContext>;
    exportTable(tableIdOrName: string, format?: string, _options?: Configuration): Promise<RequestContext>;
    getAllDraftTables(sort?: Array<string>, after?: string, limit?: number, createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, contentType?: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getAllTables(sort?: Array<string>, after?: string, limit?: number, createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, contentType?: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getDraftTableDetailsById(tableIdOrName: string, isGetLocalizedSchema?: boolean, archived?: boolean, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
    getTableDetails(tableIdOrName: string, isGetLocalizedSchema?: boolean, archived?: boolean, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
    importDraftTable(tableIdOrName: string, config?: string, file?: HttpFile, _options?: Configuration): Promise<RequestContext>;
    publishDraftTable(tableIdOrName: string, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
    resetDraftTable(tableIdOrName: string, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
    unpublishTable(tableIdOrName: string, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateDraftTable(tableIdOrName: string, hubDbTableV3Request: HubDbTableV3Request, isGetLocalizedSchema?: boolean, archived?: boolean, includeForeignIds?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class TablesApiResponseProcessor {
    archiveTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    cloneDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    createTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    exportDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    exportTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    getAllDraftTablesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalHubDbTableV3ForwardPaging>>;
    getAllTablesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalHubDbTableV3ForwardPaging>>;
    getDraftTableDetailsByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    getTableDetailsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    importDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ImportResult>>;
    publishDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    resetDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    unpublishTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
    updateDraftTableWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableV3>>;
}
