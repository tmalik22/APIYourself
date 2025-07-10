import { FoldersApi, ListsApi, MappingApi, MembershipsApi } from '../../../../codegen/crm/lists/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class ListsDiscovery {
    foldersApi: FoldersApi;
    listsApi: ListsApi;
    mappingApi: MappingApi;
    membershipsApi: MembershipsApi;
    constructor(config: IConfiguration);
}
