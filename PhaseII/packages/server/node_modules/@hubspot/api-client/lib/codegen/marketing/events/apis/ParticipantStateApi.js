"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantStateApiResponseProcessor = exports.ParticipantStateApiRequestFactory = void 0;
const baseapi_1 = require("./baseapi");
const http_1 = require("../http/http");
const ObjectSerializer_1 = require("../models/ObjectSerializer");
const exception_1 = require("./exception");
const util_1 = require("../util");
class ParticipantStateApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    getParticipationsBreakdownByContactId(contactIdentifier, state, limit, after, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (contactIdentifier === null || contactIdentifier === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsBreakdownByContactId", "contactIdentifier");
            }
            const localVarPath = '/marketing/v3/marketing-events/participations/contacts/{contactIdentifier}/breakdown'
                .replace('{' + 'contactIdentifier' + '}', encodeURIComponent(String(contactIdentifier)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            if (state !== undefined) {
                requestContext.setQueryParam("state", ObjectSerializer_1.ObjectSerializer.serialize(state, "string", ""));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "int32"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "string", ""));
            }
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getParticipationsBreakdownByExternalEventId(externalAccountId, externalEventId, contactIdentifier, state, limit, after, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (externalAccountId === null || externalAccountId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsBreakdownByExternalEventId", "externalAccountId");
            }
            if (externalEventId === null || externalEventId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsBreakdownByExternalEventId", "externalEventId");
            }
            const localVarPath = '/marketing/v3/marketing-events/participations/{externalAccountId}/{externalEventId}/breakdown'
                .replace('{' + 'externalAccountId' + '}', encodeURIComponent(String(externalAccountId)))
                .replace('{' + 'externalEventId' + '}', encodeURIComponent(String(externalEventId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            if (contactIdentifier !== undefined) {
                requestContext.setQueryParam("contactIdentifier", ObjectSerializer_1.ObjectSerializer.serialize(contactIdentifier, "string", ""));
            }
            if (state !== undefined) {
                requestContext.setQueryParam("state", ObjectSerializer_1.ObjectSerializer.serialize(state, "string", ""));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "int32"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "string", ""));
            }
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getParticipationsBreakdownByMarketingEventId(marketingEventId, contactIdentifier, state, limit, after, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (marketingEventId === null || marketingEventId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsBreakdownByMarketingEventId", "marketingEventId");
            }
            const localVarPath = '/marketing/v3/marketing-events/participations/{marketingEventId}/breakdown'
                .replace('{' + 'marketingEventId' + '}', encodeURIComponent(String(marketingEventId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            if (contactIdentifier !== undefined) {
                requestContext.setQueryParam("contactIdentifier", ObjectSerializer_1.ObjectSerializer.serialize(contactIdentifier, "string", ""));
            }
            if (state !== undefined) {
                requestContext.setQueryParam("state", ObjectSerializer_1.ObjectSerializer.serialize(state, "string", ""));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "int32"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "string", ""));
            }
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getParticipationsCountersByEventExternalId(externalAccountId, externalEventId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (externalAccountId === null || externalAccountId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsCountersByEventExternalId", "externalAccountId");
            }
            if (externalEventId === null || externalEventId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsCountersByEventExternalId", "externalEventId");
            }
            const localVarPath = '/marketing/v3/marketing-events/participations/{externalAccountId}/{externalEventId}'
                .replace('{' + 'externalAccountId' + '}', encodeURIComponent(String(externalAccountId)))
                .replace('{' + 'externalEventId' + '}', encodeURIComponent(String(externalEventId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getParticipationsCountersByMarketingEventId(marketingEventId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (marketingEventId === null || marketingEventId === undefined) {
                throw new baseapi_1.RequiredError("ParticipantStateApi", "getParticipationsCountersByMarketingEventId", "marketingEventId");
            }
            const localVarPath = '/marketing/v3/marketing-events/participations/{marketingEventId}'
                .replace('{' + 'marketingEventId' + '}', encodeURIComponent(String(marketingEventId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
}
exports.ParticipantStateApiRequestFactory = ParticipantStateApiRequestFactory;
class ParticipantStateApiResponseProcessor {
    getParticipationsBreakdownByContactIdWithHttpInfo(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getParticipationsBreakdownByExternalEventIdWithHttpInfo(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getParticipationsBreakdownByMarketingEventIdWithHttpInfo(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseWithTotalParticipationBreakdownForwardPaging", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getParticipationsCountersByEventExternalIdWithHttpInfo(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "AttendanceCounters", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "AttendanceCounters", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getParticipationsCountersByMarketingEventIdWithHttpInfo(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "AttendanceCounters", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "AttendanceCounters", "");
                return new http_1.HttpInfo(response.httpStatusCode, response.headers, response.body, body);
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
}
exports.ParticipantStateApiResponseProcessor = ParticipantStateApiResponseProcessor;
//# sourceMappingURL=ParticipantStateApi.js.map