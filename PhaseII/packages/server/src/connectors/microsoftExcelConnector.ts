import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';
import { Connector } from './baseConnector';

export class MicrosoftExcelConnector implements Connector {
  providerId = 'microsoft-excel';

  getAuthUrl(): string {
    const params = querystring.stringify({
      client_id: process.env.MICROSOFT_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/microsoft-excel/callback`,
      response_type: 'code',
      scope: 'https://graph.microsoft.com/Files.ReadWrite offline_access',
      response_mode: 'query',
      state: 'microsoft_excel_oauth_state'
    });
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      console.log(`Microsoft Excel OAuth callback - Code: ${code}, State: ${state}`);

      if (!code) {
        throw new Error('No authorization code received');
      }

      const tokenResponse = await this.exchangeCodeForToken(code as string);
      console.log('Microsoft Excel access token received:', tokenResponse.access_token);

      const schema = await this.getSchema(tokenResponse.access_token);
      console.log('Microsoft Excel schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=microsoft-excel`);
    } catch (error) {
      console.error('Microsoft Excel OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=microsoft-excel`);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        grant_type: 'authorization_code',
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/plugins/auth/microsoft-excel/callback`,
        scope: 'https://graph.microsoft.com/Files.ReadWrite offline_access'
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
      // Get user's drives and workbooks
      const [userResponse, drivesResponse] = await Promise.all([
        axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        axios.get('https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=name eq \'*.xlsx\'', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      return {
        user: userResponse.data,
        workbooks: drivesResponse.data?.value || []
      };
    } catch (error) {
      console.error('Error fetching Microsoft Excel schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
