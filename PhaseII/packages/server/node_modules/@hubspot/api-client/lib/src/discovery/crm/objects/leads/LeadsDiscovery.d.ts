import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/leads/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class LeadsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
