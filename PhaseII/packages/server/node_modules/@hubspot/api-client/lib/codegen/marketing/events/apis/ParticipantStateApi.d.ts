import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AttendanceCounters } from '../models/AttendanceCounters';
import { CollectionResponseWithTotalParticipationBreakdownForwardPaging } from '../models/CollectionResponseWithTotalParticipationBreakdownForwardPaging';
export declare class ParticipantStateApiRequestFactory extends BaseAPIRequestFactory {
    getParticipationsBreakdownByContactId(contactIdentifier: string, state?: string, limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
    getParticipationsBreakdownByExternalEventId(externalAccountId: string, externalEventId: string, contactIdentifier?: string, state?: string, limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
    getParticipationsBreakdownByMarketingEventId(marketingEventId: number, contactIdentifier?: string, state?: string, limit?: number, after?: string, _options?: Configuration): Promise<RequestContext>;
    getParticipationsCountersByEventExternalId(externalAccountId: string, externalEventId: string, _options?: Configuration): Promise<RequestContext>;
    getParticipationsCountersByMarketingEventId(marketingEventId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class ParticipantStateApiResponseProcessor {
    getParticipationsBreakdownByContactIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalParticipationBreakdownForwardPaging>>;
    getParticipationsBreakdownByExternalEventIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalParticipationBreakdownForwardPaging>>;
    getParticipationsBreakdownByMarketingEventIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseWithTotalParticipationBreakdownForwardPaging>>;
    getParticipationsCountersByEventExternalIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AttendanceCounters>>;
    getParticipationsCountersByMarketingEventIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AttendanceCounters>>;
}
