import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { CardCreateRequest } from '../models/CardCreateRequest';
import { CardPatchRequest } from '../models/CardPatchRequest';
import { PublicCardListResponse } from '../models/PublicCardListResponse';
import { PublicCardResponse } from '../models/PublicCardResponse';
export declare class CardsApiRequestFactory extends BaseAPIRequestFactory {
    archive(cardId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, cardCreateRequest: CardCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(cardId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    update(cardId: string, appId: number, cardPatchRequest: CardPatchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class CardsApiResponseProcessor {
    archiveWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void>>;
    createWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicCardResponse>>;
    getAllWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicCardListResponse>>;
    getByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicCardResponse>>;
    updateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PublicCardResponse>>;
}
