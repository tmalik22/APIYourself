"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPipelinesApi = exports.ObjectPipelineStagesApi = exports.ObjectPipelineStageAuditsApi = exports.ObjectPipelineAuditsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPipelineAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePipelineAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAuditWithHttpInfo(param, options) {
        return this.api.getAuditWithHttpInfo(param.objectType, param.pipelineId, options).toPromise();
    }
    getAudit(param, options) {
        return this.api.getAudit(param.objectType, param.pipelineId, options).toPromise();
    }
}
exports.ObjectPipelineAuditsApi = ObjectPipelineAuditsApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectPipelineStageAuditsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservablePipelineStageAuditsApi(configuration, requestFactory, responseProcessor);
    }
    getAuditWithHttpInfo(param, options) {
        return this.api.getAuditWithHttpInfo(param.objectType, param.stageId, options).toPromise();
    }
    getAudit(param, options) {
        return this.api.getAudit(param.objectType, param.stageId, options).toPromise();
    }
}
exports.ObjectPipelineStageAuditsApi = ObjectPipelineStageAuditsApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectPipelineStagesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservablePipelineStagesApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.objectType, param.pipelineId, param.pipelineStageInput, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectType, param.pipelineId, param.pipelineStageInput, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.objectType, param.pipelineId, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.objectType, param.pipelineId, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, param.pipelineId, param.stageId, options).toPromise();
    }
    replaceWithHttpInfo(param, options) {
        return this.api.replaceWithHttpInfo(param.objectType, param.pipelineId, param.stageId, param.pipelineStageInput, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.objectType, param.pipelineId, param.stageId, param.pipelineStageInput, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectType, param.pipelineId, param.stageId, param.pipelineStagePatchInput, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.pipelineId, param.stageId, param.pipelineStagePatchInput, options).toPromise();
    }
}
exports.ObjectPipelineStagesApi = ObjectPipelineStagesApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectPipelinesApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservablePipelinesApi(configuration, requestFactory, responseProcessor);
    }
    archiveWithHttpInfo(param, options) {
        return this.api.archiveWithHttpInfo(param.objectType, param.pipelineId, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
    archive(param, options) {
        return this.api.archive(param.objectType, param.pipelineId, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
    createWithHttpInfo(param, options) {
        return this.api.createWithHttpInfo(param.objectType, param.pipelineInput, options).toPromise();
    }
    create(param, options) {
        return this.api.create(param.objectType, param.pipelineInput, options).toPromise();
    }
    getAllWithHttpInfo(param, options) {
        return this.api.getAllWithHttpInfo(param.objectType, options).toPromise();
    }
    getAll(param, options) {
        return this.api.getAll(param.objectType, options).toPromise();
    }
    getByIdWithHttpInfo(param, options) {
        return this.api.getByIdWithHttpInfo(param.objectType, param.pipelineId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.objectType, param.pipelineId, options).toPromise();
    }
    replaceWithHttpInfo(param, options) {
        return this.api.replaceWithHttpInfo(param.objectType, param.pipelineId, param.pipelineInput, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.objectType, param.pipelineId, param.pipelineInput, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
    updateWithHttpInfo(param, options) {
        return this.api.updateWithHttpInfo(param.objectType, param.pipelineId, param.pipelinePatchInput, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.objectType, param.pipelineId, param.pipelinePatchInput, param.validateReferencesBeforeDelete, param.validateDealStageUsagesBeforeDelete, options).toPromise();
    }
}
exports.ObjectPipelinesApi = ObjectPipelinesApi;
//# sourceMappingURL=ObjectParamAPI.js.map