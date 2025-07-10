"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Alpha Vantage API Integration for financial data
class AlphaVantageService {
    constructor() {
        this.baseUrl = 'https://www.alphavantage.co/query';
        this.apiKey = process.env.ALPHAVANTAGE_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ ALPHAVANTAGE_API_KEY not found. Alpha Vantage integration will not work.');
        }
    }
    async makeRequest(params) {
        try {
            const response = await axios_1.default.get(this.baseUrl, {
                params: {
                    ...params,
                    apikey: this.apiKey
                }
            });
            if (response.data['Error Message']) {
                throw new Error(response.data['Error Message']);
            }
            if (response.data['Note']) {
                throw new Error('API call frequency limit reached. Please retry in a few minutes.');
            }
            return response.data;
        }
        catch (error) {
            throw new Error(`Alpha Vantage API error: ${error.message}`);
        }
    }
    // Stock Time Series
    async getIntradayData(symbol, interval = '5min', adjusted = true, extended_hours = true, month, outputsize = 'compact') {
        const params = {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval,
            adjusted: adjusted ? 'true' : 'false',
            extended_hours: extended_hours ? 'true' : 'false',
            outputsize
        };
        if (month)
            params.month = month;
        return await this.makeRequest(params);
    }
    async getDailyData(symbol, outputsize = 'compact') {
        return await this.makeRequest({
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize
        });
    }
    async getDailyAdjustedData(symbol, outputsize = 'compact') {
        return await this.makeRequest({
            function: 'TIME_SERIES_DAILY_ADJUSTED',
            symbol,
            outputsize
        });
    }
    async getWeeklyData(symbol) {
        return await this.makeRequest({
            function: 'TIME_SERIES_WEEKLY',
            symbol
        });
    }
    async getWeeklyAdjustedData(symbol) {
        return await this.makeRequest({
            function: 'TIME_SERIES_WEEKLY_ADJUSTED',
            symbol
        });
    }
    async getMonthlyData(symbol) {
        return await this.makeRequest({
            function: 'TIME_SERIES_MONTHLY',
            symbol
        });
    }
    async getMonthlyAdjustedData(symbol) {
        return await this.makeRequest({
            function: 'TIME_SERIES_MONTHLY_ADJUSTED',
            symbol
        });
    }
    // Quote and Search
    async getQuote(symbol) {
        return await this.makeRequest({
            function: 'GLOBAL_QUOTE',
            symbol
        });
    }
    async searchSymbol(keywords) {
        return await this.makeRequest({
            function: 'SYMBOL_SEARCH',
            keywords
        });
    }
    // Market Status
    async getMarketStatus() {
        return await this.makeRequest({
            function: 'MARKET_STATUS'
        });
    }
    // Company Information
    async getCompanyOverview(symbol) {
        return await this.makeRequest({
            function: 'OVERVIEW',
            symbol
        });
    }
    async getEarningsData(symbol) {
        return await this.makeRequest({
            function: 'EARNINGS',
            symbol
        });
    }
    async getCashFlow(symbol) {
        return await this.makeRequest({
            function: 'CASH_FLOW',
            symbol
        });
    }
    async getIncomeStatement(symbol) {
        return await this.makeRequest({
            function: 'INCOME_STATEMENT',
            symbol
        });
    }
    async getBalanceSheet(symbol) {
        return await this.makeRequest({
            function: 'BALANCE_SHEET',
            symbol
        });
    }
    // Technical Indicators
    async getSMA(symbol, interval, time_period, series_type = 'close') {
        return await this.makeRequest({
            function: 'SMA',
            symbol,
            interval,
            time_period,
            series_type
        });
    }
    async getEMA(symbol, interval, time_period, series_type = 'close') {
        return await this.makeRequest({
            function: 'EMA',
            symbol,
            interval,
            time_period,
            series_type
        });
    }
    async getRSI(symbol, interval, time_period = 14, series_type = 'close') {
        return await this.makeRequest({
            function: 'RSI',
            symbol,
            interval,
            time_period,
            series_type
        });
    }
    async getMACD(symbol, interval, series_type = 'close', fastperiod = 12, slowperiod = 26, signalperiod = 9) {
        return await this.makeRequest({
            function: 'MACD',
            symbol,
            interval,
            series_type,
            fastperiod,
            slowperiod,
            signalperiod
        });
    }
    // Forex
    async getForexRate(from_currency, to_currency) {
        return await this.makeRequest({
            function: 'CURRENCY_EXCHANGE_RATE',
            from_currency,
            to_currency
        });
    }
    async getForexIntraday(from_symbol, to_symbol, interval = '5min', outputsize = 'compact') {
        return await this.makeRequest({
            function: 'FX_INTRADAY',
            from_symbol,
            to_symbol,
            interval,
            outputsize
        });
    }
    // Cryptocurrency
    async getCryptoIntraday(symbol, market = 'USD', interval = '5min', outputsize = 'compact') {
        return await this.makeRequest({
            function: 'CRYPTO_INTRADAY',
            symbol,
            market,
            interval,
            outputsize
        });
    }
    async getCryptoDaily(symbol, market = 'USD') {
        return await this.makeRequest({
            function: 'DIGITAL_CURRENCY_DAILY',
            symbol,
            market
        });
    }
    // Economic Indicators
    async getRealGDP() {
        return await this.makeRequest({
            function: 'REAL_GDP'
        });
    }
    async getInflationData() {
        return await this.makeRequest({
            function: 'INFLATION'
        });
    }
    async getUnemploymentRate() {
        return await this.makeRequest({
            function: 'UNEMPLOYMENT'
        });
    }
    async getFederalFundsRate() {
        return await this.makeRequest({
            function: 'FEDERAL_FUNDS_RATE'
        });
    }
}
const alphaVantage = new AlphaVantageService();
// Stock Time Series endpoints
router.get('/stocks/:symbol/intraday', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '5min', adjusted = 'true', extended_hours = 'true', month, outputsize = 'compact' } = req.query;
        const data = await alphaVantage.getIntradayData(symbol, interval, adjusted === 'true', extended_hours === 'true', month, outputsize);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/daily', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { outputsize = 'compact', adjusted } = req.query;
        const data = adjusted === 'true'
            ? await alphaVantage.getDailyAdjustedData(symbol, outputsize)
            : await alphaVantage.getDailyData(symbol, outputsize);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/weekly', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { adjusted } = req.query;
        const data = adjusted === 'true'
            ? await alphaVantage.getWeeklyAdjustedData(symbol)
            : await alphaVantage.getWeeklyData(symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/monthly', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { adjusted } = req.query;
        const data = adjusted === 'true'
            ? await alphaVantage.getMonthlyAdjustedData(symbol)
            : await alphaVantage.getMonthlyData(symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Quote and Search endpoints
router.get('/stocks/:symbol/quote', async (req, res) => {
    try {
        const data = await alphaVantage.getQuote(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/search/:keywords', async (req, res) => {
    try {
        const data = await alphaVantage.searchSymbol(req.params.keywords);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Market Status
router.get('/market/status', async (req, res) => {
    try {
        const data = await alphaVantage.getMarketStatus();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Company Information endpoints
router.get('/stocks/:symbol/overview', async (req, res) => {
    try {
        const data = await alphaVantage.getCompanyOverview(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/earnings', async (req, res) => {
    try {
        const data = await alphaVantage.getEarningsData(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/cash-flow', async (req, res) => {
    try {
        const data = await alphaVantage.getCashFlow(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/income-statement', async (req, res) => {
    try {
        const data = await alphaVantage.getIncomeStatement(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/balance-sheet', async (req, res) => {
    try {
        const data = await alphaVantage.getBalanceSheet(req.params.symbol);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Technical Indicators endpoints
router.get('/stocks/:symbol/indicators/sma', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = 'daily', time_period = '20', series_type = 'close' } = req.query;
        const data = await alphaVantage.getSMA(symbol, interval, parseInt(time_period), series_type);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/indicators/ema', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = 'daily', time_period = '20', series_type = 'close' } = req.query;
        const data = await alphaVantage.getEMA(symbol, interval, parseInt(time_period), series_type);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/indicators/rsi', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = 'daily', time_period = '14', series_type = 'close' } = req.query;
        const data = await alphaVantage.getRSI(symbol, interval, parseInt(time_period), series_type);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stocks/:symbol/indicators/macd', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = 'daily', series_type = 'close', fastperiod = '12', slowperiod = '26', signalperiod = '9' } = req.query;
        const data = await alphaVantage.getMACD(symbol, interval, series_type, parseInt(fastperiod), parseInt(slowperiod), parseInt(signalperiod));
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Forex endpoints
router.get('/forex/:from/:to', async (req, res) => {
    try {
        const { from, to } = req.params;
        const data = await alphaVantage.getForexRate(from, to);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/forex/:from/:to/intraday', async (req, res) => {
    try {
        const { from, to } = req.params;
        const { interval = '5min', outputsize = 'compact' } = req.query;
        const data = await alphaVantage.getForexIntraday(from, to, interval, outputsize);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Cryptocurrency endpoints
router.get('/crypto/:symbol/intraday', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { market = 'USD', interval = '5min', outputsize = 'compact' } = req.query;
        const data = await alphaVantage.getCryptoIntraday(symbol, market, interval, outputsize);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/crypto/:symbol/daily', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { market = 'USD' } = req.query;
        const data = await alphaVantage.getCryptoDaily(symbol, market);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Economic Indicators endpoints
router.get('/economic/gdp', async (req, res) => {
    try {
        const data = await alphaVantage.getRealGDP();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/economic/inflation', async (req, res) => {
    try {
        const data = await alphaVantage.getInflationData();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/economic/unemployment', async (req, res) => {
    try {
        const data = await alphaVantage.getUnemploymentRate();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/economic/federal-funds-rate', async (req, res) => {
    try {
        const data = await alphaVantage.getFederalFundsRate();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Helper endpoints
router.get('/popular-stocks', async (req, res) => {
    try {
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
        const quotes = [];
        for (const symbol of symbols) {
            try {
                const quote = await alphaVantage.getQuote(symbol);
                quotes.push({ symbol, quote });
            }
            catch (error) {
                console.warn(`Failed to get quote for ${symbol}:`, error);
            }
        }
        res.json({ success: true, quotes });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        if (!process.env.ALPHAVANTAGE_API_KEY) {
            return res.status(400).json({
                error: 'Alpha Vantage API key not configured',
                setup: 'Set ALPHAVANTAGE_API_KEY environment variable'
            });
        }
        // Test with a simple quote
        const testData = await alphaVantage.getQuote('IBM');
        res.json({
            success: true,
            message: 'Alpha Vantage API is working',
            testData: testData,
            authenticated: !!process.env.ALPHAVANTAGE_API_KEY
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=alpha-vantage.js.map