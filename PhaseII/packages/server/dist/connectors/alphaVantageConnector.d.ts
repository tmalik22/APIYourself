import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class AlphaVantageConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    getSchema(apiKey: string): Promise<any>;
}
//# sourceMappingURL=alphaVantageConnector.d.ts.map