import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ListFolderCreateRequest } from '../models/ListFolderCreateRequest';
import { ListFolderCreateResponse } from '../models/ListFolderCreateResponse';
import { ListFolderFetchResponse } from '../models/ListFolderFetchResponse';
import { ListMoveRequest } from '../models/ListMoveRequest';
export declare class FoldersApiRequestFactory extends BaseAPIRequestFactory {
    create(listFolderCreateRequest: ListFolderCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(folderId?: string, _options?: Configuration): Promise<RequestContext>;
    move(folderId: string, newParentFolderId: string, _options?: Configuration): Promise<RequestContext>;
    moveList(listMoveRequest: ListMoveRequest, _options?: Configuration): Promise<RequestContext>;
    remove(folderId: string, _options?: Configuration): Promise<RequestContext>;
    rename(folderId: string, newFolderName?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class FoldersApiResponseProcessor {
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFolderCreateResponse>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFolderFetchResponse>>;
    moveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFolderFetchResponse>>;
    moveListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    removeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    renameWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ListFolderFetchResponse>>;
}
