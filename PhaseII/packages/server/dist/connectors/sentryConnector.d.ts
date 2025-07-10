import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class SentryConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    private exchangeCodeForToken;
    getSchema(accessToken: string): Promise<any>;
}
//# sourceMappingURL=sentryConnector.d.ts.map