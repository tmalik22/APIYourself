import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CollectionResponseSmtpApiTokenViewForwardPaging } from '../models/CollectionResponseSmtpApiTokenViewForwardPaging';
import { SmtpApiTokenRequestEgg } from '../models/SmtpApiTokenRequestEgg';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
export declare class PublicSMTPTokensApiRequestFactory extends BaseAPIRequestFactory {
    archiveToken(tokenId: string, _options?: Configuration): Promise<RequestContext>;
    createToken(smtpApiTokenRequestEgg: SmtpApiTokenRequestEgg, _options?: Configuration): Promise<RequestContext>;
    getTokenById(tokenId: string, _options?: Configuration): Promise<RequestContext>;
    getTokensPage(campaignName?: string, emailCampaignId?: string, after?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
    resetPassword(tokenId: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicSMTPTokensApiResponseProcessor {
    archiveTokenWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createTokenWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SmtpApiTokenView>>;
    getTokenByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SmtpApiTokenView>>;
    getTokensPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<CollectionResponseSmtpApiTokenViewForwardPaging>>;
    resetPasswordWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SmtpApiTokenView>>;
}
