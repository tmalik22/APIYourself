import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class AirtableConnector implements Connector {
  providerId = 'airtable';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.AIRTABLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/airtable/callback`,
      response_type: 'code',
      scope: 'data.records:read data.records:write schema.bases:read',
      state: 'airtable_oauth_state'
    });
    return `https://airtable.com/oauth2/v1/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Airtable OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Airtable access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Airtable schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=airtable`);
    } catch (error) {
      console.error('Airtable OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=airtable`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://airtable.com/oauth2/v1/token', {
        grant_type: 'authorization_code',
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/airtable/callback`
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
      // Get user info and bases
      const [userResponse, basesResponse] = await Promise.all([
        axios.get('https://api.airtable.com/v0/meta/whoami', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://api.airtable.com/v0/meta/bases', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        user: userResponse.data,
        bases: basesResponse.data?.bases || []
      };
    } catch (error) {
      console.error('Error fetching Airtable schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
