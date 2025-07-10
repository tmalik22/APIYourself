# Real API Plugins - Setup Guide

This document explains how to set up and use the real API integrations in your API builder. Each plugin connects to actual external services with proper authentication and full functionality.

## 🎯 Overview

**Real Plugins Available:**
- ✅ **Google Sheets** - Full CRUD operations with Google Sheets API
- ✅ **Slack** - Send messages, manage channels, file uploads
- ✅ **Notion** - Create pages, manage databases, blocks
- ✅ **Airtable** - Record management, search, bulk operations
- ✅ **HubSpot** - CRM operations, contacts, deals, companies
- ✅ **n8n** - Workflow automation, trigger workflows
- ✅ **Alpha Vantage** - Real-time financial data, stocks, forex

**Upgrade Available (currently mock):**
- 📋 PostgreSQL Database 
- 📋 Redis Cache
- 📋 Email Notifications
- 📋 Stripe Payments

## 🚀 Quick Start

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API credentials** (see sections below)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Enable plugins** via the API:
   ```bash
   curl -X POST http://localhost:3002/api/plugins/google-sheets/enable
   ```

## 📊 Plugin Setup Guides

### 1. Google Sheets API

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create service account credentials
5. Download JSON key file

**Option A: Service Account (Recommended)**
```bash
# Set the entire JSON as an environment variable
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

**Option B: OAuth2**
```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3002/auth/google/callback
```

**API Endpoints:**
```bash
# Get spreadsheet info
GET /api/plugins/google-sheets/spreadsheets/{id}

# Read data
GET /api/plugins/google-sheets/spreadsheets/{id}/values/{range}

# Write data
PUT /api/plugins/google-sheets/spreadsheets/{id}/values/{range}
# Body: { "values": [["Name", "Email"], ["John", "john@email.com"]] }

# Append data
POST /api/plugins/google-sheets/spreadsheets/{id}/values/{range}/append
# Body: { "values": [["Jane", "jane@email.com"]] }

# Test connection
GET /api/plugins/google-sheets/test
```

### 2. Slack API

**Setup Steps:**
1. Go to [Slack Apps](https://api.slack.com/apps)
2. Create new app
3. Add Bot Token Scopes: `chat:write`, `channels:read`, `users:read`
4. Install app to workspace
5. Copy Bot User OAuth Token

**Environment:**
```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
```

**API Endpoints:**
```bash
# Send message
POST /api/plugins/slack/messages
# Body: { "channel": "#general", "text": "Hello World!" }

# Get channels
GET /api/plugins/slack/channels

# Get users
GET /api/plugins/slack/users

# Upload file
POST /api/plugins/slack/files
# Body: { "channels": "#general", "file": "base64-data", "filename": "doc.pdf" }
```

### 3. Notion API

**Setup Steps:**
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create new integration
3. Copy Internal Integration Token
4. Share your databases/pages with the integration

**Environment:**
```bash
NOTION_TOKEN=secret_your-notion-token
```

**API Endpoints:**
```bash
# List databases
GET /api/plugins/notion/databases

# Query database
POST /api/plugins/notion/databases/{id}/query
# Body: { "filter": {...}, "sorts": [...] }

# Create page
POST /api/plugins/notion/pages
# Body: { "parent": {"database_id": "..."}, "properties": {...} }

# Get page blocks
GET /api/plugins/notion/pages/{id}/blocks

# Search pages
GET /api/plugins/notion/search?query=project
```

### 4. Airtable API

**Setup Steps:**
1. Go to [Airtable Tokens](https://airtable.com/create/tokens)
2. Create Personal Access Token
3. Grant required scopes (data.records:read, data.records:write)

**Environment:**
```bash
AIRTABLE_API_KEY=patyour-personal-access-token
```

**API Endpoints:**
```bash
# Get records
GET /api/plugins/airtable/{baseId}/{tableName}/records

# Create record
POST /api/plugins/airtable/{baseId}/{tableName}/records
# Body: { "fields": { "Name": "John", "Email": "john@email.com" } }

# Update record
PATCH /api/plugins/airtable/{baseId}/{tableName}/records/{recordId}
# Body: { "fields": { "Status": "Completed" } }

# Search records
POST /api/plugins/airtable/{baseId}/{tableName}/search
# Body: { "field": "Name", "value": "John", "operator": "=" }

# Bulk create
POST /api/plugins/airtable/{baseId}/{tableName}/bulk-create
# Body: { "records": [{"fields": {...}}, {"fields": {...}}] }
```

### 5. HubSpot CRM

**Setup Steps:**
1. Go to [HubSpot Apps](https://app.hubspot.com/private-apps)
2. Create private app
3. Add required scopes (crm.objects.contacts.read, crm.objects.contacts.write, etc.)
4. Copy access token

**Environment:**
```bash
HUBSPOT_ACCESS_TOKEN=pat-your-access-token
```

**API Endpoints:**
```bash
# Get contacts
GET /api/plugins/hubspot/contacts

# Create contact
POST /api/plugins/hubspot/contacts
# Body: { "properties": { "email": "john@email.com", "firstname": "John" } }

# Get companies
GET /api/plugins/hubspot/companies

# Create deal
POST /api/plugins/hubspot/deals
# Body: { "properties": { "dealname": "New Sale", "amount": "5000" } }

# Quick lead creation
POST /api/plugins/hubspot/quick/lead
# Body: { "email": "lead@email.com", "firstName": "Jane", "company": "Acme Corp" }
```

### 6. n8n Workflow Automation

**Setup Steps:**
1. Set up n8n instance (self-hosted or cloud)
2. Go to Settings → n8n API
3. Create API key
4. Note your instance URL

**Environment:**
```bash
N8N_BASE_URL=https://your-instance.n8n.cloud/api/v1
N8N_API_KEY=your-n8n-api-key
```

**API Endpoints:**
```bash
# List workflows
GET /api/plugins/n8n/workflows

# Create workflow
POST /api/plugins/n8n/workflows
# Body: { "name": "My Workflow", "nodes": [...] }

# Execute workflow
POST /api/plugins/n8n/workflows/{id}/execute
# Body: { "data": {...} }

# Trigger webhook
POST /api/plugins/n8n/webhooks/{path}
# Body: { your webhook data }

# Get workflow templates
GET /api/plugins/n8n/templates
```

### 7. Alpha Vantage Financial Data

**Setup Steps:**
1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get free API key
3. Note rate limits (25 calls/day free tier)

**Environment:**
```bash
ALPHAVANTAGE_API_KEY=your-alpha-vantage-key
```

**API Endpoints:**
```bash
# Get stock quote
GET /api/plugins/alpha-vantage/stocks/AAPL/quote

# Get daily data
GET /api/plugins/alpha-vantage/stocks/AAPL/daily

# Get intraday data
GET /api/plugins/alpha-vantage/stocks/AAPL/intraday?interval=5min

# Search symbols
GET /api/plugins/alpha-vantage/search/apple

# Get technical indicators
GET /api/plugins/alpha-vantage/stocks/AAPL/indicators/sma?time_period=20

# Forex rates
GET /api/plugins/alpha-vantage/forex/USD/EUR

# Crypto data
GET /api/plugins/alpha-vantage/crypto/BTC/daily

# Economic indicators
GET /api/plugins/alpha-vantage/economic/gdp
```

## 🔧 Testing Plugins

Each plugin has a test endpoint to verify connectivity:

```bash
# Test Google Sheets
curl http://localhost:3002/api/plugins/google-sheets/test

# Test Slack
curl http://localhost:3002/api/plugins/slack/test

# Test Notion
curl http://localhost:3002/api/plugins/notion/test

# Test Airtable
curl http://localhost:3002/api/plugins/airtable/test

# Test HubSpot
curl http://localhost:3002/api/plugins/hubspot/test

# Test n8n
curl http://localhost:3002/api/plugins/n8n/test

# Test Alpha Vantage
curl http://localhost:3002/api/plugins/alpha-vantage/test
```

## 🛠 Upgrading Mock Plugins

### PostgreSQL Database
Replace the mock with real PostgreSQL:

```bash
npm install pg @types/pg
```

```typescript
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

### Redis Cache
Replace in-memory cache with Redis:

```bash
npm install redis
```

```typescript
import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });
```

### Email Notifications
Replace mock with real SMTP:

```bash
npm install nodemailer @types/nodemailer
```

```typescript
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransporter({...});
```

### Stripe Payments
Replace mock with real Stripe:

```bash
npm install stripe
```

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

## 🔒 Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all credentials
3. **Rotate keys regularly**
4. **Use service accounts** when possible
5. **Implement rate limiting** in production
6. **Validate all inputs** before sending to APIs
7. **Log API usage** for monitoring

## 📈 Rate Limits & Quotas

| Service | Free Tier Limit | Rate Limit |
|---------|----------------|------------|
| Google Sheets | 100 req/100s | 100 req/100s per project |
| Slack | Standard plan | 1+/min (varies by method) |
| Notion | Free for personal | 3 req/sec |
| Airtable | 1,200 records/base | 5 req/sec per base |
| HubSpot | Marketing Free | 190 req/10s |
| n8n | Self-hosted unlimited | Instance dependent |
| Alpha Vantage | 25 calls/day | 5 calls/min |

## 🚨 Troubleshooting

**Common Issues:**

1. **"API key not found"** - Check environment variables are loaded
2. **"Authentication failed"** - Verify API key format and permissions
3. **"Rate limit exceeded"** - Implement exponential backoff
4. **"Forbidden"** - Check API scopes and permissions
5. **"Network error"** - Verify base URLs and connectivity

**Debug Steps:**
1. Check server logs for error details
2. Test API credentials directly with curl
3. Verify environment variables with `console.log(process.env.YOUR_KEY)`
4. Check API service status pages
5. Review API documentation for changes

## 📚 Resources

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Slack API Docs](https://api.slack.com/)
- [Notion API Docs](https://developers.notion.com/)
- [Airtable API Docs](https://airtable.com/developers/web/api/introduction)
- [HubSpot API Docs](https://developers.hubspot.com/)
- [n8n API Docs](https://docs.n8n.io/api/)
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)

---

**Next Steps:**
1. Choose the services you need
2. Set up API credentials
3. Configure environment variables
4. Enable plugins via the API
5. Test connections
6. Build your integrations!
