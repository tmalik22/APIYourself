import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/emails/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class EmailsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
