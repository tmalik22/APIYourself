import { PublicSMTPTokensApi, SingleSendApi } from '../../../../codegen/marketing/transactional/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class TransactionalDiscovery {
    publicSMTPTokensApi: PublicSMTPTokensApi;
    singleSendApi: SingleSendApi;
    constructor(config: IConfiguration);
}
