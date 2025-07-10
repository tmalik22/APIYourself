"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@notionhq/client");
const router = (0, express_1.Router)();
// Notion API Integration
class NotionService {
    constructor() {
        const token = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
        if (!token) {
            console.warn('⚠️ NOTION_TOKEN not found. Notion integration will not work.');
        }
        this.notion = new client_1.Client({ auth: token });
    }
    async getDatabases() {
        try {
            const response = await this.notion.search({
                filter: { property: 'object', value: 'database' }
            });
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get databases: ${error.message}`);
        }
    }
    async getDatabase(databaseId) {
        try {
            const response = await this.notion.databases.retrieve({
                database_id: databaseId
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get database: ${error.message}`);
        }
    }
    async queryDatabase(databaseId, filter, sorts, pageSize = 10) {
        try {
            const response = await this.notion.databases.query({
                database_id: databaseId,
                filter,
                sorts,
                page_size: pageSize
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to query database: ${error.message}`);
        }
    }
    async createPage(parent, properties, children) {
        try {
            const response = await this.notion.pages.create({
                parent,
                properties,
                children
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to create page: ${error.message}`);
        }
    }
    async updatePage(pageId, properties) {
        try {
            const response = await this.notion.pages.update({
                page_id: pageId,
                properties
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to update page: ${error.message}`);
        }
    }
    async getPage(pageId) {
        try {
            const response = await this.notion.pages.retrieve({
                page_id: pageId
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get page: ${error.message}`);
        }
    }
    async getPageBlocks(pageId) {
        try {
            const response = await this.notion.blocks.children.list({
                block_id: pageId
            });
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get page blocks: ${error.message}`);
        }
    }
    async appendBlocks(pageId, children) {
        try {
            const response = await this.notion.blocks.children.append({
                block_id: pageId,
                children
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to append blocks: ${error.message}`);
        }
    }
    async updateBlock(blockId, block) {
        try {
            const response = await this.notion.blocks.update({
                block_id: blockId,
                ...block
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to update block: ${error.message}`);
        }
    }
    async deleteBlock(blockId) {
        try {
            const response = await this.notion.blocks.delete({
                block_id: blockId
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to delete block: ${error.message}`);
        }
    }
    async searchPages(query) {
        try {
            const response = await this.notion.search({
                query,
                filter: { property: 'object', value: 'page' }
            });
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to search pages: ${error.message}`);
        }
    }
    async getUsers() {
        try {
            const response = await this.notion.users.list({});
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get users: ${error.message}`);
        }
    }
}
const notion = new NotionService();
// Database endpoints
router.get('/databases', async (req, res) => {
    try {
        const databases = await notion.getDatabases();
        res.json({ success: true, databases });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/databases/:id', async (req, res) => {
    try {
        const database = await notion.getDatabase(req.params.id);
        res.json({ success: true, database });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/databases/:id/query', async (req, res) => {
    try {
        const { id } = req.params;
        const { filter, sorts, pageSize } = req.body;
        const result = await notion.queryDatabase(id, filter, sorts, pageSize);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Page endpoints
router.post('/pages', async (req, res) => {
    try {
        const { parent, properties, children } = req.body;
        if (!parent || !properties) {
            return res.status(400).json({ error: 'Parent and properties are required' });
        }
        const page = await notion.createPage(parent, properties, children);
        res.json({ success: true, page });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/pages/:id', async (req, res) => {
    try {
        const page = await notion.getPage(req.params.id);
        res.json({ success: true, page });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/pages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties are required' });
        }
        const page = await notion.updatePage(id, properties);
        res.json({ success: true, page });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Block endpoints
router.get('/pages/:id/blocks', async (req, res) => {
    try {
        const blocks = await notion.getPageBlocks(req.params.id);
        res.json({ success: true, blocks });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/pages/:id/blocks', async (req, res) => {
    try {
        const { id } = req.params;
        const { children } = req.body;
        if (!children || !Array.isArray(children)) {
            return res.status(400).json({ error: 'Children array is required' });
        }
        const result = await notion.appendBlocks(id, children);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const block = req.body;
        const result = await notion.updateBlock(id, block);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/blocks/:id', async (req, res) => {
    try {
        const result = await notion.deleteBlock(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Search endpoint
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const pages = await notion.searchPages(query);
        res.json({ success: true, pages });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Users endpoint
router.get('/users', async (req, res) => {
    try {
        const users = await notion.getUsers();
        res.json({ success: true, users });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Helper endpoints for common operations
router.post('/quick/task', async (req, res) => {
    try {
        const { databaseId, title, status, assignee, dueDate } = req.body;
        if (!databaseId || !title) {
            return res.status(400).json({ error: 'Database ID and title are required' });
        }
        const properties = {
            'Name': {
                title: [{ text: { content: title } }]
            }
        };
        if (status) {
            properties['Status'] = { select: { name: status } };
        }
        if (assignee) {
            properties['Assignee'] = { people: [{ id: assignee }] };
        }
        if (dueDate) {
            properties['Due Date'] = { date: { start: dueDate } };
        }
        const page = await notion.createPage({ database_id: databaseId }, properties);
        res.json({ success: true, page });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/quick/note', async (req, res) => {
    try {
        const { parentId, title, content } = req.body;
        if (!parentId || !title) {
            return res.status(400).json({ error: 'Parent ID and title are required' });
        }
        const children = [
            {
                object: 'block',
                type: 'heading_1',
                heading_1: {
                    rich_text: [{ type: 'text', text: { content: title } }]
                }
            }
        ];
        if (content) {
            children.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content } }]
                }
            });
        }
        const page = await notion.createPage({ page_id: parentId }, {
            title: [{ text: { content: title } }]
        }, children);
        res.json({ success: true, page });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Template endpoints
router.get('/templates/blocks', (req, res) => {
    const templates = {
        heading1: {
            object: 'block',
            type: 'heading_1',
            heading_1: {
                rich_text: [{ type: 'text', text: { content: 'Heading 1' } }]
            }
        },
        paragraph: {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [{ type: 'text', text: { content: 'Your text here' } }]
            }
        },
        bulletList: {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'List item' } }]
            }
        },
        numberList: {
            object: 'block',
            type: 'numbered_list_item',
            numbered_list_item: {
                rich_text: [{ type: 'text', text: { content: 'List item' } }]
            }
        },
        todo: {
            object: 'block',
            type: 'to_do',
            to_do: {
                rich_text: [{ type: 'text', text: { content: 'Task to complete' } }],
                checked: false
            }
        },
        code: {
            object: 'block',
            type: 'code',
            code: {
                rich_text: [{ type: 'text', text: { content: 'console.log("Hello World");' } }],
                language: 'javascript'
            }
        }
    };
    res.json({ success: true, templates });
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        const databases = await notion.getDatabases();
        const users = await notion.getUsers();
        res.json({
            success: true,
            message: 'Notion API is working',
            stats: {
                databases: databases.length,
                users: users.length,
                authenticated: !!process.env.NOTION_TOKEN
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=notion.js.map