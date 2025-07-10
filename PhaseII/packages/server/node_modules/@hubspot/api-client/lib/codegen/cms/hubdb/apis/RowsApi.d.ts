import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { HubDbTableRowV3 } from '../models/HubDbTableRowV3';
import { HubDbTableRowV3Request } from '../models/HubDbTableRowV3Request';
import { UnifiedCollectionResponseWithTotalBaseHubDbTableRowV3 } from '../models/UnifiedCollectionResponseWithTotalBaseHubDbTableRowV3';
export declare class RowsApiRequestFactory extends BaseAPIRequestFactory {
    cloneDraftTableRow(tableIdOrName: string, rowId: string, name?: string, _options?: Configuration): Promise<RequestContext>;
    createTableRow(tableIdOrName: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
    getDraftTableRowById(tableIdOrName: string, rowId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getTableRow(tableIdOrName: string, rowId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getTableRows(tableIdOrName: string, sort?: Array<string>, after?: string, limit?: number, properties?: Array<string>, offset?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    purgeDraftTableRow(tableIdOrName: string, rowId: string, _options?: Configuration): Promise<RequestContext>;
    readDraftTableRows(tableIdOrName: string, sort?: Array<string>, after?: string, limit?: number, properties?: Array<string>, offset?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    replaceDraftTableRow(tableIdOrName: string, rowId: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
    updateDraftTableRow(tableIdOrName: string, rowId: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
}
export declare class RowsApiResponseProcessor {
    cloneDraftTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
    createTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
    getDraftTableRowByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
    getTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
    getTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<UnifiedCollectionResponseWithTotalBaseHubDbTableRowV3>>;
    purgeDraftTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    readDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<UnifiedCollectionResponseWithTotalBaseHubDbTableRowV3>>;
    replaceDraftTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
    updateDraftTableRowWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HubDbTableRowV3>>;
}
