import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class CustomDatasetConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    getSchema(jsonData: string): Promise<any>;
    private inferFieldType;
}
//# sourceMappingURL=customDatasetConnector.d.ts.map