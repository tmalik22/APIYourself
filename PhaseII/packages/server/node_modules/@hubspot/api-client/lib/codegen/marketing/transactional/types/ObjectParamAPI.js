"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSingleSendApi = exports.ObjectPublicSMTPTokensApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPublicSMTPTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicSMTPTokensApi(configuration, requestFactory, responseProcessor);
    }
    archiveTokenWithHttpInfo(param, options) {
        return this.api.archiveTokenWithHttpInfo(param.tokenId, options).toPromise();
    }
    archiveToken(param, options) {
        return this.api.archiveToken(param.tokenId, options).toPromise();
    }
    createTokenWithHttpInfo(param, options) {
        return this.api.createTokenWithHttpInfo(param.smtpApiTokenRequestEgg, options).toPromise();
    }
    createToken(param, options) {
        return this.api.createToken(param.smtpApiTokenRequestEgg, options).toPromise();
    }
    getTokenByIdWithHttpInfo(param, options) {
        return this.api.getTokenByIdWithHttpInfo(param.tokenId, options).toPromise();
    }
    getTokenById(param, options) {
        return this.api.getTokenById(param.tokenId, options).toPromise();
    }
    getTokensPageWithHttpInfo(param = {}, options) {
        return this.api.getTokensPageWithHttpInfo(param.campaignName, param.emailCampaignId, param.after, param.limit, options).toPromise();
    }
    getTokensPage(param = {}, options) {
        return this.api.getTokensPage(param.campaignName, param.emailCampaignId, param.after, param.limit, options).toPromise();
    }
    resetPasswordWithHttpInfo(param, options) {
        return this.api.resetPasswordWithHttpInfo(param.tokenId, options).toPromise();
    }
    resetPassword(param, options) {
        return this.api.resetPassword(param.tokenId, options).toPromise();
    }
}
exports.ObjectPublicSMTPTokensApi = ObjectPublicSMTPTokensApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSingleSendApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSingleSendApi(configuration, requestFactory, responseProcessor);
    }
    sendEmailWithHttpInfo(param, options) {
        return this.api.sendEmailWithHttpInfo(param.publicSingleSendRequestEgg, options).toPromise();
    }
    sendEmail(param, options) {
        return this.api.sendEmail(param.publicSingleSendRequestEgg, options).toPromise();
    }
}
exports.ObjectSingleSendApi = ObjectSingleSendApi;
//# sourceMappingURL=ObjectParamAPI.js.map