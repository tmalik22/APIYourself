"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSearchApi = exports.ObjectBatchApi = exports.ObjectBasicApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBasicApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBasicApi(configuration, requestFactory, responseProcessor);
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.feedbackSubmissionId, param.properties, param.propertiesWithHistory, param.associations, param.archived, param.idProperty, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.feedbackSubmissionId, param.properties, param.propertiesWithHistory, param.associations, param.archived, param.idProperty, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.limit, param.after, param.properties, param.propertiesWithHistory, param.associations, param.archived, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.limit, param.after, param.properties, param.propertiesWithHistory, param.associations, param.archived, options).toPromise();
    }
}
exports.ObjectBasicApi = ObjectBasicApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectBatchApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableBatchApi(configuration, requestFactory, responseProcessor);
    }
    readWithHttpInfo(param, options) {
        return this.api.readWithHttpInfo(param.batchReadInputSimplePublicObjectId, param.archived, options).toPromise();
    }
    read(param, options) {
        return this.api.read(param.batchReadInputSimplePublicObjectId, param.archived, options).toPromise();
    }
}
exports.ObjectBatchApi = ObjectBatchApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectSearchApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableSearchApi(configuration, requestFactory, responseProcessor);
    }
    doSearchWithHttpInfo(param, options) {
        return this.api.doSearchWithHttpInfo(param.publicObjectSearchRequest, options).toPromise();
    }
    doSearch(param, options) {
        return this.api.doSearch(param.publicObjectSearchRequest, options).toPromise();
    }
}
exports.ObjectSearchApi = ObjectSearchApi;
//# sourceMappingURL=ObjectParamAPI.js.map