import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class MicrosoftExcelConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    private exchangeCodeForToken;
    getSchema(accessToken: string): Promise<any>;
}
//# sourceMappingURL=microsoftExcelConnector.d.ts.map