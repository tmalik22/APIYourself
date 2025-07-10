"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBlogAuthorsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectBlogAuthorsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableBlogAuthorsApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.objectId, param.archived, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.objectId, param.archived, options).toPromise();
    }
    archiveBatchWithHttpInfo(param, options) {
        return this.api.archiveBatchWithHttpInfo(param.batchInputString, options).toPromise();
    }
    archiveBatch(param, options) {
        return this.api.archiveBatch(param.batchInputString, options).toPromise();
    }
    attachToLangGroupWithHttpInfo(param, options) {
        return this.api.attachToLangGroupWithHttpInfo(param.attachToLangPrimaryRequestVNext, options).toPromise();
    }
    attachToLangGroup(param, options) {
        return this.api.attachToLangGroup(param.attachToLangPrimaryRequestVNext, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.blogAuthor, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.blogAuthor, options).toPromise();
    }
    createBatchWithHttpInfo(param, options) {
        return this.api.createBatchWithHttpInfo(param.batchInputBlogAuthor, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputBlogAuthor, options).toPromise();
    }
    createLangVariationWithHttpInfo(param, options) {
        return this.api.createLangVariationWithHttpInfo(param.blogAuthorCloneRequestVNext, options).toPromise();
    }
    createLangVariation(param, options) {
        return this.api.createLangVariation(param.blogAuthorCloneRequestVNext, options).toPromise();
    }
    detachFromLangGroupWithHttpInfo(param, options) {
        return this.api.detachFromLangGroupWithHttpInfo(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    detachFromLangGroup(param, options) {
        return this.api.detachFromLangGroup(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectId, param.archived, param.property, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectId, param.archived, param.property, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    readBatchWithHttpInfo(param, options) {
        return this.api.readBatchWithHttpInfo(param.batchInputString, param.archived, options).toPromise();
    }
    readBatch(param, options) {
        return this.api.readBatch(param.batchInputString, param.archived, options).toPromise();
    }
    setLangPrimaryWithHttpInfo(param, options) {
        return this.api.setLangPrimaryWithHttpInfo(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    setLangPrimary(param, options) {
        return this.api.setLangPrimary(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectId, param.blogAuthor, param.archived, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectId, param.blogAuthor, param.archived, options).toPromise();
    }
    updateBatchWithHttpInfo(param, options) {
        return this.api.updateBatchWithHttpInfo(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateLangsWithHttpInfo(param, options) {
        return this.api.updateLangsWithHttpInfo(param.updateLanguagesRequestVNext, options).toPromise();
    }
    updateLangs(param, options) {
        return this.api.updateLangs(param.updateLanguagesRequestVNext, options).toPromise();
    }
}
exports.ObjectBlogAuthorsApi = ObjectBlogAuthorsApi;
//# sourceMappingURL=ObjectParamAPI.js.map