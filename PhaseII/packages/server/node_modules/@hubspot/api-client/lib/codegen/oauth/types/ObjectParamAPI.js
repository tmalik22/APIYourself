"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTokensApi = exports.ObjectRefreshTokensApi = exports.ObjectAccessTokensApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectAccessTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableAccessTokensApi(configuration, requestFactory, responseProcessor);
    }
    getWithHttpInfo(param, options) {
        return this.api.getWithHttpInfo(param.token, options).toPromise();
    }
    get(param, options) {
        return this.api.get(param.token, options).toPromise();
    }
}
exports.ObjectAccessTokensApi = ObjectAccessTokensApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectRefreshTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableRefreshTokensApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.token, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.token, options).toPromise();
    }
    getWithHttpInfo(param, options) {
        return this.api.getWithHttpInfo(param.token, options).toPromise();
    }
    get(param, options) {
        return this.api.get(param.token, options).toPromise();
    }
}
exports.ObjectRefreshTokensApi = ObjectRefreshTokensApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableTokensApi(configuration, requestFactory, responseProcessor);
    }
    createWithHttpInfo(param = {}, options) {
        return this.api.createWithHttpInfo(param.grantType, param.code, param.redirectUri, param.clientId, param.clientSecret, param.refreshToken, options).toPromise();
    }
    create(param = {}, options) {
        return this.api.create(param.grantType, param.code, param.redirectUri, param.clientId, param.clientSecret, param.refreshToken, options).toPromise();
    }
}
exports.ObjectTokensApi = ObjectTokensApi;
//# sourceMappingURL=ObjectParamAPI.js.map