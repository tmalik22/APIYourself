"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const web_api_1 = require("@slack/web-api");
const router = (0, express_1.Router)();
// Slack API Integration
class SlackService {
    constructor() {
        const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_TOKEN;
        if (!token) {
            console.warn('⚠️ SLACK_BOT_TOKEN not found. Slack integration will not work.');
        }
        this.client = new web_api_1.WebClient(token);
    }
    async postMessage(channel, text, options = {}) {
        try {
            const result = await this.client.chat.postMessage({
                channel,
                text,
                ...options
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to post message: ${error.message}`);
        }
    }
    async updateMessage(channel, ts, text, options = {}) {
        try {
            const result = await this.client.chat.update({
                channel,
                ts,
                text,
                ...options
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to update message: ${error.message}`);
        }
    }
    async deleteMessage(channel, ts) {
        try {
            const result = await this.client.chat.delete({
                channel,
                ts
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }
    async getChannels() {
        try {
            const result = await this.client.conversations.list({
                types: 'public_channel,private_channel'
            });
            return result.channels || [];
        }
        catch (error) {
            throw new Error(`Failed to get channels: ${error.message}`);
        }
    }
    async getUsers() {
        try {
            const result = await this.client.users.list({});
            return result.members || [];
        }
        catch (error) {
            throw new Error(`Failed to get users: ${error.message}`);
        }
    }
    async createChannel(name, isPrivate = false) {
        try {
            const result = await this.client.conversations.create({
                name,
                is_private: isPrivate
            });
            return result.channel;
        }
        catch (error) {
            throw new Error(`Failed to create channel: ${error.message}`);
        }
    }
    async inviteToChannel(channel, users) {
        try {
            const result = await this.client.conversations.invite({
                channel,
                users: users.join(',')
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to invite users: ${error.message}`);
        }
    }
    async getChannelHistory(channel, limit = 10) {
        try {
            const result = await this.client.conversations.history({
                channel,
                limit
            });
            return result.messages || [];
        }
        catch (error) {
            throw new Error(`Failed to get channel history: ${error.message}`);
        }
    }
    async uploadFile(channels, file, filename, title) {
        try {
            const result = await this.client.files.upload({
                channels,
                file,
                filename,
                title
            });
            return result.file;
        }
        catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }
    async addReaction(channel, timestamp, name) {
        try {
            const result = await this.client.reactions.add({
                channel,
                timestamp,
                name
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to add reaction: ${error.message}`);
        }
    }
    async setUserStatus(status_text, status_emoji = ':speech_balloon:') {
        try {
            const result = await this.client.users.profile.set({
                profile: {
                    status_text,
                    status_emoji
                }
            });
            return result;
        }
        catch (error) {
            throw new Error(`Failed to set status: ${error.message}`);
        }
    }
}
const slack = new SlackService();
// Message endpoints
router.post('/messages', async (req, res) => {
    try {
        const { channel, text, blocks, attachments } = req.body;
        if (!channel || !text) {
            return res.status(400).json({ error: 'Channel and text are required' });
        }
        const result = await slack.postMessage(channel, text, { blocks, attachments });
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put('/messages', async (req, res) => {
    try {
        const { channel, ts, text, blocks, attachments } = req.body;
        if (!channel || !ts || !text) {
            return res.status(400).json({ error: 'Channel, timestamp, and text are required' });
        }
        const result = await slack.updateMessage(channel, ts, text, { blocks, attachments });
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/messages', async (req, res) => {
    try {
        const { channel, ts } = req.body;
        if (!channel || !ts) {
            return res.status(400).json({ error: 'Channel and timestamp are required' });
        }
        const result = await slack.deleteMessage(channel, ts);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Channel endpoints
router.get('/channels', async (req, res) => {
    try {
        const channels = await slack.getChannels();
        res.json({ success: true, channels });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/channels', async (req, res) => {
    try {
        const { name, isPrivate } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Channel name is required' });
        }
        const channel = await slack.createChannel(name, isPrivate);
        res.json({ success: true, channel });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/channels/:channel/invite', async (req, res) => {
    try {
        const { channel } = req.params;
        const { users } = req.body;
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ error: 'Users array is required' });
        }
        const result = await slack.inviteToChannel(channel, users);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/channels/:channel/history', async (req, res) => {
    try {
        const { channel } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const messages = await slack.getChannelHistory(channel, limit);
        res.json({ success: true, messages });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// User endpoints
router.get('/users', async (req, res) => {
    try {
        const users = await slack.getUsers();
        res.json({ success: true, users });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/users/status', async (req, res) => {
    try {
        const { status_text, status_emoji } = req.body;
        if (!status_text) {
            return res.status(400).json({ error: 'Status text is required' });
        }
        const result = await slack.setUserStatus(status_text, status_emoji);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// File upload endpoint
router.post('/files', async (req, res) => {
    try {
        const { channels, file, filename, title } = req.body;
        if (!channels || !file || !filename) {
            return res.status(400).json({ error: 'Channels, file, and filename are required' });
        }
        // Convert base64 to buffer if needed
        const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file, 'base64');
        const result = await slack.uploadFile(channels, fileBuffer, filename, title);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Reactions endpoint
router.post('/reactions', async (req, res) => {
    try {
        const { channel, timestamp, name } = req.body;
        if (!channel || !timestamp || !name) {
            return res.status(400).json({ error: 'Channel, timestamp, and reaction name are required' });
        }
        const result = await slack.addReaction(channel, timestamp, name);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Interactive message templates
router.post('/messages/interactive', async (req, res) => {
    try {
        const { channel, text, title, fields, actions } = req.body;
        if (!channel || !text) {
            return res.status(400).json({ error: 'Channel and text are required' });
        }
        const blocks = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: text
                }
            }
        ];
        if (fields && Array.isArray(fields)) {
            blocks.push({
                type: 'section',
                fields: fields.map(field => ({
                    type: 'mrkdwn',
                    text: `*${field.title}:*\n${field.value}`
                }))
            });
        }
        if (actions && Array.isArray(actions)) {
            blocks.push({
                type: 'actions',
                elements: actions.map(action => ({
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: action.text
                    },
                    value: action.value,
                    action_id: action.action_id
                }))
            });
        }
        const result = await slack.postMessage(channel, text, { blocks });
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Webhook endpoint for Slack events
router.post('/webhooks', (req, res) => {
    try {
        const { type, challenge, event } = req.body;
        // Handle URL verification
        if (type === 'url_verification') {
            return res.json({ challenge });
        }
        // Handle events
        if (type === 'event_callback' && event) {
            console.log(`📱 Slack event received: ${event.type}`);
            switch (event.type) {
                case 'message':
                    console.log(`💬 Message from ${event.user}: ${event.text}`);
                    break;
                case 'app_mention':
                    console.log(`🔔 App mentioned by ${event.user}: ${event.text}`);
                    break;
                case 'channel_created':
                    console.log(`📝 Channel created: ${event.channel.name}`);
                    break;
                default:
                    console.log(`🔔 Unhandled event type: ${event.type}`);
            }
        }
        res.json({ received: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        const channels = await slack.getChannels();
        const users = await slack.getUsers();
        res.json({
            success: true,
            message: 'Slack API is working',
            stats: {
                channels: channels.length,
                users: users.length,
                botConnected: !!process.env.SLACK_BOT_TOKEN
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=slack.js.map