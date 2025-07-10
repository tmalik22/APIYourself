"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleSheetsConnector_1 = require("./googleSheetsConnector");
const hubspotConnector_1 = require("./hubspotConnector");
const notionConnector_1 = require("./notionConnector");
const sentryConnector_1 = require("./sentryConnector");
const airtableConnector_1 = require("./airtableConnector");
const slackConnector_1 = require("./slackConnector");
const jiraConnector_1 = require("./jiraConnector");
const alphaVantageConnector_1 = require("./alphaVantageConnector");
const theOddsApiConnector_1 = require("./theOddsApiConnector");
const microsoftExcelConnector_1 = require("./microsoftExcelConnector");
const googleScholarConnector_1 = require("./googleScholarConnector");
const customDatasetConnector_1 = require("./customDatasetConnector");
const n8nConnector_1 = require("./n8nConnector");
// Export connectors keyed by provider ID (FREE SERVICES ONLY)
const connectors = {
    'google-sheets': new googleSheetsConnector_1.GoogleSheetsConnector(),
    'microsoft-excel': new microsoftExcelConnector_1.MicrosoftExcelConnector(),
    'hubspot': new hubspotConnector_1.HubSpotConnector(),
    'notion': new notionConnector_1.NotionConnector(),
    'sentry': new sentryConnector_1.SentryConnector(),
    'airtable': new airtableConnector_1.AirtableConnector(),
    'slack': new slackConnector_1.SlackConnector(),
    'jira': new jiraConnector_1.JiraConnector(),
    'alpha-vantage': new alphaVantageConnector_1.AlphaVantageConnector(),
    'the-odds-api': new theOddsApiConnector_1.TheOddsApiConnector(),
    'google-scholar': new googleScholarConnector_1.GoogleScholarConnector(),
    'custom-dataset': new customDatasetConnector_1.CustomDatasetConnector(),
    'n8n': new n8nConnector_1.N8nConnector(),
};
exports.default = connectors;
//# sourceMappingURL=index.js.map