"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nConnector = void 0;
const axios_1 = __importDefault(require("axios"));
class N8nConnector {
    constructor() {
        this.providerId = 'n8n';
    }
    getAuthUrl() {
        // For n8n, we redirect to a setup page where users can configure their n8n instance
        return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=n8n`;
    }
    async handleCallback(req, res) {
        try {
            // n8n integration doesn't require OAuth - users configure webhook URLs
            console.log('n8n integration setup complete');
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=n8n`);
        }
        catch (error) {
            console.error('n8n setup error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=n8n`);
        }
    }
    async getSchema() {
        return {
            name: 'n8n Workflow Automation',
            description: 'Connect your APIs to powerful n8n workflows for automation and data processing',
            capabilities: [
                'Trigger workflows via webhooks',
                'Process API data through n8n',
                'Connect to 400+ services via n8n',
                'Real-time workflow monitoring',
                'Data transformation and enrichment'
            ],
            endpoints: [
                {
                    path: '/trigger-workflow',
                    method: 'POST',
                    description: 'Trigger an n8n workflow with data',
                    parameters: {
                        workflowId: 'string (required) - n8n workflow ID',
                        webhookUrl: 'string (required) - n8n webhook URL',
                        data: 'object (required) - Data to send to workflow'
                    }
                },
                {
                    path: '/workflow-status',
                    method: 'GET',
                    description: 'Check the status of a workflow execution',
                    parameters: {
                        executionId: 'string (required) - n8n execution ID'
                    }
                }
            ],
            setupInstructions: [
                '1. Set up your n8n instance (cloud.n8n.io or self-hosted)',
                '2. Create a workflow with a webhook trigger',
                '3. Copy the webhook URL from n8n',
                '4. Configure the webhook URL in your API settings',
                '5. Test the integration by sending data to your workflow'
            ],
            examples: {
                triggerWorkflow: {
                    url: '/api/n8n/trigger-workflow',
                    method: 'POST',
                    body: {
                        webhookUrl: 'https://your-n8n-instance.com/webhook/your-webhook-id',
                        data: {
                            customerData: {
                                name: 'John Doe',
                                email: 'john@example.com',
                                action: 'signup'
                            }
                        }
                    }
                }
            }
        };
    }
    /**
     * Trigger an n8n workflow via webhook
     */
    async triggerWorkflow(webhookUrl, data, options = {}) {
        try {
            console.log('Triggering n8n workflow:', { webhookUrl: webhookUrl.substring(0, 50) + '...', dataKeys: Object.keys(data) });
            const response = await axios_1.default.post(webhookUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'APIYourself-n8n-Integration/1.0',
                    ...options.headers
                },
                timeout: options.timeout || 30000
            });
            return {
                success: true,
                executionId: response.headers['x-n8n-execution-id'] || null,
                data: response.data,
                status: response.status,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('n8n workflow trigger error:', error.message);
            throw new Error(`Failed to trigger n8n workflow: ${error.message}`);
        }
    }
    /**
     * Check workflow execution status (if n8n API is available)
     */
    async getWorkflowStatus(n8nApiUrl, executionId, apiKey) {
        try {
            if (!n8nApiUrl || !executionId) {
                throw new Error('n8n API URL and execution ID are required');
            }
            const headers = {
                'Content-Type': 'application/json'
            };
            if (apiKey) {
                headers['X-N8N-API-KEY'] = apiKey;
            }
            const response = await axios_1.default.get(`${n8nApiUrl}/api/v1/executions/${executionId}`, { headers });
            return {
                success: true,
                execution: response.data,
                status: response.data.status,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('n8n status check error:', error.message);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * Create a webhook endpoint that can receive data from n8n
     */
    async handleWebhookFromN8n(req, res) {
        try {
            const data = req.body;
            console.log('Received webhook from n8n:', {
                headers: req.headers,
                dataKeys: Object.keys(data || {})
            });
            // Process the data from n8n
            // This could update your database, trigger other APIs, etc.
            res.json({
                success: true,
                message: 'Data received from n8n successfully',
                timestamp: new Date().toISOString(),
                processedData: data
            });
        }
        catch (error) {
            console.error('n8n webhook handling error:', error.message);
            res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Generate n8n workflow templates for common use cases
     */
    getWorkflowTemplates() {
        return [
            {
                name: 'Data Enrichment Pipeline',
                description: 'Enrich incoming API data with external services',
                useCase: 'Add geocoding, email validation, or social media data to user records',
                workflow: {
                    nodes: [
                        { type: 'webhook', name: 'API Data Input' },
                        { type: 'function', name: 'Data Validation' },
                        { type: 'http', name: 'External API Call' },
                        { type: 'merge', name: 'Combine Data' },
                        { type: 'webhook', name: 'Send Back to API' }
                    ]
                }
            },
            {
                name: 'Multi-Service Notification',
                description: 'Send notifications to multiple platforms when API events occur',
                useCase: 'Notify team via Slack, email, and SMS when critical API events happen',
                workflow: {
                    nodes: [
                        { type: 'webhook', name: 'API Event' },
                        { type: 'if', name: 'Check Event Type' },
                        { type: 'slack', name: 'Slack Notification' },
                        { type: 'email', name: 'Email Alert' },
                        { type: 'sms', name: 'SMS Alert' }
                    ]
                }
            },
            {
                name: 'Data Synchronization',
                description: 'Keep data synchronized between your API and external services',
                useCase: 'Sync customer data between your API, CRM, and marketing tools',
                workflow: {
                    nodes: [
                        { type: 'webhook', name: 'Data Update' },
                        { type: 'function', name: 'Transform Data' },
                        { type: 'salesforce', name: 'Update CRM' },
                        { type: 'mailchimp', name: 'Update Marketing' },
                        { type: 'googleSheets', name: 'Update Spreadsheet' }
                    ]
                }
            }
        ];
    }
}
exports.N8nConnector = N8nConnector;
//# sourceMappingURL=n8nConnector.js.map