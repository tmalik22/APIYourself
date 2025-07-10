"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connectors_1 = __importDefault(require("./connectors"));
const router = (0, express_1.Router)();
// Demo mode check
const isDemoMode = process.env.NODE_ENV === 'demo' || process.env.NODE_ENV === 'development';
// Generic auth initiation route
router.get('/auth/:provider', (req, res) => {
    const { provider } = req.params;
    const connector = connectors_1.default[provider];
    if (!connector) {
        return res.status(404).json({ error: 'Provider not found' });
    }
    try {
        // Check if we have valid OAuth configuration
        const requiredEnvVars = getRequiredEnvVars(provider);
        const hasValidConfig = requiredEnvVars.every(varName => {
            const value = process.env[varName];
            return value && value !== 'demo_client_id' && !value.includes('your_') && !value.includes('_here');
        });
        if (!hasValidConfig && !isDemoMode) {
            // Redirect to frontend with configuration error
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=config_error&plugin=${provider}&message=OAuth not configured`);
        }
        if (isDemoMode || !hasValidConfig) {
            // Demo mode - simulate successful auth
            console.log(`[DEMO] Simulating ${provider} OAuth success`);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=demo_success&plugin=${provider}`);
        }
        // Real OAuth flow
        const authUrl = connector.getAuthUrl();
        res.redirect(authUrl);
    }
    catch (error) {
        console.error(`Error initiating ${provider} auth:`, error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=${provider}`);
    }
});
// Generic OAuth callback route
router.get('/auth/:provider/callback', async (req, res) => {
    const { provider } = req.params;
    const connector = connectors_1.default[provider];
    if (!connector) {
        return res.status(404).json({ error: 'Provider not found' });
    }
    try {
        if (isDemoMode) {
            // Demo mode callback
            console.log(`[DEMO] ${provider} OAuth callback received`);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=demo_success&plugin=${provider}`);
        }
        // Real OAuth callback
        await connector.handleCallback(req, res);
    }
    catch (error) {
        console.error(`Error handling ${provider} callback:`, error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=${provider}`);
    }
});
// Helper function to get required environment variables for each provider
function getRequiredEnvVars(provider) {
    const envVarMap = {
        'google-sheets': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
        'microsoft-excel': ['MICROSOFT_CLIENT_ID', 'MICROSOFT_CLIENT_SECRET'],
        'slack': ['SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'],
        'hubspot': ['HUBSPOT_CLIENT_ID', 'HUBSPOT_CLIENT_SECRET'],
        'airtable': ['AIRTABLE_CLIENT_ID', 'AIRTABLE_CLIENT_SECRET'],
        'notion': ['NOTION_CLIENT_ID', 'NOTION_CLIENT_SECRET'],
        'jira': ['JIRA_CLIENT_ID', 'JIRA_CLIENT_SECRET'],
        'sentry': ['SENTRY_AUTH_TOKEN'],
        'alpha-vantage': ['ALPHA_VANTAGE_API_KEY'],
        'the-odds-api': ['THE_ODDS_API_KEY'],
        'custom-dataset': [], // No OAuth required
        'google-scholar': [], // No OAuth required  
        'n8n': [] // No OAuth required
    };
    return envVarMap[provider] || [];
}
// Plugin configuration status endpoint
router.get('/config-status', (req, res) => {
    const status = {};
    Object.keys(connectors_1.default).forEach(provider => {
        const requiredVars = getRequiredEnvVars(provider);
        const hasValidConfig = requiredVars.length === 0 || requiredVars.every(varName => {
            const value = process.env[varName];
            return value && value !== 'demo_client_id' && !value.includes('your_') && !value.includes('_here');
        });
        status[provider] = {
            configured: hasValidConfig,
            demo_mode: isDemoMode,
            required_vars: requiredVars,
            missing_vars: requiredVars.filter(varName => {
                const value = process.env[varName];
                return !value || value === 'demo_client_id' || value.includes('your_') || value.includes('_here');
            })
        };
    });
    res.json({
        demo_mode: isDemoMode,
        providers: status
    });
});
exports.default = router;
//# sourceMappingURL=plugin-auth.js.map