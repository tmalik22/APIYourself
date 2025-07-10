import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class HubSpotConnector implements Connector {
  providerId = 'hubspot';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.HUBSPOT_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/hubspot/callback`,
      scope: 'contacts content reports social automation timeline business-intelligence oauth',
      response_type: 'code',
      state: 'hubspot_oauth_state'
    });
    return `https://app.hubspot.com/oauth/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`HubSpot OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('HubSpot access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('HubSpot schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=hubspot`);
    } catch (error) {
      console.error('HubSpot OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=hubspot`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://api.hubapi.com/oauth/v1/token', {
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/hubspot/callback`,
        code
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }

  async getSchema(accessToken: string): Promise<any> {
    try {
      // Get account info and contacts as a sample schema
      const [accountInfo, contactsResponse] = await Promise.all([
        axios.get('https://api.hubapi.com/account-info/v3/details', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        account: accountInfo.data,
        contacts: {
          sample: contactsResponse.data.results?.[0] || null,
          properties: contactsResponse.data.results?.[0] ? Object.keys(contactsResponse.data.results[0].properties) : []
        }
      };
    } catch (error) {
      console.error('Error fetching HubSpot schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
