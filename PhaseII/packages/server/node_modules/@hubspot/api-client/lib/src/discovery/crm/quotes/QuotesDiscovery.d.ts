import { BasicApi, BatchApi, SearchApi, SimplePublicObjectWithAssociations } from '../../../../codegen/crm/quotes/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class QuotesDiscovery {
    basicApi: BasicApi;
    batchApi: BatchApi;
    searchApi: SearchApi;
    constructor(config: IConfiguration);
    getAll(limit?: number, after?: string, properties?: string[], propertiesWithHistory?: string[], associations?: string[], archived?: boolean): Promise<SimplePublicObjectWithAssociations[]>;
}
