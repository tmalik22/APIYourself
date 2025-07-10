import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class JiraConnector implements Connector {
  providerId = 'jira';

  getAuthUrl(): string {
    const params = querystring.stringify({
      audience: 'api.atlassian.com',
      client_id: process.env.JIRA_CLIENT_ID || 'demo_client_id',
      scope: 'read:jira-work read:jira-user offline_access',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/jira/callback`,
      response_type: 'code',
      prompt: 'consent',
      state: 'jira_oauth_state'
    });
    return `https://auth.atlassian.com/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Jira OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Jira access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Jira schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=jira`);
    } catch (error) {
      console.error('Jira OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=jira`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://auth.atlassian.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/jira/callback`
      }, {
        headers: {
          'Content-Type': 'application/json',
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
      // First get accessible resources (cloud sites)
      const resourcesResponse = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const resources = resourcesResponse.data;
      if (!resources || resources.length === 0) {
        return { error: 'No accessible Jira sites found' };
      }

      // Use the first resource to get projects
      const cloudId = resources[0].id;
      const projectsResponse = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      return {
        resources: resources,
        projects: projectsResponse.data || []
      };
    } catch (error) {
      console.error('Error fetching Jira schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
