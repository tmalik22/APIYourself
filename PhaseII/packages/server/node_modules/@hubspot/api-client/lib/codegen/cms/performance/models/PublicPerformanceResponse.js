"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicPerformanceResponseIntervalEnum = exports.PublicPerformanceResponsePeriodEnum = exports.PublicPerformanceResponse = void 0;
class PublicPerformanceResponse {
    static getAttributeTypeMap() {
        return PublicPerformanceResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicPerformanceResponse = PublicPerformanceResponse;
PublicPerformanceResponse.discriminator = undefined;
PublicPerformanceResponse.attributeTypeMap = [
    {
        "name": "path",
        "baseName": "path",
        "type": "string",
        "format": ""
    },
    {
        "name": "period",
        "baseName": "period",
        "type": "PublicPerformanceResponsePeriodEnum",
        "format": ""
    },
    {
        "name": "startInterval",
        "baseName": "startInterval",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<PerformanceView>",
        "format": ""
    },
    {
        "name": "domain",
        "baseName": "domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "interval",
        "baseName": "interval",
        "type": "PublicPerformanceResponseIntervalEnum",
        "format": ""
    },
    {
        "name": "endInterval",
        "baseName": "endInterval",
        "type": "number",
        "format": "int64"
    }
];
var PublicPerformanceResponsePeriodEnum;
(function (PublicPerformanceResponsePeriodEnum) {
    PublicPerformanceResponsePeriodEnum["OneMinute"] = "ONE_MINUTE";
    PublicPerformanceResponsePeriodEnum["FiveMinutes"] = "FIVE_MINUTES";
    PublicPerformanceResponsePeriodEnum["TenMinutes"] = "TEN_MINUTES";
    PublicPerformanceResponsePeriodEnum["FifteenMinutes"] = "FIFTEEN_MINUTES";
    PublicPerformanceResponsePeriodEnum["ThirtyMinutes"] = "THIRTY_MINUTES";
    PublicPerformanceResponsePeriodEnum["OneHour"] = "ONE_HOUR";
    PublicPerformanceResponsePeriodEnum["FourHours"] = "FOUR_HOURS";
    PublicPerformanceResponsePeriodEnum["TwelveHours"] = "TWELVE_HOURS";
    PublicPerformanceResponsePeriodEnum["OneDay"] = "ONE_DAY";
    PublicPerformanceResponsePeriodEnum["OneWeek"] = "ONE_WEEK";
})(PublicPerformanceResponsePeriodEnum = exports.PublicPerformanceResponsePeriodEnum || (exports.PublicPerformanceResponsePeriodEnum = {}));
var PublicPerformanceResponseIntervalEnum;
(function (PublicPerformanceResponseIntervalEnum) {
    PublicPerformanceResponseIntervalEnum["OneMinute"] = "ONE_MINUTE";
    PublicPerformanceResponseIntervalEnum["FiveMinutes"] = "FIVE_MINUTES";
    PublicPerformanceResponseIntervalEnum["TenMinutes"] = "TEN_MINUTES";
    PublicPerformanceResponseIntervalEnum["FifteenMinutes"] = "FIFTEEN_MINUTES";
    PublicPerformanceResponseIntervalEnum["ThirtyMinutes"] = "THIRTY_MINUTES";
    PublicPerformanceResponseIntervalEnum["OneHour"] = "ONE_HOUR";
    PublicPerformanceResponseIntervalEnum["FourHours"] = "FOUR_HOURS";
    PublicPerformanceResponseIntervalEnum["TwelveHours"] = "TWELVE_HOURS";
    PublicPerformanceResponseIntervalEnum["OneDay"] = "ONE_DAY";
    PublicPerformanceResponseIntervalEnum["OneWeek"] = "ONE_WEEK";
})(PublicPerformanceResponseIntervalEnum = exports.PublicPerformanceResponseIntervalEnum || (exports.PublicPerformanceResponseIntervalEnum = {}));
//# sourceMappingURL=PublicPerformanceResponse.js.map