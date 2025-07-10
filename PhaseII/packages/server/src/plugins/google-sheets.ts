import { Router, Request, Response } from 'express';
import { google } from 'googleapis';

const router = Router();

// Google Sheets API Integration
class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor() {
    // Initialize with service account or OAuth credentials
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      // Option 1: Service Account (recommended for server-to-server)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      }
      // Option 2: OAuth2 (for user contexts)
      else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        this.auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
        );
        
        if (process.env.GOOGLE_REFRESH_TOKEN) {
          this.auth.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });
        }
      }
      // Option 3: Fallback to default credentials
      else {
        this.auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      }

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets auth:', error);
    }
  }

  async getSpreadsheet(spreadsheetId: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get spreadsheet: ${error.message}`);
    }
  }

  async readRange(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING'
      });
      return response.data.values || [];
    } catch (error: any) {
      throw new Error(`Failed to read range: ${error.message}`);
    }
  }

  async writeRange(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to write range: ${error.message}`);
    }
  }

  async appendData(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to append data: ${error.message}`);
    }
  }

  async clearRange(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
        requestBody: {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to clear range: ${error.message}`);
    }
  }

  async createSpreadsheet(title: string, sheets: string[] = ['Sheet1']) {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: { title },
          sheets: sheets.map(sheetTitle => ({
            properties: { title: sheetTitle }
          }))
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create spreadsheet: ${error.message}`);
    }
  }

  async batchUpdate(spreadsheetId: string, requests: any[]) {
    try {
      const response = await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to batch update: ${error.message}`);
    }
  }
}

const googleSheets = new GoogleSheetsService();

// OAuth2 flow endpoints (if using OAuth instead of service account)
router.get('/auth/url', (req: Request, res: Response) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ error: 'Google OAuth not configured' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
      prompt: 'consent'
    });

    res.json({ success: true, authUrl });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/callback', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    res.json({ 
      success: true, 
      tokens,
      message: 'Save the refresh_token to GOOGLE_REFRESH_TOKEN environment variable'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Spreadsheet operations
router.get('/spreadsheets/:id', async (req: Request, res: Response) => {
  try {
    const spreadsheet = await googleSheets.getSpreadsheet(req.params.id);
    res.json({ success: true, spreadsheet });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/spreadsheets/:id/values/:range', async (req: Request, res: Response) => {
  try {
    const { id, range } = req.params;
    const values = await googleSheets.readRange(id, decodeURIComponent(range));
    res.json({ success: true, values });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/spreadsheets/:id/values/:range', async (req: Request, res: Response) => {
  try {
    const { id, range } = req.params;
    const { values } = req.body;
    
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({ error: 'Values array required' });
    }
    
    const result = await googleSheets.writeRange(id, decodeURIComponent(range), values);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/spreadsheets/:id/values/:range/append', async (req: Request, res: Response) => {
  try {
    const { id, range } = req.params;
    const { values } = req.body;
    
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({ error: 'Values array required' });
    }
    
    const result = await googleSheets.appendData(id, decodeURIComponent(range), values);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/spreadsheets/:id/values/:range', async (req: Request, res: Response) => {
  try {
    const { id, range } = req.params;
    const result = await googleSheets.clearRange(id, decodeURIComponent(range));
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/spreadsheets', async (req: Request, res: Response) => {
  try {
    const { title, sheets } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }
    
    const spreadsheet = await googleSheets.createSpreadsheet(title, sheets);
    res.json({ success: true, spreadsheet });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/spreadsheets/:id/batch-update', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { requests } = req.body;
    
    if (!requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: 'Requests array required' });
    }
    
    const result = await googleSheets.batchUpdate(id, requests);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Utility endpoints
router.get('/test', async (req: Request, res: Response) => {
  try {
    // Test with a public spreadsheet (read-only)
    const testSpreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Google's example sheet
    const values = await googleSheets.readRange(testSpreadsheetId, 'Class Data!A2:E');
    
    res.json({ 
      success: true, 
      message: 'Google Sheets API is working',
      sampleData: values.slice(0, 3) // First 3 rows
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
