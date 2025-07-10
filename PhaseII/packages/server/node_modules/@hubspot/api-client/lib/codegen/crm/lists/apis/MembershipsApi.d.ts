import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { ApiCollectionResponseJoinTimeAndRecordId } from '../models/ApiCollectionResponseJoinTimeAndRecordId';
import { ApiCollectionResponseRecordListMembershipNoPaging } from '../models/ApiCollectionResponseRecordListMembershipNoPaging';
import { MembershipChangeRequest } from '../models/MembershipChangeRequest';
import { MembershipsUpdateResponse } from '../models/MembershipsUpdateResponse';
export declare class MembershipsApiRequestFactory extends BaseAPIRequestFactory {
    add(listId: string, requestBody: Array<string>, _options?: Configuration): Promise<RequestContext>;
    addAllFromList(listId: string, sourceListId: string, _options?: Configuration): Promise<RequestContext>;
    addAndRemove(listId: string, membershipChangeRequest: MembershipChangeRequest, _options?: Configuration): Promise<RequestContext>;
    getLists(objectTypeId: string, recordId: string, _options?: Configuration): Promise<RequestContext>;
    getPage(listId: string, after?: string, before?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
    getPageOrderedByAddedToListDate(listId: string, after?: string, before?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
    remove(listId: string, requestBody: Array<string>, _options?: Configuration): Promise<RequestContext>;
    removeAll(listId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class MembershipsApiResponseProcessor {
    addWithHttpInfo(response: ResponseContext): Promise<HttpInfo<MembershipsUpdateResponse>>;
    addAllFromListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    addAndRemoveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<MembershipsUpdateResponse>>;
    getListsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ApiCollectionResponseRecordListMembershipNoPaging>>;
    getPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ApiCollectionResponseJoinTimeAndRecordId>>;
    getPageOrderedByAddedToListDateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ApiCollectionResponseJoinTimeAndRecordId>>;
    removeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<MembershipsUpdateResponse>>;
    removeAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
}
