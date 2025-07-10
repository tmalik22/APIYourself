import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/tasks/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class TasksDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
