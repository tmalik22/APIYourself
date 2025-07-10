"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBatchApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBatchApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBatchApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociation, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociation, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociation, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.fromObjectType, param.toObjectType, param.batchInputPublicAssociation, options).toPromise();
    }
    readWithHttpInfo(param, options) {
        return this.api.readWithHttpInfo(param.fromObjectType, param.toObjectType, param.batchInputPublicObjectId, options).toPromise();
    }
    read(param, options) {
        return this.api.read(param.fromObjectType, param.toObjectType, param.batchInputPublicObjectId, options).toPromise();
    }
}
exports.ObjectBatchApi = ObjectBatchApi;
//# sourceMappingURL=ObjectParamAPI.js.map