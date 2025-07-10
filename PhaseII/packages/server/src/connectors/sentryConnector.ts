import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class SentryConnector implements Connector {
  providerId = 'sentry';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.SENTRY_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/sentry/callback`,
      response_type: 'code',
      scope: 'org:read project:read event:read',
      state: 'sentry_oauth_state'
    });
    return `https://sentry.io/oauth/authorize/?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Sentry OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Sentry access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Sentry schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=sentry`);
    } catch (error) {
      console.error('Sentry OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=sentry`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://sentry.io/oauth/token/', {
        grant_type: 'authorization_code',
        client_id: process.env.SENTRY_CLIENT_ID,
        client_secret: process.env.SENTRY_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/sentry/callback`
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
      // Get organizations and projects
      const [orgsResponse, projectsResponse] = await Promise.all([
        axios.get('https://sentry.io/api/0/organizations/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://sentry.io/api/0/projects/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        organizations: orgsResponse.data || [],
        projects: projectsResponse.data || []
      };
    } catch (error) {
      console.error('Error fetching Sentry schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
