import { Request, Response } from 'express';
import axios from 'axios';
import { Connector } from './baseConnector';

export class AlphaVantageConnector implements Connector {
  providerId = 'alpha-vantage';

  getAuthUrl(): string {
    // Alpha Vantage uses API keys, not OAuth
    // Redirect to a setup page or return directly
    return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=alpha-vantage`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      // For API key based services, we would handle the API key setup here
      const apiKey = req.query.api_key || process.env.ALPHA_VANTAGE_API_KEY;
      
      if (!apiKey) {
        throw new Error('No API key provided');
      }

      const schema = await this.getSchema(apiKey as string);
      console.log('Alpha Vantage schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=alpha-vantage`);
    } catch (error) {
      console.error('Alpha Vantage setup error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=alpha-vantage`);
    }
  }

  async getSchema(apiKey: string): Promise<any> {
    try {
      // Test the API key with a simple quote request
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${apiKey}`);
      
      return {
        functions: [
          'TIME_SERIES_DAILY',
          'TIME_SERIES_WEEKLY', 
          'TIME_SERIES_MONTHLY',
          'GLOBAL_QUOTE',
          'SYMBOL_SEARCH',
          'CURRENCY_EXCHANGE_RATE'
        ],
        sample_data: response.data
      };
    } catch (error) {
      console.error('Error fetching Alpha Vantage schema:', error);
      return { error: 'Failed to fetch schema' };
    }
  }
}
