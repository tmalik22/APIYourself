"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRedirectsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectRedirectsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableRedirectsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.urlRedirectId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.urlRedirectId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.urlMappingCreateRequestBody, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.urlMappingCreateRequestBody, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.urlRedirectId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.urlRedirectId, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.urlRedirectId, param.urlMapping, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.urlRedirectId, param.urlMapping, options).toPromise();
    }
}
exports.ObjectRedirectsApi = ObjectRedirectsApi;
//# sourceMappingURL=ObjectParamAPI.js.map