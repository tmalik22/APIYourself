"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const airtable_1 = __importDefault(require("airtable"));
const router = (0, express_1.Router)();
// Airtable API Integration
class AirtableService {
    constructor() {
        const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT;
        if (!apiKey) {
            console.warn('⚠️ AIRTABLE_API_KEY not found. Airtable integration will not work.');
            return;
        }
        this.airtable = new airtable_1.default({ apiKey });
    }
    getBase(baseId) {
        if (!this.airtable) {
            throw new Error('Airtable not initialized - API key missing');
        }
        return this.airtable.base(baseId);
    }
    async getRecords(baseId, tableName, options = {}) {
        try {
            const base = this.getBase(baseId);
            const records = [];
            await base(tableName).select({
                maxRecords: options.maxRecords || 100,
                view: options.view,
                filterByFormula: options.filterByFormula,
                sort: options.sort
            }).eachPage((pageRecords, fetchNextPage) => {
                records.push(...pageRecords);
                fetchNextPage();
            });
            return records;
        }
        catch (error) {
            throw new Error(`Failed to get records: ${error.message}`);
        }
    }
    async getRecord(baseId, tableName, recordId) {
        try {
            const base = this.getBase(baseId);
            const record = await base(tableName).find(recordId);
            return record;
        }
        catch (error) {
            throw new Error(`Failed to get record: ${error.message}`);
        }
    }
    async createRecord(baseId, tableName, fields) {
        try {
            const base = this.getBase(baseId);
            const record = await base(tableName).create(fields);
            return record;
        }
        catch (error) {
            throw new Error(`Failed to create record: ${error.message}`);
        }
    }
    async createRecords(baseId, tableName, records) {
        try {
            const base = this.getBase(baseId);
            const createdRecords = await base(tableName).create(records);
            return createdRecords;
        }
        catch (error) {
            throw new Error(`Failed to create records: ${error.message}`);
        }
    }
    async updateRecord(baseId, tableName, recordId, fields) {
        try {
            const base = this.getBase(baseId);
            const record = await base(tableName).update(recordId, fields);
            return record;
        }
        catch (error) {
            throw new Error(`Failed to update record: ${error.message}`);
        }
    }
    async updateRecords(baseId, tableName, records) {
        try {
            const base = this.getBase(baseId);
            const updatedRecords = await base(tableName).update(records);
            return updatedRecords;
        }
        catch (error) {
            throw new Error(`Failed to update records: ${error.message}`);
        }
    }
    async deleteRecord(baseId, tableName, recordId) {
        try {
            const base = this.getBase(baseId);
            const deletedRecord = await base(tableName).destroy(recordId);
            return deletedRecord;
        }
        catch (error) {
            throw new Error(`Failed to delete record: ${error.message}`);
        }
    }
    async deleteRecords(baseId, tableName, recordIds) {
        try {
            const base = this.getBase(baseId);
            const deletedRecords = await base(tableName).destroy(recordIds);
            return deletedRecords;
        }
        catch (error) {
            throw new Error(`Failed to delete records: ${error.message}`);
        }
    }
}
const airtable = new AirtableService();
// Records endpoints
router.get('/:baseId/:tableName/records', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { maxRecords, view, filterByFormula, sort } = req.query;
        const options = {};
        if (maxRecords)
            options.maxRecords = parseInt(maxRecords);
        if (view)
            options.view = view;
        if (filterByFormula)
            options.filterByFormula = filterByFormula;
        if (sort)
            options.sort = JSON.parse(sort);
        const records = await airtable.getRecords(baseId, tableName, options);
        res.json({ success: true, records });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/:baseId/:tableName/records/:recordId', async (req, res) => {
    try {
        const { baseId, tableName, recordId } = req.params;
        const record = await airtable.getRecord(baseId, tableName, recordId);
        res.json({ success: true, record });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/:baseId/:tableName/records', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { fields, records } = req.body;
        let result;
        if (records && Array.isArray(records)) {
            // Bulk create
            result = await airtable.createRecords(baseId, tableName, records);
        }
        else if (fields) {
            // Single create
            result = await airtable.createRecord(baseId, tableName, fields);
        }
        else {
            return res.status(400).json({ error: 'Either fields or records array is required' });
        }
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/:baseId/:tableName/records/:recordId', async (req, res) => {
    try {
        const { baseId, tableName, recordId } = req.params;
        const { fields } = req.body;
        if (!fields) {
            return res.status(400).json({ error: 'Fields object is required' });
        }
        const record = await airtable.updateRecord(baseId, tableName, recordId, fields);
        res.json({ success: true, record });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/:baseId/:tableName/records', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { records } = req.body;
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ error: 'Records array is required' });
        }
        const updatedRecords = await airtable.updateRecords(baseId, tableName, records);
        res.json({ success: true, records: updatedRecords });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/:baseId/:tableName/records/:recordId', async (req, res) => {
    try {
        const { baseId, tableName, recordId } = req.params;
        const deletedRecord = await airtable.deleteRecord(baseId, tableName, recordId);
        res.json({ success: true, record: deletedRecord });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/:baseId/:tableName/records', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { recordIds } = req.body;
        if (!recordIds || !Array.isArray(recordIds)) {
            return res.status(400).json({ error: 'Record IDs array is required' });
        }
        const deletedRecords = await airtable.deleteRecords(baseId, tableName, recordIds);
        res.json({ success: true, records: deletedRecords });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Helper endpoints for common operations
router.post('/:baseId/:tableName/search', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { field, value, operator = '=' } = req.body;
        if (!field || value === undefined) {
            return res.status(400).json({ error: 'Field and value are required' });
        }
        let filterFormula;
        if (operator === '=') {
            filterFormula = `{${field}} = "${value}"`;
        }
        else if (operator === 'CONTAINS') {
            filterFormula = `SEARCH("${value}", {${field}})`;
        }
        else if (operator === '>') {
            filterFormula = `{${field}} > ${value}`;
        }
        else if (operator === '<') {
            filterFormula = `{${field}} < ${value}`;
        }
        else {
            filterFormula = `{${field}} ${operator} "${value}"`;
        }
        const records = await airtable.getRecords(baseId, tableName, { filterByFormula: filterFormula });
        res.json({ success: true, records });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/:baseId/:tableName/views', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        // Get records from default view to discover available views
        // Note: Airtable API doesn't directly expose view metadata, 
        // but you can get records from specific views
        const records = await airtable.getRecords(baseId, tableName, { maxRecords: 1 });
        res.json({
            success: true,
            message: 'Use view parameter in records endpoint to access specific views',
            example: `/api/plugins/airtable/${baseId}/${tableName}/records?view=Grid%20view`
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Bulk operations
router.post('/:baseId/:tableName/bulk-create', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { records } = req.body;
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ error: 'Records array is required' });
        }
        // Airtable API limits bulk operations to 10 records at a time
        const chunks = [];
        for (let i = 0; i < records.length; i += 10) {
            chunks.push(records.slice(i, i + 10));
        }
        const results = [];
        for (const chunk of chunks) {
            const chunkResult = await airtable.createRecords(baseId, tableName, chunk);
            results.push(...chunkResult);
        }
        res.json({ success: true, records: results });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/:baseId/:tableName/bulk-update', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { records } = req.body;
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ error: 'Records array is required' });
        }
        // Process in chunks of 10
        const chunks = [];
        for (let i = 0; i < records.length; i += 10) {
            chunks.push(records.slice(i, i + 10));
        }
        const results = [];
        for (const chunk of chunks) {
            const chunkResult = await airtable.updateRecords(baseId, tableName, chunk);
            results.push(...chunkResult);
        }
        res.json({ success: true, records: results });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// CSV import endpoint
router.post('/:baseId/:tableName/import-csv', async (req, res) => {
    try {
        const { baseId, tableName } = req.params;
        const { csvData, fieldMapping } = req.body;
        if (!csvData || !fieldMapping) {
            return res.status(400).json({ error: 'CSV data and field mapping are required' });
        }
        // Parse CSV data (simplified - you might want to use a CSV parser library)
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const records = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const fields = {};
                headers.forEach((header, index) => {
                    const mappedField = fieldMapping[header.trim()];
                    if (mappedField && values[index]) {
                        fields[mappedField] = values[index].trim();
                    }
                });
                if (Object.keys(fields).length > 0) {
                    records.push({ fields });
                }
            }
        }
        // Create records in chunks
        const chunks = [];
        for (let i = 0; i < records.length; i += 10) {
            chunks.push(records.slice(i, i + 10));
        }
        const results = [];
        for (const chunk of chunks) {
            const chunkResult = await airtable.createRecords(baseId, tableName, chunk);
            results.push(...chunkResult);
        }
        res.json({
            success: true,
            imported: results.length,
            records: results
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        if (!process.env.AIRTABLE_API_KEY && !process.env.AIRTABLE_PAT) {
            return res.status(400).json({
                error: 'Airtable API key not configured',
                setup: 'Set AIRTABLE_API_KEY or AIRTABLE_PAT environment variable'
            });
        }
        res.json({
            success: true,
            message: 'Airtable API is configured',
            usage: {
                'Get records': 'GET /:baseId/:tableName/records',
                'Create record': 'POST /:baseId/:tableName/records',
                'Update record': 'PATCH /:baseId/:tableName/records/:recordId',
                'Delete record': 'DELETE /:baseId/:tableName/records/:recordId',
                'Search records': 'POST /:baseId/:tableName/search'
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=airtable.js.map