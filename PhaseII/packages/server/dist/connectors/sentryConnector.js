"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class SentryConnector {
    constructor() {
        this.providerId = 'sentry';
    }
    getAuthUrl() {
        const params = querystring_1.default.stringify({
            client_id: process.env.SENTRY_CLIENT_ID || 'demo_client_id',
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/sentry/callback`,
            response_type: 'code',
            scope: 'org:read project:read event:read',
            state: 'sentry_oauth_state'
        });
        return `https://sentry.io/oauth/authorize/?${params}`;
    }
    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            console.log(`Sentry OAuth callback - Code: ${code}, State: ${state}`);
            if (!code) {
                throw new Error('No authorization code received');
            }
            const tokenResponse = await this.exchangeCodeForToken(code);
            console.log('Sentry access token received:', tokenResponse.access_token);
            const schema = await this.getSchema(tokenResponse.access_token);
            console.log('Sentry schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=sentry`);
        }
        catch (error) {
            console.error('Sentry OAuth error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=sentry`);
        }
    }
    async exchangeCodeForToken(code) {
        try {
            const response = await axios_1.default.post('https://sentry.io/oauth/token/', {
                grant_type: 'authorization_code',
                client_id: process.env.SENTRY_CLIENT_ID,
                client_secret: process.env.SENTRY_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/sentry/callback`
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
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
            // Get organizations and projects
            const [orgsResponse, projectsResponse] = await Promise.all([
                axios_1.default.get('https://sentry.io/api/0/organizations/', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }),
                axios_1.default.get('https://sentry.io/api/0/projects/', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                })
            ]);
            return {
                organizations: orgsResponse.data || [],
                projects: projectsResponse.data || []
            };
        }
        catch (error) {
            console.error('Error fetching Sentry schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.SentryConnector = SentryConnector;
//# sourceMappingURL=sentryConnector.js.map