"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheOddsApiConnector = void 0;
const axios_1 = __importDefault(require("axios"));
class TheOddsApiConnector {
    constructor() {
        this.providerId = 'the-odds-api';
    }
    getAuthUrl() {
        // The Odds API uses API keys, not OAuth
        return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=the-odds-api`;
    }
    async handleCallback(req, res) {
        try {
            const apiKey = req.query.api_key || process.env.THE_ODDS_API_KEY;
            if (!apiKey) {
                throw new Error('No API key provided');
            }
            const schema = await this.getSchema(apiKey);
            console.log('The Odds API schema:', schema);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=the-odds-api`);
        }
        catch (error) {
            console.error('The Odds API setup error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=the-odds-api`);
        }
    }
    async getSchema(apiKey) {
        try {
            // Get available sports
            const response = await axios_1.default.get(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`);
            return {
                sports: response.data || [],
                endpoints: [
                    '/sports',
                    '/sports/{sport}/odds',
                    '/sports/{sport}/scores'
                ]
            };
        }
        catch (error) {
            console.error('Error fetching The Odds API schema:', error);
            return { error: 'Failed to fetch schema' };
        }
    }
}
exports.TheOddsApiConnector = TheOddsApiConnector;
//# sourceMappingURL=theOddsApiConnector.js.map