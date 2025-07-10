import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/calls/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class CallsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
