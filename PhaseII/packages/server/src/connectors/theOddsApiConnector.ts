import { Request, Response } from 'express';
import axios from 'axios';
import { Connector } from './baseConnector';

export class TheOddsApiConnector implements Connector {
  providerId = 'the-odds-api';

  getAuthUrl(): string {
    // The Odds API uses API keys, not OAuth
    return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=the-odds-api`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const apiKey = req.query.api_key || process.env.THE_ODDS_API_KEY;
      
      if (!apiKey) {
        throw new Error('No API key provided');
      }

      const schema = await this.getSchema(apiKey as string);
      console.log('The Odds API schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=the-odds-api`);
    } catch (error) {
      console.error('The Odds API setup error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=the-odds-api`);
    }
  }

  async getSchema(apiKey: string): Promise<any> {
    try {
      // Get available sports
      const response = await axios.get(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`);
      
      return {
        sports: response.data || [],
        endpoints: [
          '/sports',
          '/sports/{sport}/odds',
          '/sports/{sport}/scores'
        ]
      };
    } catch (error) {
      console.error('Error fetching The Odds API schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
