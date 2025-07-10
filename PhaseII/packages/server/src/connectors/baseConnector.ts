import { Request, Response } from 'express';

// Generic connector interface
export interface Connector {
  providerId: string;
  // Returns the URL to redirect users to for initiating OAuth2 flow
  getAuthUrl(): string;
  // Handles the OAuth2 callback request
  handleCallback(req: Request, res: Response): Promise<void>;
  // Fetches a sample schema or resource list after authentication
  getSchema?(accessToken: string): Promise<any>;
}
