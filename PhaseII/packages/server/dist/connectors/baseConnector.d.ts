import { Request, Response } from 'express';
export interface Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    getSchema?(accessToken: string): Promise<any>;
}
//# sourceMappingURL=baseConnector.d.ts.map