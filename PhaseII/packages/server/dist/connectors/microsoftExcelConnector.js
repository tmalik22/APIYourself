"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftExcelConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class MicrosoftExcelConnector {
    constructor() {
        this.providerId = 'microsoft-excel';
    }
    getAuthUrl() {
        const params = querystring_1.default.stringify({
            client_id: process.env.MICROSOFT_CLIENT_ID || 'demo_client_id',
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/microsoft-excel/callback`,
            response_type: 'code',
            scope: 'https://graph.microsoft.com/Files.ReadWrite offline_access',
            response_mode: 'query',
            state: 'microsoft_excel_oauth_state'
        });
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
    }
    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            console.log(`Microsoft Excel OAuth callback - Code: ${code}, State: ${state}`);
            if (!code) {
                throw new Error('No authorization code received');
            }
            const tokenResponse = await this.exchangeCodeForToken(code);
            console.log('Microsoft Excel access token received:', tokenResponse.access_token);
            const schema = await this.getSchema(tokenResponse.access_token);
            console.log('Microsoft Excel schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=microsoft-excel`);
        }
        catch (error) {
            console.error('Microsoft Excel OAuth error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=microsoft-excel`);
        }
    }
    async exchangeCodeForToken(code) {
        try {
            const response = await axios_1.default.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                grant_type: 'authorization_code',
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/microsoft-excel/callback`,
                scope: 'https://graph.microsoft.com/Files.ReadWrite offline_access'
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
            // Get user's drives and workbooks
            const [userResponse, drivesResponse] = await Promise.all([
                axios_1.default.get('https://graph.microsoft.com/v1.0/me', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }),
                axios_1.default.get('https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=name eq \'*.xlsx\'', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                })
            ]);
            return {
                user: userResponse.data,
                workbooks: drivesResponse.data?.value || []
            };
        }
        catch (error) {
            console.error('Error fetching Microsoft Excel schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.MicrosoftExcelConnector = MicrosoftExcelConnector;
//# sourceMappingURL=microsoftExcelConnector.js.map