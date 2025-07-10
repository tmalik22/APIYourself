"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPublicPerformanceApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPublicPerformanceApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicPerformanceApi(configuration, requestFactory, responseProcessor);
    }
    getPageWithHttpInfo(param = {}, options) {
        return this.api.getPageWithHttpInfo(param.domain, param.path, param.pad, param.sum, param.period, param.interval, param.start, param.end, options).toPromise();
    }
    getPage(param = {}, options) {
        return this.api.getPage(param.domain, param.path, param.pad, param.sum, param.period, param.interval, param.start, param.end, options).toPromise();
    }
    getUptimeWithHttpInfo(param = {}, options) {
        return this.api.getUptimeWithHttpInfo(param.domain, param.path, param.pad, param.sum, param.period, param.interval, param.start, param.end, options).toPromise();
    }
    getUptime(param = {}, options) {
        return this.api.getUptime(param.domain, param.path, param.pad, param.sum, param.period, param.interval, param.start, param.end, options).toPromise();
    }
}
exports.ObjectPublicPerformanceApi = ObjectPublicPerformanceApi;
//# sourceMappingURL=ObjectParamAPI.js.map