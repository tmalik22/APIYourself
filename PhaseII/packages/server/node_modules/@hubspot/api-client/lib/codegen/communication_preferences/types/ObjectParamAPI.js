"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectStatusApi = exports.ObjectDefinitionApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectDefinitionApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDefinitionApi(configuration, requestFactory, responseProcessor);
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(options).toPromise();
    }
}
exports.ObjectDefinitionApi = ObjectDefinitionApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectStatusApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableStatusApi(configuration, requestFactory, responseProcessor);
    }
    getEmailStatusWithHttpInfo(param, options) {
        return this.api.getEmailStatusWithHttpInfo(param.emailAddress, options).toPromise();
    }
    getEmailStatus(param, options) {
        return this.api.getEmailStatus(param.emailAddress, options).toPromise();
    }
    subscribeWithHttpInfo(param, options) {
        return this.api.subscribeWithHttpInfo(param.publicUpdateSubscriptionStatusRequest, options).toPromise();
    }
    subscribe(param, options) {
        return this.api.subscribe(param.publicUpdateSubscriptionStatusRequest, options).toPromise();
    }
    unsubscribeWithHttpInfo(param, options) {
        return this.api.unsubscribeWithHttpInfo(param.publicUpdateSubscriptionStatusRequest, options).toPromise();
    }
    unsubscribe(param, options) {
        return this.api.unsubscribe(param.publicUpdateSubscriptionStatusRequest, options).toPromise();
    }
}
exports.ObjectStatusApi = ObjectStatusApi;
//# sourceMappingURL=ObjectParamAPI.js.map