"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class SlackConnector {
    constructor() {
        this.providerId = 'slack';
    }
    getAuthUrl() {
        const params = querystring_1.default.stringify({
            client_id: process.env.SLACK_CLIENT_ID || 'demo_client_id',
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/slack/callback`,
            scope: 'channels:read chat:write users:read team:read',
            response_type: 'code',
            state: 'slack_oauth_state'
        });
        return `https://slack.com/oauth/v2/authorize?${params}`;
    }
    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            console.log(`Slack OAuth callback - Code: ${code}, State: ${state}`);
            if (!code) {
                throw new Error('No authorization code received');
            }
            const tokenResponse = await this.exchangeCodeForToken(code);
            console.log('Slack access token received:', tokenResponse.access_token);
            const schema = await this.getSchema(tokenResponse.access_token);
            console.log('Slack schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=slack`);
        }
        catch (error) {
            console.error('Slack OAuth error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=slack`);
        }
    }
    async exchangeCodeForToken(code) {
        try {
            const response = await axios_1.default.post('https://slack.com/api/oauth.v2.access', {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/slack/callback`
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
            // Get team info and channels
            const [teamResponse, channelsResponse] = await Promise.all([
                axios_1.default.get('https://slack.com/api/team.info', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }),
                axios_1.default.get('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                })
            ]);
            return {
                team: teamResponse.data?.team || {},
                channels: channelsResponse.data?.channels || []
            };
        }
        catch (error) {
            console.error('Error fetching Slack schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.SlackConnector = SlackConnector;
//# sourceMappingURL=slackConnector.js.map