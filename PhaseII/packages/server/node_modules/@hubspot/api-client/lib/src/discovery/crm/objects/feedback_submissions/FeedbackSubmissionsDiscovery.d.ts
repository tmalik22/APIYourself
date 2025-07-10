import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/feedback_submissions/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class FeedbackSubmissionsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
