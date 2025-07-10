"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectValidationApi = exports.ObjectMetadataApi = exports.ObjectExtractApi = exports.ObjectContentApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectContentApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableContentApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.environment, param.path, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.environment, param.path, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.environment, param.path, param.file, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.environment, param.path, param.file, options).toPromise();
    }
    createOrUpdateWithHttpInfo(param, options) {
        return this.api.createOrUpdateWithHttpInfo(param.environment, param.path, param.file, options).toPromise();
    }
    createOrUpdate(param, options) {
        return this.api.createOrUpdate(param.environment, param.path, param.file, options).toPromise();
    }
    downloadWithHttpInfo(param, options) {
        return this.api.downloadWithHttpInfo(param.environment, param.path, options).toPromise();
    }
    download(param, options) {
        return this.api.download(param.environment, param.path, options).toPromise();
    }
}
exports.ObjectContentApi = ObjectContentApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectExtractApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableExtractApi(configuration, requestFactory, responseProcessor);
    }
    doAsyncWithHttpInfo(param, options) {
        return this.api.doAsyncWithHttpInfo(param.fileExtractRequest, options).toPromise();
    }
    doAsync(param, options) {
        return this.api.doAsync(param.fileExtractRequest, options).toPromise();
    }
    getAsyncStatusWithHttpInfo(param, options) {
        return this.api.getAsyncStatusWithHttpInfo(param.taskId, options).toPromise();
    }
    getAsyncStatus(param, options) {
        return this.api.getAsyncStatus(param.taskId, options).toPromise();
    }
}
exports.ObjectExtractApi = ObjectExtractApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectMetadataApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableMetadataApi(configuration, requestFactory, responseProcessor);
    }
    getWithHttpInfo(param, options) {
        return this.api.getWithHttpInfo(param.environment, param.path, param.properties, options).toPromise();
    }
    get(param, options) {
        return this.api.get(param.environment, param.path, param.properties, options).toPromise();
    }
}
exports.ObjectMetadataApi = ObjectMetadataApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectValidationApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableValidationApi(configuration, requestFactory, responseProcessor);
    }
    doValidateWithHttpInfo(param, options) {
        return this.api.doValidateWithHttpInfo(param.path, param.file, options).toPromise();
    }
    doValidate(param, options) {
        return this.api.doValidate(param.path, param.file, options).toPromise();
    }
}
exports.ObjectValidationApi = ObjectValidationApi;
//# sourceMappingURL=ObjectParamAPI.js.map