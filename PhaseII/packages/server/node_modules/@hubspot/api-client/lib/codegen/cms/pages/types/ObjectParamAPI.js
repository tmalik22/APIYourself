"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSitePagesApi = exports.ObjectLandingPagesApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectLandingPagesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableLandingPagesApi(configuration, requestFactory, responseProcessor);
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
    archiveFolderWithHttpInfo(param, options) {
        return this.api.archiveFolderWithHttpInfo(param.objectId, param.archived, options).toPromise();
    }
    archiveFolder(param, options) {
        return this.api.archiveFolder(param.objectId, param.archived, options).toPromise();
    }
    archiveFoldersWithHttpInfo(param, options) {
        return this.api.archiveFoldersWithHttpInfo(param.batchInputString, options).toPromise();
    }
    archiveFolders(param, options) {
        return this.api.archiveFolders(param.batchInputString, options).toPromise();
    }
    attachToLangGroupWithHttpInfo(param, options) {
        return this.api.attachToLangGroupWithHttpInfo(param.attachToLangPrimaryRequestVNext, options).toPromise();
    }
    attachToLangGroup(param, options) {
        return this.api.attachToLangGroup(param.attachToLangPrimaryRequestVNext, options).toPromise();
    }
    cloneWithHttpInfo(param, options) {
        return this.api.cloneWithHttpInfo(param.contentCloneRequestVNext, options).toPromise();
    }
    clone(param, options) {
        return this.api.clone(param.contentCloneRequestVNext, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.page, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.page, options).toPromise();
    }
    createABTestVariationWithHttpInfo(param, options) {
        return this.api.createABTestVariationWithHttpInfo(param.abTestCreateRequestVNext, options).toPromise();
    }
    createABTestVariation(param, options) {
        return this.api.createABTestVariation(param.abTestCreateRequestVNext, options).toPromise();
    }
    createBatchWithHttpInfo(param, options) {
        return this.api.createBatchWithHttpInfo(param.batchInputPage, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputPage, options).toPromise();
    }
    createFolderWithHttpInfo(param, options) {
        return this.api.createFolderWithHttpInfo(param.contentFolder, options).toPromise();
    }
    createFolder(param, options) {
        return this.api.createFolder(param.contentFolder, options).toPromise();
    }
    createFoldersWithHttpInfo(param, options) {
        return this.api.createFoldersWithHttpInfo(param.batchInputContentFolder, options).toPromise();
    }
    createFolders(param, options) {
        return this.api.createFolders(param.batchInputContentFolder, options).toPromise();
    }
    createLangVariationWithHttpInfo(param, options) {
        return this.api.createLangVariationWithHttpInfo(param.contentLanguageCloneRequestVNext, options).toPromise();
    }
    createLangVariation(param, options) {
        return this.api.createLangVariation(param.contentLanguageCloneRequestVNext, options).toPromise();
    }
    detachFromLangGroupWithHttpInfo(param, options) {
        return this.api.detachFromLangGroupWithHttpInfo(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    detachFromLangGroup(param, options) {
        return this.api.detachFromLangGroup(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    endActiveABTestWithHttpInfo(param, options) {
        return this.api.endActiveABTestWithHttpInfo(param.abTestEndRequestVNext, options).toPromise();
    }
    endActiveABTest(param, options) {
        return this.api.endActiveABTest(param.abTestEndRequestVNext, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectId, param.archived, param.property, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectId, param.archived, param.property, options).toPromise();
    }
    getDraftByIdWithHttpInfo(param, options) {
        return this.api.getDraftByIdWithHttpInfo(param.objectId, options).toPromise();
    }
    getDraftById(param, options) {
        return this.api.getDraftById(param.objectId, options).toPromise();
    }
    getFolderByIdWithHttpInfo(param, options) {
        return this.api.getFolderByIdWithHttpInfo(param.objectId, param.archived, param.property, options).toPromise();
    }
    getFolderById(param, options) {
        return this.api.getFolderById(param.objectId, param.archived, param.property, options).toPromise();
    }
    getFolderPreviousVersionWithHttpInfo(param, options) {
        return this.api.getFolderPreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    getFolderPreviousVersion(param, options) {
        return this.api.getFolderPreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    getFolderPreviousVersionsWithHttpInfo(param, options) {
        return this.api.getFolderPreviousVersionsWithHttpInfo(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    getFolderPreviousVersions(param, options) {
        return this.api.getFolderPreviousVersions(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    getFoldersPageWithHttpInfo(param = {}, options) {
        return this.api.getFoldersPageWithHttpInfo(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getFoldersPage(param = {}, options) {
        return this.api.getFoldersPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPreviousVersionWithHttpInfo(param, options) {
        return this.api.getPreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    getPreviousVersion(param, options) {
        return this.api.getPreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    getPreviousVersionsWithHttpInfo(param, options) {
        return this.api.getPreviousVersionsWithHttpInfo(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    getPreviousVersions(param, options) {
        return this.api.getPreviousVersions(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    pushLiveWithHttpInfo(param, options) {
        return this.api.pushLiveWithHttpInfo(param.objectId, options).toPromise();
    }
    pushLive(param, options) {
        return this.api.pushLive(param.objectId, options).toPromise();
    }
    readBatchWithHttpInfo(param, options) {
        return this.api.readBatchWithHttpInfo(param.batchInputString, param.archived, options).toPromise();
    }
    readBatch(param, options) {
        return this.api.readBatch(param.batchInputString, param.archived, options).toPromise();
    }
    readFoldersWithHttpInfo(param, options) {
        return this.api.readFoldersWithHttpInfo(param.batchInputString, param.archived, options).toPromise();
    }
    readFolders(param, options) {
        return this.api.readFolders(param.batchInputString, param.archived, options).toPromise();
    }
    rerunPreviousABTestWithHttpInfo(param, options) {
        return this.api.rerunPreviousABTestWithHttpInfo(param.abTestRerunRequestVNext, options).toPromise();
    }
    rerunPreviousABTest(param, options) {
        return this.api.rerunPreviousABTest(param.abTestRerunRequestVNext, options).toPromise();
    }
    resetDraftWithHttpInfo(param, options) {
        return this.api.resetDraftWithHttpInfo(param.objectId, options).toPromise();
    }
    resetDraft(param, options) {
        return this.api.resetDraft(param.objectId, options).toPromise();
    }
    restoreFolderPreviousVersionWithHttpInfo(param, options) {
        return this.api.restoreFolderPreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    restoreFolderPreviousVersion(param, options) {
        return this.api.restoreFolderPreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionWithHttpInfo(param, options) {
        return this.api.restorePreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersion(param, options) {
        return this.api.restorePreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionToDraftWithHttpInfo(param, options) {
        return this.api.restorePreviousVersionToDraftWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionToDraft(param, options) {
        return this.api.restorePreviousVersionToDraft(param.objectId, param.revisionId, options).toPromise();
    }
    scheduleWithHttpInfo(param, options) {
        return this.api.scheduleWithHttpInfo(param.contentScheduleRequestVNext, options).toPromise();
    }
    schedule(param, options) {
        return this.api.schedule(param.contentScheduleRequestVNext, options).toPromise();
    }
    setLangPrimaryWithHttpInfo(param, options) {
        return this.api.setLangPrimaryWithHttpInfo(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    setLangPrimary(param, options) {
        return this.api.setLangPrimary(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectId, param.page, param.archived, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectId, param.page, param.archived, options).toPromise();
    }
    updateBatchWithHttpInfo(param, options) {
        return this.api.updateBatchWithHttpInfo(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateDraftWithHttpInfo(param, options) {
        return this.api.updateDraftWithHttpInfo(param.objectId, param.page, options).toPromise();
    }
    updateDraft(param, options) {
        return this.api.updateDraft(param.objectId, param.page, options).toPromise();
    }
    updateFolderWithHttpInfo(param, options) {
        return this.api.updateFolderWithHttpInfo(param.objectId, param.contentFolder, param.archived, options).toPromise();
    }
    updateFolder(param, options) {
        return this.api.updateFolder(param.objectId, param.contentFolder, param.archived, options).toPromise();
    }
    updateFoldersWithHttpInfo(param, options) {
        return this.api.updateFoldersWithHttpInfo(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateFolders(param, options) {
        return this.api.updateFolders(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateLangsWithHttpInfo(param, options) {
        return this.api.updateLangsWithHttpInfo(param.updateLanguagesRequestVNext, options).toPromise();
    }
    updateLangs(param, options) {
        return this.api.updateLangs(param.updateLanguagesRequestVNext, options).toPromise();
    }
}
exports.ObjectLandingPagesApi = ObjectLandingPagesApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSitePagesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSitePagesApi(configuration, requestFactory, responseProcessor);
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
    cloneWithHttpInfo(param, options) {
        return this.api.cloneWithHttpInfo(param.contentCloneRequestVNext, options).toPromise();
    }
    clone(param, options) {
        return this.api.clone(param.contentCloneRequestVNext, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.page, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.page, options).toPromise();
    }
    createABTestVariationWithHttpInfo(param, options) {
        return this.api.createABTestVariationWithHttpInfo(param.abTestCreateRequestVNext, options).toPromise();
    }
    createABTestVariation(param, options) {
        return this.api.createABTestVariation(param.abTestCreateRequestVNext, options).toPromise();
    }
    createBatchWithHttpInfo(param, options) {
        return this.api.createBatchWithHttpInfo(param.batchInputPage, options).toPromise();
    }
    createBatch(param, options) {
        return this.api.createBatch(param.batchInputPage, options).toPromise();
    }
    createLangVariationWithHttpInfo(param, options) {
        return this.api.createLangVariationWithHttpInfo(param.contentLanguageCloneRequestVNext, options).toPromise();
    }
    createLangVariation(param, options) {
        return this.api.createLangVariation(param.contentLanguageCloneRequestVNext, options).toPromise();
    }
    detachFromLangGroupWithHttpInfo(param, options) {
        return this.api.detachFromLangGroupWithHttpInfo(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    detachFromLangGroup(param, options) {
        return this.api.detachFromLangGroup(param.detachFromLangGroupRequestVNext, options).toPromise();
    }
    endActiveABTestWithHttpInfo(param, options) {
        return this.api.endActiveABTestWithHttpInfo(param.abTestEndRequestVNext, options).toPromise();
    }
    endActiveABTest(param, options) {
        return this.api.endActiveABTest(param.abTestEndRequestVNext, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectId, param.archived, param.property, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectId, param.archived, param.property, options).toPromise();
    }
    getDraftByIdWithHttpInfo(param, options) {
        return this.api.getDraftByIdWithHttpInfo(param.objectId, options).toPromise();
    }
    getDraftById(param, options) {
        return this.api.getDraftById(param.objectId, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.createdAt, param.createdAfter, param.createdBefore, param.updatedAt, param.updatedAfter, param.updatedBefore, param.sort, param.after, param.limit, param.archived, param.property, options).toPromise();
    }
    getPreviousVersionWithHttpInfo(param, options) {
        return this.api.getPreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    getPreviousVersion(param, options) {
        return this.api.getPreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    getPreviousVersionsWithHttpInfo(param, options) {
        return this.api.getPreviousVersionsWithHttpInfo(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    getPreviousVersions(param, options) {
        return this.api.getPreviousVersions(param.objectId, param.after, param.before, param.limit, options).toPromise();
    }
    pushLiveWithHttpInfo(param, options) {
        return this.api.pushLiveWithHttpInfo(param.objectId, options).toPromise();
    }
    pushLive(param, options) {
        return this.api.pushLive(param.objectId, options).toPromise();
    }
    readBatchWithHttpInfo(param, options) {
        return this.api.readBatchWithHttpInfo(param.batchInputString, param.archived, options).toPromise();
    }
    readBatch(param, options) {
        return this.api.readBatch(param.batchInputString, param.archived, options).toPromise();
    }
    rerunPreviousABTestWithHttpInfo(param, options) {
        return this.api.rerunPreviousABTestWithHttpInfo(param.abTestRerunRequestVNext, options).toPromise();
    }
    rerunPreviousABTest(param, options) {
        return this.api.rerunPreviousABTest(param.abTestRerunRequestVNext, options).toPromise();
    }
    resetDraftWithHttpInfo(param, options) {
        return this.api.resetDraftWithHttpInfo(param.objectId, options).toPromise();
    }
    resetDraft(param, options) {
        return this.api.resetDraft(param.objectId, options).toPromise();
    }
    restorePreviousVersionWithHttpInfo(param, options) {
        return this.api.restorePreviousVersionWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersion(param, options) {
        return this.api.restorePreviousVersion(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionToDraftWithHttpInfo(param, options) {
        return this.api.restorePreviousVersionToDraftWithHttpInfo(param.objectId, param.revisionId, options).toPromise();
    }
    restorePreviousVersionToDraft(param, options) {
        return this.api.restorePreviousVersionToDraft(param.objectId, param.revisionId, options).toPromise();
    }
    scheduleWithHttpInfo(param, options) {
        return this.api.scheduleWithHttpInfo(param.contentScheduleRequestVNext, options).toPromise();
    }
    schedule(param, options) {
        return this.api.schedule(param.contentScheduleRequestVNext, options).toPromise();
    }
    setLangPrimaryWithHttpInfo(param, options) {
        return this.api.setLangPrimaryWithHttpInfo(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    setLangPrimary(param, options) {
        return this.api.setLangPrimary(param.setNewLanguagePrimaryRequestVNext, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectId, param.page, param.archived, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectId, param.page, param.archived, options).toPromise();
    }
    updateBatchWithHttpInfo(param, options) {
        return this.api.updateBatchWithHttpInfo(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateBatch(param, options) {
        return this.api.updateBatch(param.batchInputJsonNode, param.archived, options).toPromise();
    }
    updateDraftWithHttpInfo(param, options) {
        return this.api.updateDraftWithHttpInfo(param.objectId, param.page, options).toPromise();
    }
    updateDraft(param, options) {
        return this.api.updateDraft(param.objectId, param.page, options).toPromise();
    }
    updateLangsWithHttpInfo(param, options) {
        return this.api.updateLangsWithHttpInfo(param.updateLanguagesRequestVNext, options).toPromise();
    }
    updateLangs(param, options) {
        return this.api.updateLangs(param.updateLanguagesRequestVNext, options).toPromise();
    }
}
exports.ObjectSitePagesApi = ObjectSitePagesApi;
//# sourceMappingURL=ObjectParamAPI.js.map