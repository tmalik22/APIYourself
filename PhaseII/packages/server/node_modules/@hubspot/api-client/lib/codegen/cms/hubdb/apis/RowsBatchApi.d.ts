import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { BatchInputHubDbTableRowBatchCloneRequest } from '../models/BatchInputHubDbTableRowBatchCloneRequest';
import { BatchInputHubDbTableRowV3BatchUpdateRequest } from '../models/BatchInputHubDbTableRowV3BatchUpdateRequest';
import { BatchInputHubDbTableRowV3Request } from '../models/BatchInputHubDbTableRowV3Request';
import { BatchInputString } from '../models/BatchInputString';
import { BatchResponseHubDbTableRowV3 } from '../models/BatchResponseHubDbTableRowV3';
import { BatchResponseHubDbTableRowV3WithErrors } from '../models/BatchResponseHubDbTableRowV3WithErrors';
export declare class RowsBatchApiRequestFactory extends BaseAPIRequestFactory {
    cloneDraftTableRows(tableIdOrName: string, batchInputHubDbTableRowBatchCloneRequest: BatchInputHubDbTableRowBatchCloneRequest, _options?: Configuration): Promise<RequestContext>;
    createDraftTableRows(tableIdOrName: string, batchInputHubDbTableRowV3Request: BatchInputHubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
    purgeDraftTableRows(tableIdOrName: string, batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    readDraftTableRows(tableIdOrName: string, batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    readTableRows(tableIdOrName: string, batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    replaceDraftTableRows(tableIdOrName: string, batchInputHubDbTableRowV3BatchUpdateRequest: BatchInputHubDbTableRowV3BatchUpdateRequest, _options?: Configuration): Promise<RequestContext>;
    updateDraftTableRows(tableIdOrName: string, batchInputHubDbTableRowV3BatchUpdateRequest: BatchInputHubDbTableRowV3BatchUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class RowsBatchApiResponseProcessor {
    cloneDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3>>;
    createDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3 | BatchResponseHubDbTableRowV3WithErrors>>;
    purgeDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    readDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3 | BatchResponseHubDbTableRowV3WithErrors>>;
    readTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3 | BatchResponseHubDbTableRowV3WithErrors>>;
    replaceDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3 | BatchResponseHubDbTableRowV3WithErrors>>;
    updateDraftTableRowsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<BatchResponseHubDbTableRowV3 | BatchResponseHubDbTableRowV3WithErrors>>;
}
