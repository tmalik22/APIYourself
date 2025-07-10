"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSubscriptionsApi = exports.ObjectSettingsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    clearWithHttpInfo(param, options) {
        return this.api.clearWithHttpInfo(param.appId, options).toPromise();
    }
    clear(param, options) {
        return this.api.clear(param.appId, options).toPromise();
    }
    configureWithHttpInfo(param, options) {
        return this.api.configureWithHttpInfo(param.appId, param.settingsChangeRequest, options).toPromise();
    }
    configure(param, options) {
        return this.api.configure(param.appId, param.settingsChangeRequest, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.appId, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
}
exports.ObjectSettingsApi = ObjectSettingsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSubscriptionsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSubscriptionsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.subscriptionId, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.subscriptionId, param.appId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.appId, param.subscriptionCreateRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.subscriptionCreateRequest, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.appId, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.appId, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.subscriptionId, param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.subscriptionId, param.appId, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.subscriptionId, param.appId, param.subscriptionPatchRequest, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.subscriptionId, param.appId, param.subscriptionPatchRequest, options).toPromise();
    }
    updateBatchWithHttpInfo(param, options) {
        return this.api.updateBatchWithHttpInfo(param.appId, param.batchInputSubscriptionBatchUpdateRequest, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.appId, param.batchInputSubscriptionBatchUpdateRequest, options).toPromise();
    }
}
exports.ObjectSubscriptionsApi = ObjectSubscriptionsApi;
//# sourceMappingURL=ObjectParamAPI.js.map