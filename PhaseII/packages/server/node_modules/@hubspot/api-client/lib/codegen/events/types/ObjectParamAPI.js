"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectEventsApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectEventsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableEventsApi(configuration, requestFactory, responseProcessor);
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.objectType, param.eventType, param.after, param.before, param.limit, param.sort, param.occurredAfter, param.occurredBefore, param.objectId, param.objectPropertyPropname, param.propertyPropname, param.id, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.objectType, param.eventType, param.after, param.before, param.limit, param.sort, param.occurredAfter, param.occurredBefore, param.objectId, param.objectPropertyPropname, param.propertyPropname, param.id, options).toPromise();
    }
    getTypesWithHttpInfo(param = {}, options) {
        return this.api.getTypesWithHttpInfo(options).toPromise();
    }
    getTypes(param = {}, options) {
        return this.api.getTypes(options).toPromise();
    }
}
exports.ObjectEventsApi = ObjectEventsApi;
//# sourceMappingURL=ObjectParamAPI.js.map