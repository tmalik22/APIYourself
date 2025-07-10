import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/postal_mail/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class PostalMailDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
