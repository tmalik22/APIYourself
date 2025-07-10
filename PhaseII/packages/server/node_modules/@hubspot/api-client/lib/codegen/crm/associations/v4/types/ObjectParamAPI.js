"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectReportApi = exports.ObjectBatchApi = exports.ObjectBasicApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBasicApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBasicApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.objectType, param.objectId, param.toObjectType, param.toObjectId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.objectId, param.toObjectType, param.toObjectId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.objectType, param.objectId, param.toObjectType, param.toObjectId, param.associationSpec, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectType, param.objectId, param.toObjectType, param.toObjectId, param.associationSpec, options).toPromise();
    }
    createDefaultWithHttpInfo(param, options) {
        return this.api.createDefaultWithHttpInfo(param.fromObjectType, param.fromObjectId, param.toObjectType, param.toObjectId, options).toPromise();
    }
    createDefault(param, options) {
        return this.api.createDefault(param.fromObjectType, param.fromObjectId, param.toObjectType, param.toObjectId, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.objectType, param.objectId, param.toObjectType, param.after, param.limit, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.objectType, param.objectId, param.toObjectType, param.after, param.limit, options).toPromise();
    }
}
exports.ObjectBasicApi = ObjectBasicApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectBatchApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableBatchApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiArchive, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiArchive, options).toPromise();
    }
    archiveLabelsWithHttpInfo(param, options) {
        return this.api.archiveLabelsWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiPost, options).toPromise();
    }
    archiveLabels(param, options) {
        return this.api.archiveLabels(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiPost, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiPost, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociationMultiPost, options).toPromise();
    }
    createDefaultWithHttpInfo(param, options) {
        return this.api.createDefaultWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicDefaultAssociationMultiPost, options).toPromise();
    }
    createDefault(param, options) {
        return this.api.createDefault(param.fromObjectType, param.toObjectType, param.batchInputPublicDefaultAssociationMultiPost, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicFetchAssociationsBatchRequest, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.fromObjectType, param.toObjectType, param.batchInputPublicFetchAssociationsBatchRequest, options).toPromise();
    }
}
exports.ObjectBatchApi = ObjectBatchApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectReportApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableReportApi(configuration, requestFactory, responseProcessor);
    }
    requestWithHttpInfo(param, options) {
        return this.api.requestWithHttpInfo(param.userId, options).toPromise();
    }
    request(param, options) {
        return this.api.request(param.userId, options).toPromise();
    }
}
exports.ObjectReportApi = ObjectReportApi;
//# sourceMappingURL=ObjectParamAPI.js.map