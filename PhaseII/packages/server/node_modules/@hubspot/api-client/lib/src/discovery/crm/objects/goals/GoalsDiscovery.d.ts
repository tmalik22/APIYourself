import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/goals/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class GoalsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
