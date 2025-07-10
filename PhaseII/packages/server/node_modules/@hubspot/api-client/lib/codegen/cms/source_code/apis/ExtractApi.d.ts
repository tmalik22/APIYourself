import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ActionResponse } from '../models/ActionResponse';
import { FileExtractRequest } from '../models/FileExtractRequest';
import { TaskLocator } from '../models/TaskLocator';
export declare class ExtractApiRequestFactory extends BaseAPIRequestFactory {
    doAsync(fileExtractRequest: FileExtractRequest, _options?: Configuration): Promise<RequestContext>;
    getAsyncStatus(taskId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class ExtractApiResponseProcessor {
    doAsyncWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TaskLocator>>;
    getAsyncStatusWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ActionResponse>>;
}
