"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectMembershipsApi = exports.ObjectMappingApi = exports.ObjectListsApi = exports.ObjectFoldersApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectFoldersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableFoldersApi(configuration, requestFactory, responseProcessor);
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.listFolderCreateRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.listFolderCreateRequest, options).toPromise();
    }
    getAllWithHttpInfo(param = {}, options) {
        return this.api.getAllWithHttpInfo(param.folderId, options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(param.folderId, options).toPromise();
    }
    moveWithHttpInfo(param, options) {
        return this.api.moveWithHttpInfo(param.folderId, param.newParentFolderId, options).toPromise();
    }
    move(param, options) {
        return this.api.move(param.folderId, param.newParentFolderId, options).toPromise();
    }
    moveListWithHttpInfo(param, options) {
        return this.api.moveListWithHttpInfo(param.listMoveRequest, options).toPromise();
    }
    moveList(param, options) {
        return this.api.moveList(param.listMoveRequest, options).toPromise();
    }
    removeWithHttpInfo(param, options) {
        return this.api.removeWithHttpInfo(param.folderId, options).toPromise();
    }
    remove(param, options) {
        return this.api.remove(param.folderId, options).toPromise();
    }
    renameWithHttpInfo(param, options) {
        return this.api.renameWithHttpInfo(param.folderId, param.newFolderName, options).toPromise();
    }
    rename(param, options) {
        return this.api.rename(param.folderId, param.newFolderName, options).toPromise();
    }
}
exports.ObjectFoldersApi = ObjectFoldersApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectListsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableListsApi(configuration, requestFactory, responseProcessor);
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.listCreateRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.listCreateRequest, options).toPromise();
    }
    doSearchWithHttpInfo(param, options) {
        return this.api.doSearchWithHttpInfo(param.listSearchRequest, options).toPromise();
    }
    doSearch(param, options) {
        return this.api.doSearch(param.listSearchRequest, options).toPromise();
    }
    getAllWithHttpInfo(param = {}, options) {
        return this.api.getAllWithHttpInfo(param.listIds, param.includeFilters, options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(param.listIds, param.includeFilters, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.listId, param.includeFilters, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.listId, param.includeFilters, options).toPromise();
    }
    getByNameWithHttpInfo(param, options) {
        return this.api.getByNameWithHttpInfo(param.listName, param.objectTypeId, param.includeFilters, options).toPromise();
    }
    getByName(param, options) {
        return this.api.getByName(param.listName, param.objectTypeId, param.includeFilters, options).toPromise();
    }
    removeWithHttpInfo(param, options) {
        return this.api.removeWithHttpInfo(param.listId, options).toPromise();
    }
    remove(param, options) {
        return this.api.remove(param.listId, options).toPromise();
    }
    restoreWithHttpInfo(param, options) {
        return this.api.restoreWithHttpInfo(param.listId, options).toPromise();
    }
    restore(param, options) {
        return this.api.restore(param.listId, options).toPromise();
    }
    updateListFiltersWithHttpInfo(param, options) {
        return this.api.updateListFiltersWithHttpInfo(param.listId, param.listFilterUpdateRequest, param.enrollObjectsInWorkflows, options).toPromise();
    }
    updateListFilters(param, options) {
        return this.api.updateListFilters(param.listId, param.listFilterUpdateRequest, param.enrollObjectsInWorkflows, options).toPromise();
    }
    updateNameWithHttpInfo(param, options) {
        return this.api.updateNameWithHttpInfo(param.listId, param.listName, param.includeFilters, options).toPromise();
    }
    updateName(param, options) {
        return this.api.updateName(param.listId, param.listName, param.includeFilters, options).toPromise();
    }
}
exports.ObjectListsApi = ObjectListsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectMappingApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableMappingApi(configuration, requestFactory, responseProcessor);
    }
    translateLegacyListIdToListIdWithHttpInfo(param = {}, options) {
        return this.api.translateLegacyListIdToListIdWithHttpInfo(param.legacyListId, options).toPromise();
    }
    translateLegacyListIdToListId(param = {}, options) {
        return this.api.translateLegacyListIdToListId(param.legacyListId, options).toPromise();
    }
    translateLegacyListIdToListIdBatchWithHttpInfo(param, options) {
        return this.api.translateLegacyListIdToListIdBatchWithHttpInfo(param.requestBody, options).toPromise();
    }
    translateLegacyListIdToListIdBatch(param, options) {
        return this.api.translateLegacyListIdToListIdBatch(param.requestBody, options).toPromise();
    }
}
exports.ObjectMappingApi = ObjectMappingApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectMembershipsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableMembershipsApi(configuration, requestFactory, responseProcessor);
    }
    addWithHttpInfo(param, options) {
        return this.api.addWithHttpInfo(param.listId, param.requestBody, options).toPromise();
    }
    add(param, options) {
        return this.api.add(param.listId, param.requestBody, options).toPromise();
    }
    addAllFromListWithHttpInfo(param, options) {
        return this.api.addAllFromListWithHttpInfo(param.listId, param.sourceListId, options).toPromise();
    }
    addAllFromList(param, options) {
        return this.api.addAllFromList(param.listId, param.sourceListId, options).toPromise();
    }
    addAndRemoveWithHttpInfo(param, options) {
        return this.api.addAndRemoveWithHttpInfo(param.listId, param.membershipChangeRequest, options).toPromise();
    }
    addAndRemove(param, options) {
        return this.api.addAndRemove(param.listId, param.membershipChangeRequest, options).toPromise();
    }
    getListsWithHttpInfo(param, options) {
        return this.api.getListsWithHttpInfo(param.objectTypeId, param.recordId, options).toPromise();
    }
    getLists(param, options) {
        return this.api.getLists(param.objectTypeId, param.recordId, options).toPromise();
    }
    getPageWithHttpInfo(param, options) {
        return this.api.getPageWithHttpInfo(param.listId, param.after, param.before, param.limit, options).toPromise();
    }
    getPage(param, options) {
        return this.api.getPage(param.listId, param.after, param.before, param.limit, options).toPromise();
    }
    getPageOrderedByAddedToListDateWithHttpInfo(param, options) {
        return this.api.getPageOrderedByAddedToListDateWithHttpInfo(param.listId, param.after, param.before, param.limit, options).toPromise();
    }
    getPageOrderedByAddedToListDate(param, options) {
        return this.api.getPageOrderedByAddedToListDate(param.listId, param.after, param.before, param.limit, options).toPromise();
    }
    removeWithHttpInfo(param, options) {
        return this.api.removeWithHttpInfo(param.listId, param.requestBody, options).toPromise();
    }
    remove(param, options) {
        return this.api.remove(param.listId, param.requestBody, options).toPromise();
    }
    removeAllWithHttpInfo(param, options) {
        return this.api.removeAllWithHttpInfo(param.listId, options).toPromise();
    }
    removeAll(param, options) {
        return this.api.removeAll(param.listId, options).toPromise();
    }
}
exports.ObjectMembershipsApi = ObjectMembershipsApi;
//# sourceMappingURL=ObjectParamAPI.js.map