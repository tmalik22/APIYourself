import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class NotionConnector implements Connector {
  providerId = 'notion';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.NOTION_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/notion/callback`,
      response_type: 'code',
      owner: 'user',
      state: 'notion_oauth_state'
    });
    return `https://api.notion.com/v1/oauth/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Notion OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Notion access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Notion schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=notion`);
    } catch (error) {
      console.error('Notion OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=notion`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/notion/callback`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`
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
      // Get user info and search for databases
      const [userResponse, searchResponse] = await Promise.all([
        axios.get('https://api.notion.com/v1/users/me', {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Notion-Version': '2022-06-28'
          }
        }),
        axios.post('https://api.notion.com/v1/search', {
          filter: { object: 'database' },
          page_size: 5
        }, {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          }
        })
      ]);

      return {
        user: userResponse.data,
        databases: searchResponse.data.results || []
      };
    } catch (error) {
      console.error('Error fetching Notion schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
