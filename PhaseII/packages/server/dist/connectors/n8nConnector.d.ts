import { Request, Response } from 'express';
import { Connector } from './baseConnector';
export declare class N8nConnector implements Connector {
    providerId: string;
    getAuthUrl(): string;
    handleCallback(req: Request, res: Response): Promise<void>;
    getSchema(): Promise<any>;
    /**
     * Trigger an n8n workflow via webhook
     */
    triggerWorkflow(webhookUrl: string, data: any, options?: any): Promise<any>;
    /**
     * Check workflow execution status (if n8n API is available)
     */
    getWorkflowStatus(n8nApiUrl: string, executionId: string, apiKey?: string): Promise<any>;
    /**
     * Create a webhook endpoint that can receive data from n8n
     */
    handleWebhookFromN8n(req: Request, res: Response): Promise<void>;
    /**
     * Generate n8n workflow templates for common use cases
     */
    getWorkflowTemplates(): any[];
}
//# sourceMappingURL=n8nConnector.d.ts.map