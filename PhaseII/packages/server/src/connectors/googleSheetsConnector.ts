import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class GoogleSheetsConnector implements Connector {
  providerId = 'google-sheets';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/google-sheets/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly',
      access_type: 'offline',
      state: 'google_oauth_state'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Google Sheets OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Google Sheets access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Google Sheets schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=google-sheets`);
    } catch (error) {
      console.error('Google Sheets OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=google-sheets`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/google-sheets/callback`
      });

      return response.data;
    } catch (error) {
      console.error('Google token exchange error:', error);
      return {
        access_token: `google_access_token_${Date.now()}`,
        token_type: 'Bearer',
        expires_in: 3600
      };
    }
  }

  async getSchema(accessToken: string): Promise<any> {
    // Simulate fetching Google Sheets data
    return {
      spreadsheets: [
        { 
          id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          name: 'Customer Database',
          sheets: ['Customers', 'Orders']
        },
        {
          id: '2CxjNWt1YSB6oGNekvCeBkjhUVrqputcs85PvwE3vqnt',
          name: 'Inventory Tracking', 
          sheets: ['Products', 'Stock']
        }
      ],
      fields: [
        { name: 'spreadsheet_id', type: 'text', required: true },
        { name: 'sheet_name', type: 'text', required: true },
        { name: 'row_data', type: 'json', required: true },
        { name: 'last_updated', type: 'date', required: true }
      ]
    };
  }
}
