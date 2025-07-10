"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class NotionConnector {
    constructor() {
        this.providerId = 'notion';
    }
    getAuthUrl() {
        const params = querystring_1.default.stringify({
            client_id: process.env.NOTION_CLIENT_ID || 'demo_client_id',
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/notion/callback`,
            response_type: 'code',
            owner: 'user',
            state: 'notion_oauth_state'
        });
        return `https://api.notion.com/v1/oauth/authorize?${params}`;
    }
    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            console.log(`Notion OAuth callback - Code: ${code}, State: ${state}`);
            if (!code) {
                throw new Error('No authorization code received');
            }
            const tokenResponse = await this.exchangeCodeForToken(code);
            console.log('Notion access token received:', tokenResponse.access_token);
            const schema = await this.getSchema(tokenResponse.access_token);
            console.log('Notion schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=notion`);
        }
        catch (error) {
            console.error('Notion OAuth error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=notion`);
        }
    }
    async exchangeCodeForToken(code) {
        try {
            const response = await axios_1.default.post('https://api.notion.com/v1/oauth/token', {
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/notion/callback`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error exchanging code for token:', error);
            throw new Error('Failed to exchange authorization code for access token');
        }
    }
    async getSchema(accessToken) {
        try {
            // Get user info and search for databases
            const [userResponse, searchResponse] = await Promise.all([
                axios_1.default.get('https://api.notion.com/v1/users/me', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Notion-Version': '2022-06-28'
                    }
                }),
                axios_1.default.post('https://api.notion.com/v1/search', {
                    filter: { object: 'database' },
                    page_size: 5
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    }
                })
            ]);
            return {
                user: userResponse.data,
                databases: searchResponse.data.results || []
            };
        }
        catch (error) {
            console.error('Error fetching Notion schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.NotionConnector = NotionConnector;
//# sourceMappingURL=notionConnector.js.map