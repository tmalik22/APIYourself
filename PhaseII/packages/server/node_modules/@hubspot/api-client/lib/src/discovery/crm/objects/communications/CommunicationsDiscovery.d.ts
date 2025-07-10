import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/communications/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class CommunicationsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
