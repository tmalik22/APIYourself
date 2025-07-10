import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/taxes/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class TaxesDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
