import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class GoogleScholarConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    getSchema(apiKey: string): Promise<any>;
}
//# sourceMappingURL=googleScholarConnector.d.ts.map