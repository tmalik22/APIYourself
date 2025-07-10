import { GoogleSheetsConnector } from './googleSheetsConnector';
import { HubSpotConnector } from './hubspotConnector';
import { NotionConnector } from './notionConnector';
import { SentryConnector } from './sentryConnector';
import { AirtableConnector } from './airtableConnector';
import { SlackConnector } from './slackConnector';
import { JiraConnector } from './jiraConnector';
import { AlphaVantageConnector } from './alphaVantageConnector';
import { TheOddsApiConnector } from './theOddsApiConnector';
import { MicrosoftExcelConnector } from './microsoftExcelConnector';
import { GoogleScholarConnector } from './googleScholarConnector';
import { CustomDatasetConnector } from './customDatasetConnector';
import { N8nConnector } from './n8nConnector';

// Export connectors keyed by provider ID (FREE SERVICES ONLY)
const connectors: { [key: string]: any } = {
  'google-sheets': new GoogleSheetsConnector(),
  'microsoft-excel': new MicrosoftExcelConnector(),
  'hubspot': new HubSpotConnector(),
  'notion': new NotionConnector(),
  'sentry': new SentryConnector(),
  'airtable': new AirtableConnector(),
  'slack': new SlackConnector(),
  'jira': new JiraConnector(),
  'alpha-vantage': new AlphaVantageConnector(),
  'the-odds-api': new TheOddsApiConnector(),
  'google-scholar': new GoogleScholarConnector(),
  'custom-dataset': new CustomDatasetConnector(),
  'n8n': new N8nConnector(),
};

export default connectors;
