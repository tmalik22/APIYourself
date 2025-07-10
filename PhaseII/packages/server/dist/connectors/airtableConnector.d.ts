import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class AirtableConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    private exchangeCodeForToken;
    getSchema(accessToken: string): Promise<any>;
}
//# sourceMappingURL=airtableConnector.d.ts.map