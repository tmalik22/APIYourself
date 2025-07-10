"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_client_1 = require("@hubspot/api-client");
const router = (0, express_1.Router)();
// HubSpot API Integration
class HubSpotService {
    constructor() {
        const accessToken = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;
        if (!accessToken) {
            console.warn('⚠️ HUBSPOT_ACCESS_TOKEN not found. HubSpot integration will not work.');
        }
        this.hubspot = new api_client_1.Client({ accessToken });
    }
    // Contacts
    async getContacts(limit = 10, after) {
        try {
            const response = await this.hubspot.crm.contacts.getAll(limit, after);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get contacts: ${error.message}`);
        }
    }
    async getContact(contactId) {
        try {
            const response = await this.hubspot.crm.contacts.basicApi.getById(contactId);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get contact: ${error.message}`);
        }
    }
    async createContact(properties) {
        try {
            const response = await this.hubspot.crm.contacts.basicApi.create({ properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to create contact: ${error.message}`);
        }
    }
    async updateContact(contactId, properties) {
        try {
            const response = await this.hubspot.crm.contacts.basicApi.update(contactId, { properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to update contact: ${error.message}`);
        }
    }
    async deleteContact(contactId) {
        try {
            await this.hubspot.crm.contacts.basicApi.archive(contactId);
            return { success: true, contactId };
        }
        catch (error) {
            throw new Error(`Failed to delete contact: ${error.message}`);
        }
    }
    async searchContacts(filterGroups, sorts, limit = 10) {
        try {
            const response = await this.hubspot.crm.contacts.searchApi.doSearch({
                filterGroups,
                sorts,
                limit
            });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to search contacts: ${error.message}`);
        }
    }
    // Companies
    async getCompanies(limit = 10, after) {
        try {
            const response = await this.hubspot.crm.companies.getAll(limit, after);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get companies: ${error.message}`);
        }
    }
    async getCompany(companyId) {
        try {
            const response = await this.hubspot.crm.companies.basicApi.getById(companyId);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get company: ${error.message}`);
        }
    }
    async createCompany(properties) {
        try {
            const response = await this.hubspot.crm.companies.basicApi.create({ properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to create company: ${error.message}`);
        }
    }
    async updateCompany(companyId, properties) {
        try {
            const response = await this.hubspot.crm.companies.basicApi.update(companyId, { properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to update company: ${error.message}`);
        }
    }
    // Deals
    async getDeals(limit = 10, after) {
        try {
            const response = await this.hubspot.crm.deals.getAll(limit, after);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get deals: ${error.message}`);
        }
    }
    async getDeal(dealId) {
        try {
            const response = await this.hubspot.crm.deals.basicApi.getById(dealId);
            return response;
        }
        catch (error) {
            throw new Error(`Failed to get deal: ${error.message}`);
        }
    }
    async createDeal(properties) {
        try {
            const response = await this.hubspot.crm.deals.basicApi.create({ properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to create deal: ${error.message}`);
        }
    }
    async updateDeal(dealId, properties) {
        try {
            const response = await this.hubspot.crm.deals.basicApi.update(dealId, { properties });
            return response;
        }
        catch (error) {
            throw new Error(`Failed to update deal: ${error.message}`);
        }
    }
    // Emails
    async sendEmail(emailData) {
        try {
            // Note: HubSpot's transactional email API may require different setup
            // This is a placeholder - you may need to use marketing email API instead
            console.log('Email sending not implemented in this demo - would send:', emailData);
            return { success: true, message: 'Email API not fully implemented' };
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    // Properties
    async getContactProperties() {
        try {
            const response = await this.hubspot.crm.properties.coreApi.getAll('contacts');
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get contact properties: ${error.message}`);
        }
    }
    async getCompanyProperties() {
        try {
            const response = await this.hubspot.crm.properties.coreApi.getAll('companies');
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get company properties: ${error.message}`);
        }
    }
    async getDealProperties() {
        try {
            const response = await this.hubspot.crm.properties.coreApi.getAll('deals');
            return response.results;
        }
        catch (error) {
            throw new Error(`Failed to get deal properties: ${error.message}`);
        }
    }
}
const hubspot = new HubSpotService();
// Contact endpoints
router.get('/contacts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const after = req.query.after;
        const contacts = await hubspot.getContacts(limit, after);
        res.json({ success: true, contacts });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/contacts/:id', async (req, res) => {
    try {
        const contact = await hubspot.getContact(req.params.id);
        res.json({ success: true, contact });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/contacts', async (req, res) => {
    try {
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const contact = await hubspot.createContact(properties);
        res.json({ success: true, contact });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const contact = await hubspot.updateContact(id, properties);
        res.json({ success: true, contact });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/contacts/:id', async (req, res) => {
    try {
        const result = await hubspot.deleteContact(req.params.id);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/contacts/search', async (req, res) => {
    try {
        const { filterGroups, sorts, limit } = req.body;
        if (!filterGroups) {
            return res.status(400).json({ error: 'Filter groups are required' });
        }
        const results = await hubspot.searchContacts(filterGroups, sorts, limit);
        res.json({ success: true, results });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Company endpoints
router.get('/companies', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const after = req.query.after;
        const companies = await hubspot.getCompanies(limit, after);
        res.json({ success: true, companies });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/companies/:id', async (req, res) => {
    try {
        const company = await hubspot.getCompany(req.params.id);
        res.json({ success: true, company });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/companies', async (req, res) => {
    try {
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const company = await hubspot.createCompany(properties);
        res.json({ success: true, company });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/companies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const company = await hubspot.updateCompany(id, properties);
        res.json({ success: true, company });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Deal endpoints
router.get('/deals', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const after = req.query.after;
        const deals = await hubspot.getDeals(limit, after);
        res.json({ success: true, deals });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/deals/:id', async (req, res) => {
    try {
        const deal = await hubspot.getDeal(req.params.id);
        res.json({ success: true, deal });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/deals', async (req, res) => {
    try {
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const deal = await hubspot.createDeal(properties);
        res.json({ success: true, deal });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/deals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { properties } = req.body;
        if (!properties) {
            return res.status(400).json({ error: 'Properties object is required' });
        }
        const deal = await hubspot.updateDeal(id, properties);
        res.json({ success: true, deal });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Email endpoint
router.post('/emails/send', async (req, res) => {
    try {
        const emailData = req.body;
        if (!emailData.to || !emailData.from || !emailData.subject) {
            return res.status(400).json({ error: 'To, from, and subject are required' });
        }
        const result = await hubspot.sendEmail(emailData);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Properties endpoints
router.get('/properties/contacts', async (req, res) => {
    try {
        const properties = await hubspot.getContactProperties();
        res.json({ success: true, properties });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/properties/companies', async (req, res) => {
    try {
        const properties = await hubspot.getCompanyProperties();
        res.json({ success: true, properties });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/properties/deals', async (req, res) => {
    try {
        const properties = await hubspot.getDealProperties();
        res.json({ success: true, properties });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Quick helper endpoints
router.post('/quick/lead', async (req, res) => {
    try {
        const { email, firstName, lastName, company, phone, website } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const contactProperties = { email };
        if (firstName)
            contactProperties.firstname = firstName;
        if (lastName)
            contactProperties.lastname = lastName;
        if (phone)
            contactProperties.phone = phone;
        if (website)
            contactProperties.website = website;
        const contact = await hubspot.createContact(contactProperties);
        // If company is provided, create or find company and associate
        if (company) {
            try {
                const companyResult = await hubspot.createCompany({ name: company });
                res.json({
                    success: true,
                    contact,
                    company: companyResult,
                    message: 'Lead and company created successfully'
                });
            }
            catch (companyError) {
                res.json({
                    success: true,
                    contact,
                    message: 'Lead created, company creation failed',
                    companyError: companyError
                });
            }
        }
        else {
            res.json({ success: true, contact });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/quick/opportunity', async (req, res) => {
    try {
        const { dealName, amount, stage, contactEmail, companyName } = req.body;
        if (!dealName) {
            return res.status(400).json({ error: 'Deal name is required' });
        }
        const dealProperties = { dealname: dealName };
        if (amount)
            dealProperties.amount = amount;
        if (stage)
            dealProperties.dealstage = stage;
        const deal = await hubspot.createDeal(dealProperties);
        res.json({
            success: true,
            deal,
            message: 'Opportunity created successfully'
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoint
router.get('/test', async (req, res) => {
    try {
        const contacts = await hubspot.getContacts(1);
        const companies = await hubspot.getCompanies(1);
        const deals = await hubspot.getDeals(1);
        res.json({
            success: true,
            message: 'HubSpot API is working',
            stats: {
                contactsAvailable: contacts.length || 0,
                companiesAvailable: companies.length || 0,
                dealsAvailable: deals.length || 0,
                authenticated: !!process.env.HUBSPOT_ACCESS_TOKEN
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=hubspot.js.map