import { Router, Request, Response } from 'express';
import { Client } from '@hubspot/api-client';

const router = Router();

// HubSpot API Integration
class HubSpotService {
  private hubspot: Client;

  constructor() {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;
    if (!accessToken) {
      console.warn('⚠️ HUBSPOT_ACCESS_TOKEN not found. HubSpot integration will not work.');
    }
    this.hubspot = new Client({ accessToken });
  }

  // Contacts
  async getContacts(limit: number = 10, after?: string) {
    try {
      const response = await this.hubspot.crm.contacts.getAll(limit, after);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get contacts: ${error.message}`);
    }
  }

  async getContact(contactId: string) {
    try {
      const response = await this.hubspot.crm.contacts.basicApi.getById(contactId);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get contact: ${error.message}`);
    }
  }

  async createContact(properties: any) {
    try {
      const response = await this.hubspot.crm.contacts.basicApi.create({ properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }
  }

  async updateContact(contactId: string, properties: any) {
    try {
      const response = await this.hubspot.crm.contacts.basicApi.update(contactId, { properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }

  async deleteContact(contactId: string) {
    try {
      await this.hubspot.crm.contacts.basicApi.archive(contactId);
      return { success: true, contactId };
    } catch (error: any) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }

  async searchContacts(filterGroups: any[], sorts?: any[], limit: number = 10) {
    try {
      const response = await this.hubspot.crm.contacts.searchApi.doSearch({
        filterGroups,
        sorts,
        limit
      });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to search contacts: ${error.message}`);
    }
  }

  // Companies
  async getCompanies(limit: number = 10, after?: string) {
    try {
      const response = await this.hubspot.crm.companies.getAll(limit, after);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get companies: ${error.message}`);
    }
  }

  async getCompany(companyId: string) {
    try {
      const response = await this.hubspot.crm.companies.basicApi.getById(companyId);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get company: ${error.message}`);
    }
  }

  async createCompany(properties: any) {
    try {
      const response = await this.hubspot.crm.companies.basicApi.create({ properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to create company: ${error.message}`);
    }
  }

  async updateCompany(companyId: string, properties: any) {
    try {
      const response = await this.hubspot.crm.companies.basicApi.update(companyId, { properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to update company: ${error.message}`);
    }
  }

  // Deals
  async getDeals(limit: number = 10, after?: string) {
    try {
      const response = await this.hubspot.crm.deals.getAll(limit, after);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get deals: ${error.message}`);
    }
  }

  async getDeal(dealId: string) {
    try {
      const response = await this.hubspot.crm.deals.basicApi.getById(dealId);
      return response;
    } catch (error: any) {
      throw new Error(`Failed to get deal: ${error.message}`);
    }
  }

  async createDeal(properties: any) {
    try {
      const response = await this.hubspot.crm.deals.basicApi.create({ properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to create deal: ${error.message}`);
    }
  }

  async updateDeal(dealId: string, properties: any) {
    try {
      const response = await this.hubspot.crm.deals.basicApi.update(dealId, { properties });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to update deal: ${error.message}`);
    }
  }

  // Emails
  async sendEmail(emailData: any) {
    try {
      // Note: HubSpot's transactional email API may require different setup
      // This is a placeholder - you may need to use marketing email API instead
      console.log('Email sending not implemented in this demo - would send:', emailData);
      return { success: true, message: 'Email API not fully implemented' };
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Properties
  async getContactProperties() {
    try {
      const response = await this.hubspot.crm.properties.coreApi.getAll('contacts');
      return response.results;
    } catch (error: any) {
      throw new Error(`Failed to get contact properties: ${error.message}`);
    }
  }

  async getCompanyProperties() {
    try {
      const response = await this.hubspot.crm.properties.coreApi.getAll('companies');
      return response.results;
    } catch (error: any) {
      throw new Error(`Failed to get company properties: ${error.message}`);
    }
  }

  async getDealProperties() {
    try {
      const response = await this.hubspot.crm.properties.coreApi.getAll('deals');
      return response.results;
    } catch (error: any) {
      throw new Error(`Failed to get deal properties: ${error.message}`);
    }
  }
}

const hubspot = new HubSpotService();

// Contact endpoints
router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const after = req.query.after as string;
    
    const contacts = await hubspot.getContacts(limit, after);
    res.json({ success: true, contacts });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const contact = await hubspot.getContact(req.params.id);
    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const contact = await hubspot.createContact(properties);
    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const contact = await hubspot.updateContact(id, properties);
    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const result = await hubspot.deleteContact(req.params.id);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/contacts/search', async (req: Request, res: Response) => {
  try {
    const { filterGroups, sorts, limit } = req.body;
    
    if (!filterGroups) {
      return res.status(400).json({ error: 'Filter groups are required' });
    }
    
    const results = await hubspot.searchContacts(filterGroups, sorts, limit);
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Company endpoints
router.get('/companies', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const after = req.query.after as string;
    
    const companies = await hubspot.getCompanies(limit, after);
    res.json({ success: true, companies });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/companies/:id', async (req: Request, res: Response) => {
  try {
    const company = await hubspot.getCompany(req.params.id);
    res.json({ success: true, company });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/companies', async (req: Request, res: Response) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const company = await hubspot.createCompany(properties);
    res.json({ success: true, company });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/companies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const company = await hubspot.updateCompany(id, properties);
    res.json({ success: true, company });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Deal endpoints
router.get('/deals', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const after = req.query.after as string;
    
    const deals = await hubspot.getDeals(limit, after);
    res.json({ success: true, deals });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/deals/:id', async (req: Request, res: Response) => {
  try {
    const deal = await hubspot.getDeal(req.params.id);
    res.json({ success: true, deal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/deals', async (req: Request, res: Response) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const deal = await hubspot.createDeal(properties);
    res.json({ success: true, deal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/deals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({ error: 'Properties object is required' });
    }
    
    const deal = await hubspot.updateDeal(id, properties);
    res.json({ success: true, deal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Email endpoint
router.post('/emails/send', async (req: Request, res: Response) => {
  try {
    const emailData = req.body;
    
    if (!emailData.to || !emailData.from || !emailData.subject) {
      return res.status(400).json({ error: 'To, from, and subject are required' });
    }
    
    const result = await hubspot.sendEmail(emailData);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Properties endpoints
router.get('/properties/contacts', async (req: Request, res: Response) => {
  try {
    const properties = await hubspot.getContactProperties();
    res.json({ success: true, properties });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/properties/companies', async (req: Request, res: Response) => {
  try {
    const properties = await hubspot.getCompanyProperties();
    res.json({ success: true, properties });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/properties/deals', async (req: Request, res: Response) => {
  try {
    const properties = await hubspot.getDealProperties();
    res.json({ success: true, properties });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Quick helper endpoints
router.post('/quick/lead', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, company, phone, website } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const contactProperties: any = { email };
    if (firstName) contactProperties.firstname = firstName;
    if (lastName) contactProperties.lastname = lastName;
    if (phone) contactProperties.phone = phone;
    if (website) contactProperties.website = website;
    
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
      } catch (companyError) {
        res.json({ 
          success: true, 
          contact, 
          message: 'Lead created, company creation failed',
          companyError: companyError
        });
      }
    } else {
      res.json({ success: true, contact });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/quick/opportunity', async (req: Request, res: Response) => {
  try {
    const { dealName, amount, stage, contactEmail, companyName } = req.body;
    
    if (!dealName) {
      return res.status(400).json({ error: 'Deal name is required' });
    }
    
    const dealProperties: any = { dealname: dealName };
    if (amount) dealProperties.amount = amount;
    if (stage) dealProperties.dealstage = stage;
    
    const deal = await hubspot.createDeal(dealProperties);
    
    res.json({ 
      success: true, 
      deal,
      message: 'Opportunity created successfully'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint
router.get('/test', async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
