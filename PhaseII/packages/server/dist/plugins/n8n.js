"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// n8n Workflow Automation Integration
class N8nService {
    constructor() {
        this.baseUrl = process.env.N8N_BASE_URL || 'https://your-instance.n8n.cloud/api/v1';
        this.apiKey = process.env.N8N_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ N8N_API_KEY not found. n8n integration will not work.');
        }
    }
    getHeaders() {
        return {
            'X-N8N-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        };
    }
    async getWorkflows(active) {
        try {
            const params = active !== undefined ? { active } : {};
            const response = await axios_1.default.get(`${this.baseUrl}/workflows`, {
                headers: this.getHeaders(),
                params
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get workflows: ${error.message}`);
        }
    }
    async getWorkflow(workflowId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/workflows/${workflowId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get workflow: ${error.message}`);
        }
    }
    async createWorkflow(workflowData) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/workflows`, workflowData, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create workflow: ${error.message}`);
        }
    }
    async updateWorkflow(workflowId, workflowData) {
        try {
            const response = await axios_1.default.put(`${this.baseUrl}/workflows/${workflowId}`, workflowData, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to update workflow: ${error.message}`);
        }
    }
    async deleteWorkflow(workflowId) {
        try {
            const response = await axios_1.default.delete(`${this.baseUrl}/workflows/${workflowId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to delete workflow: ${error.message}`);
        }
    }
    async activateWorkflow(workflowId) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/workflows/${workflowId}/activate`, {}, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to activate workflow: ${error.message}`);
        }
    }
    async deactivateWorkflow(workflowId) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/workflows/${workflowId}/deactivate`, {}, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to deactivate workflow: ${error.message}`);
        }
    }
    async executeWorkflow(workflowId, data) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/workflows/${workflowId}/execute`, { data }, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to execute workflow: ${error.message}`);
        }
    }
    async getExecutions(workflowId, limit = 20) {
        try {
            const params = { limit };
            if (workflowId)
                params.workflowId = workflowId;
            const response = await axios_1.default.get(`${this.baseUrl}/executions`, {
                headers: this.getHeaders(),
                params
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get executions: ${error.message}`);
        }
    }
    async getExecution(executionId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/executions/${executionId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get execution: ${error.message}`);
        }
    }
    async deleteExecution(executionId) {
        try {
            const response = await axios_1.default.delete(`${this.baseUrl}/executions/${executionId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to delete execution: ${error.message}`);
        }
    }
    async getCredentials() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/credentials`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get credentials: ${error.message}`);
        }
    }
    async createCredential(credentialData) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/credentials`, credentialData, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create credential: ${error.message}`);
        }
    }
    async getNodeTypes() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/node-types`, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get node types: ${error.message}`);
        }
    }
    // Webhook helper for triggering workflows
    async triggerWebhook(webhookPath, data, method = 'POST') {
        try {
            const webhookUrl = `${this.baseUrl.replace('/api/v1', '')}/webhook/${webhookPath}`;
            const response = await (0, axios_1.default)({
                method: method.toLowerCase(),
                url: webhookUrl,
                data: method.toUpperCase() !== 'GET' ? data : undefined,
                params: method.toUpperCase() === 'GET' ? data : undefined,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to trigger webhook: ${error.message}`);
        }
    }
}
const n8n = new N8nService();
// Workflow endpoints
router.get('/workflows', async (req, res) => {
    try {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
        const workflows = await n8n.getWorkflows(active);
        res.json({ success: true, workflows });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/workflows/:id', async (req, res) => {
    try {
        const workflow = await n8n.getWorkflow(req.params.id);
        res.json({ success: true, workflow });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/workflows', async (req, res) => {
    try {
        const workflowData = req.body;
        if (!workflowData.name) {
            return res.status(400).json({ error: 'Workflow name is required' });
        }
        const workflow = await n8n.createWorkflow(workflowData);
        res.json({ success: true, workflow });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put('/workflows/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const workflowData = req.body;
        const workflow = await n8n.updateWorkflow(id, workflowData);
        res.json({ success: true, workflow });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/workflows/:id', async (req, res) => {
    try {
        const result = await n8n.deleteWorkflow(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/workflows/:id/activate', async (req, res) => {
    try {
        const result = await n8n.activateWorkflow(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/workflows/:id/deactivate', async (req, res) => {
    try {
        const result = await n8n.deactivateWorkflow(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/workflows/:id/execute', async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const execution = await n8n.executeWorkflow(id, data);
        res.json({ success: true, execution });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Execution endpoints
router.get('/executions', async (req, res) => {
    try {
        const workflowId = req.query.workflowId;
        const limit = parseInt(req.query.limit) || 20;
        const executions = await n8n.getExecutions(workflowId, limit);
        res.json({ success: true, executions });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/executions/:id', async (req, res) => {
    try {
        const execution = await n8n.getExecution(req.params.id);
        res.json({ success: true, execution });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/executions/:id', async (req, res) => {
    try {
        const result = await n8n.deleteExecution(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Credential endpoints
router.get('/credentials', async (req, res) => {
    try {
        const credentials = await n8n.getCredentials();
        res.json({ success: true, credentials });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/credentials', async (req, res) => {
    try {
        const credentialData = req.body;
        if (!credentialData.name || !credentialData.type) {
            return res.status(400).json({ error: 'Credential name and type are required' });
        }
        const credential = await n8n.createCredential(credentialData);
        res.json({ success: true, credential });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Node types endpoint
router.get('/node-types', async (req, res) => {
    try {
        const nodeTypes = await n8n.getNodeTypes();
        res.json({ success: true, nodeTypes });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Webhook endpoints
router.post('/webhooks/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const data = req.body;
        const result = await n8n.triggerWebhook(path, data, 'POST');
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/webhooks/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const data = req.query;
        const result = await n8n.triggerWebhook(path, data, 'GET');
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Quick workflow templates
router.get('/templates', (req, res) => {
    const templates = {
        simple_webhook: {
            name: 'Simple Webhook Workflow',
            nodes: [
                {
                    name: 'Webhook',
                    type: 'n8n-nodes-base.webhook',
                    position: [250, 300],
                    parameters: {
                        httpMethod: 'POST',
                        path: 'simple-webhook'
                    }
                },
                {
                    name: 'Set',
                    type: 'n8n-nodes-base.set',
                    position: [450, 300],
                    parameters: {
                        values: {
                            string: [
                                {
                                    name: 'message',
                                    value: 'Hello from n8n!'
                                }
                            ]
                        }
                    }
                }
            ],
            connections: {
                'Webhook': {
                    'main': [[{ 'node': 'Set', 'type': 'main', 'index': 0 }]]
                }
            }
        },
        email_notification: {
            name: 'Email Notification Workflow',
            nodes: [
                {
                    name: 'Webhook',
                    type: 'n8n-nodes-base.webhook',
                    position: [250, 300],
                    parameters: {
                        httpMethod: 'POST',
                        path: 'email-notification'
                    }
                },
                {
                    name: 'Send Email',
                    type: 'n8n-nodes-base.emailSend',
                    position: [450, 300],
                    parameters: {
                        subject: '={{$json["subject"] || "Notification"}}',
                        text: '={{$json["message"] || "You have a new notification"}}',
                        toEmail: '={{$json["email"]}}'
                    }
                }
            ],
            connections: {
                'Webhook': {
                    'main': [[{ 'node': 'Send Email', 'type': 'main', 'index': 0 }]]
                }
            }
        },
        data_processing: {
            name: 'Data Processing Workflow',
            nodes: [
                {
                    name: 'Webhook',
                    type: 'n8n-nodes-base.webhook',
                    position: [250, 300],
                    parameters: {
                        httpMethod: 'POST',
                        path: 'data-processing'
                    }
                },
                {
                    name: 'Function',
                    type: 'n8n-nodes-base.function',
                    position: [450, 300],
                    parameters: {
                        functionCode: `
// Process incoming data
const data = items[0].json;

// Transform data
const processed = {
  ...data,
  processed_at: new Date().toISOString(),
  id: Math.random().toString(36).substr(2, 9)
};

return [{ json: processed }];`
                    }
                },
                {
                    name: 'HTTP Request',
                    type: 'n8n-nodes-base.httpRequest',
                    position: [650, 300],
                    parameters: {
                        url: 'https://httpbin.org/post',
                        requestMethod: 'POST'
                    }
                }
            ],
            connections: {
                'Webhook': {
                    'main': [[{ 'node': 'Function', 'type': 'main', 'index': 0 }]]
                },
                'Function': {
                    'main': [[{ 'node': 'HTTP Request', 'type': 'main', 'index': 0 }]]
                }
            }
        }
    };
    res.json({ success: true, templates });
});
router.post('/templates/:template', async (req, res) => {
    try {
        const templateName = req.params.template;
        const { name } = req.body;
        const templates = {
            simple_webhook: {
                name: name || 'Simple Webhook Workflow',
                nodes: [
                    {
                        name: 'Webhook',
                        type: 'n8n-nodes-base.webhook',
                        position: [250, 300],
                        parameters: {
                            httpMethod: 'POST',
                            path: name?.toLowerCase().replace(/\s+/g, '-') || 'simple-webhook'
                        }
                    }
                ]
            }
        };
        const template = templates[templateName];
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        const workflow = await n8n.createWorkflow(template);
        res.json({ success: true, workflow });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        const workflows = await n8n.getWorkflows();
        res.json({
            success: true,
            message: 'n8n API is working',
            stats: {
                workflows: workflows?.data?.length || 0,
                baseUrl: process.env.N8N_BASE_URL,
                authenticated: !!process.env.N8N_API_KEY
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=n8n.js.map