import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/meetings/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class MeetingsDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
