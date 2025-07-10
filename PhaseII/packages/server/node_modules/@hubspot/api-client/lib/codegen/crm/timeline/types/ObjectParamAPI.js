"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTokensApi = exports.ObjectTemplatesApi = exports.ObjectEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.timelineEvent, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.timelineEvent, options).toPromise();
    }
    createBatchWithHttpInfo(param, options) {
        return this.api.createBatchWithHttpInfo(param.batchInputTimelineEvent, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputTimelineEvent, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getDetailByIdWithHttpInfo(param, options) {
        return this.api.getDetailByIdWithHttpInfo(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getDetailById(param, options) {
        return this.api.getDetailById(param.eventTemplateId, param.eventId, options).toPromise();
    }
    getRenderByIdWithHttpInfo(param, options) {
        return this.api.getRenderByIdWithHttpInfo(param.eventTemplateId, param.eventId, param.detail, options).toPromise();
    }
    getRenderById(param, options) {
        return this.api.getRenderById(param.eventTemplateId, param.eventId, param.detail, options).toPromise();
    }
}
exports.ObjectEventsApi = ObjectEventsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectTemplatesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTemplatesApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.eventTemplateId, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.eventTemplateId, param.appId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.appId, param.timelineEventTemplateCreateRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.timelineEventTemplateCreateRequest, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.appId, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.eventTemplateId, param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.eventTemplateId, param.appId, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.eventTemplateId, param.appId, param.timelineEventTemplateUpdateRequest, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.eventTemplateId, param.appId, param.timelineEventTemplateUpdateRequest, options).toPromise();
    }
}
exports.ObjectTemplatesApi = ObjectTemplatesApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableTokensApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.eventTemplateId, param.tokenName, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.eventTemplateId, param.tokenName, param.appId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.eventTemplateId, param.appId, param.timelineEventTemplateToken, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.eventTemplateId, param.appId, param.timelineEventTemplateToken, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.eventTemplateId, param.tokenName, param.appId, param.timelineEventTemplateTokenUpdateRequest, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.eventTemplateId, param.tokenName, param.appId, param.timelineEventTemplateTokenUpdateRequest, options).toPromise();
    }
}
exports.ObjectTokensApi = ObjectTokensApi;
//# sourceMappingURL=ObjectParamAPI.js.map