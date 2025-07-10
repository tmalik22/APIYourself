"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRevisionsApi = exports.ObjectFunctionsApi = exports.ObjectDefinitionsApi = exports.ObjectCallbacksApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCallbacksApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCallbacksApi(configuration, requestFactory, responseProcessor);
    }
    completeWithHttpInfo(param, options) {
        return this.api.completeWithHttpInfo(param.callbackId, param.callbackCompletionRequest, options).toPromise();
    }
    complete(param, options) {
        return this.api.complete(param.callbackId, param.callbackCompletionRequest, options).toPromise();
    }
    completeBatchWithHttpInfo(param, options) {
        return this.api.completeBatchWithHttpInfo(param.batchInputCallbackCompletionBatchRequest, options).toPromise();
    }
    completeBatch(param, options) {
        return this.api.completeBatch(param.batchInputCallbackCompletionBatchRequest, options).toPromise();
    }
}
exports.ObjectCallbacksApi = ObjectCallbacksApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectDefinitionsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableDefinitionsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.definitionId, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.definitionId, param.appId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.appId, param.publicActionDefinitionEgg, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.appId, param.publicActionDefinitionEgg, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.definitionId, param.appId, param.archived, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.definitionId, param.appId, param.archived, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.appId, param.limit, param.after, param.archived, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.appId, param.limit, param.after, param.archived, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.definitionId, param.appId, param.publicActionDefinitionPatch, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.definitionId, param.appId, param.publicActionDefinitionPatch, options).toPromise();
    }
}
exports.ObjectDefinitionsApi = ObjectDefinitionsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectFunctionsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableFunctionsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.definitionId, param.functionType, param.functionId, param.appId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.definitionId, param.functionType, param.functionId, param.appId, options).toPromise();
    }
    archiveByFunctionTypeWithHttpInfo(param, options) {
        return this.api.archiveByFunctionTypeWithHttpInfo(param.definitionId, param.functionType, param.appId, options).toPromise();
    }
    archiveByFunctionType(param, options) {
        return this.api.archiveByFunctionType(param.definitionId, param.functionType, param.appId, options).toPromise();
    }
    createOrReplaceWithHttpInfo(param, options) {
        return this.api.createOrReplaceWithHttpInfo(param.definitionId, param.functionType, param.functionId, param.appId, param.body, options).toPromise();
    }
    createOrReplace(param, options) {
        return this.api.createOrReplace(param.definitionId, param.functionType, param.functionId, param.appId, param.body, options).toPromise();
    }
    createOrReplaceByFunctionTypeWithHttpInfo(param, options) {
        return this.api.createOrReplaceByFunctionTypeWithHttpInfo(param.definitionId, param.functionType, param.appId, param.body, options).toPromise();
    }
    createOrReplaceByFunctionType(param, options) {
        return this.api.createOrReplaceByFunctionType(param.definitionId, param.functionType, param.appId, param.body, options).toPromise();
    }
    getByFunctionTypeWithHttpInfo(param, options) {
        return this.api.getByFunctionTypeWithHttpInfo(param.definitionId, param.functionType, param.appId, options).toPromise();
    }
    getByFunctionType(param, options) {
        return this.api.getByFunctionType(param.definitionId, param.functionType, param.appId, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.definitionId, param.functionType, param.functionId, param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.definitionId, param.functionType, param.functionId, param.appId, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.definitionId, param.appId, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.definitionId, param.appId, options).toPromise();
    }
}
exports.ObjectFunctionsApi = ObjectFunctionsApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectRevisionsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableRevisionsApi(configuration, requestFactory, responseProcessor);
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.definitionId, param.revisionId, param.appId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.definitionId, param.revisionId, param.appId, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.definitionId, param.appId, param.limit, param.after, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.definitionId, param.appId, param.limit, param.after, options).toPromise();
    }
}
exports.ObjectRevisionsApi = ObjectRevisionsApi;
//# sourceMappingURL=ObjectParamAPI.js.map