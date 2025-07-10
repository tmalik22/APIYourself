"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectCoreApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCoreApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCoreApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.objectType, param.archived, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.archived, options).toPromise();
    }
    archiveAssociationWithHttpInfo(param, options) {
        return this.api.archiveAssociationWithHttpInfo(param.objectType, param.associationIdentifier, options).toPromise();
    }
    archiveAssociation(param, options) {
        return this.api.archiveAssociation(param.objectType, param.associationIdentifier, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.objectSchemaEgg, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectSchemaEgg, options).toPromise();
    }
    createAssociationWithHttpInfo(param, options) {
        return this.api.createAssociationWithHttpInfo(param.objectType, param.associationDefinitionEgg, options).toPromise();
    }
    createAssociation(param, options) {
        return this.api.createAssociation(param.objectType, param.associationDefinitionEgg, options).toPromise();
    }
    getAllWithHttpInfo(param = {}, options) {
        return this.api.getAllWithHttpInfo(param.archived, options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(param.archived, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectType, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectType, param.objectTypeDefinitionPatch, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.objectTypeDefinitionPatch, options).toPromise();
    }
}
exports.ObjectCoreApi = ObjectCoreApi;
//# sourceMappingURL=ObjectParamAPI.js.map