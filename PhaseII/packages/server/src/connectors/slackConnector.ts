import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class SlackConnector implements Connector {
  providerId = 'slack';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.SLACK_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/slack/callback`,
      scope: 'channels:read chat:write users:read team:read',
      response_type: 'code',
      state: 'slack_oauth_state'
    });
    return `https://slack.com/oauth/v2/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Slack OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Slack access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Slack schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=slack`);
    } catch (error) {
      console.error('Slack OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=slack`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://slack.com/api/oauth.v2.access', {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/slack/callback`
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
      // Get team info and channels
      const [teamResponse, channelsResponse] = await Promise.all([
        axios.get('https://slack.com/api/team.info', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        team: teamResponse.data?.team || {},
        channels: channelsResponse.data?.channels || []
      };
    } catch (error) {
      console.error('Error fetching Slack schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
