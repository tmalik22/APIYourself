"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUsersApi = exports.ObjectTeamsApi = exports.ObjectRolesApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectRolesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableRolesApi(configuration, requestFactory, responseProcessor);
    }
    getAllWithHttpInfo(param = {}, options) {
        return this.api.getAllWithHttpInfo(options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(options).toPromise();
    }
}
exports.ObjectRolesApi = ObjectRolesApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectTeamsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableTeamsApi(configuration, requestFactory, responseProcessor);
    }
    getAllWithHttpInfo(param = {}, options) {
        return this.api.getAllWithHttpInfo(options).toPromise();
    }
    getAll(param = {}, options) {
        return this.api.getAll(options).toPromise();
    }
}
exports.ObjectTeamsApi = ObjectTeamsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectUsersApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.userId, param.idProperty, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.userId, param.idProperty, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.userProvisionRequest, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.userProvisionRequest, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.userId, param.idProperty, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.userId, param.idProperty, options).toPromise();
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.limit, param.after, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.limit, param.after, options).toPromise();
    }
    replaceWithHttpInfo(param, options) {
        return this.api.replaceWithHttpInfo(param.userId, param.publicUserUpdate, param.idProperty, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.userId, param.publicUserUpdate, param.idProperty, options).toPromise();
    }
}
exports.ObjectUsersApi = ObjectUsersApi;
//# sourceMappingURL=ObjectParamAPI.js.map