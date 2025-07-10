import { BasicApi, BatchApi, SearchApi } from '../../../../../codegen/crm/objects/notes/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class NotesDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
}
