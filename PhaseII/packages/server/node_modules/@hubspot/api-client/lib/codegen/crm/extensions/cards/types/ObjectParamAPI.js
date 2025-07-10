"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSampleResponseApi = exports.ObjectCardsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCardsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCardsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.cardId, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.cardId, param.appId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.appId, param.cardCreateRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.cardCreateRequest, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.appId, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.cardId, param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.cardId, param.appId, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.cardId, param.appId, param.cardPatchRequest, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.cardId, param.appId, param.cardPatchRequest, options).toPromise();
    }
}
exports.ObjectCardsApi = ObjectCardsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSampleResponseApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSampleResponseApi(configuration, requestFactory, responseProcessor);
    }
    getCardsSampleResponseWithHttpInfo(param = {}, options) {
        return this.api.getCardsSampleResponseWithHttpInfo(options).toPromise();
    }
    getCardsSampleResponse(param = {}, options) {
        return this.api.getCardsSampleResponse(options).toPromise();
    }
}
exports.ObjectSampleResponseApi = ObjectSampleResponseApi;
//# sourceMappingURL=ObjectParamAPI.js.map