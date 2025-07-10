"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectFormsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectFormsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableFormsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.formId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.formId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.formDefinitionCreateRequestBase, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.formDefinitionCreateRequestBase, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.formId, param.archived, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.formId, param.archived, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.after, param.limit, param.archived, param.formTypes, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.after, param.limit, param.archived, param.formTypes, options).toPromise();
    }
    replaceWithHttpInfo(param, options) {
        return this.api.replaceWithHttpInfo(param.formId, param.hubSpotFormDefinition, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.formId, param.hubSpotFormDefinition, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.formId, param.hubSpotFormDefinitionPatchRequest, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.formId, param.hubSpotFormDefinitionPatchRequest, options).toPromise();
    }
}
exports.ObjectFormsApi = ObjectFormsApi;
//# sourceMappingURL=ObjectParamAPI.js.map