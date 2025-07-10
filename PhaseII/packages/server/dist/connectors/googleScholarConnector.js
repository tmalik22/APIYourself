"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleScholarConnector = void 0;
const axios_1 = __importDefault(require("axios"));
class GoogleScholarConnector {
    constructor() {
        this.providerId = 'google-scholar';
    }
    getAuthUrl() {
        // Google Scholar doesn't have a direct API, but SerpApi provides access
        return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=google-scholar`;
    }
    async handleCallback(req, res) {
        try {
            const apiKey = req.query.api_key || process.env.SERPAPI_API_KEY;
            if (!apiKey) {
                throw new Error('No SerpApi API key provided');
            }
            const schema = await this.getSchema(apiKey);
            console.log('Google Scholar schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=google-scholar`);
        }
        catch (error) {
            console.error('Google Scholar setup error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=google-scholar`);
        }
    }
    async getSchema(apiKey) {
        try {
            // Test the API with a sample search
            const response = await axios_1.default.get(`https://serpapi.com/search.json?engine=google_scholar&q=machine+learning&api_key=${apiKey}&num=1`);
            return {
                search_parameters: response.data?.search_parameters || {},
                sample_result: response.data?.organic_results?.[0] || {},
                available_fields: [
                    'title',
                    'link',
                    'snippet',
                    'publication_info',
                    'cited_by',
                    'related_versions'
                ]
            };
        }
        catch (error) {
            console.error('Error fetching Google Scholar schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.GoogleScholarConnector = GoogleScholarConnector;
//# sourceMappingURL=googleScholarConnector.js.map