# APIYourself - No-Code API Builder

## 🚀 One-Command Launch

Start the entire platform (backend, frontend, and all real plugins) with a single command:

```bash
npm start
```

- **Backend**: Runs on http://localhost:3002
- **Frontend**: Runs on http://localhost:8080
- **All plugins**: Registered and ready (real integrations, not mocks)

---

## 🧩 Plugin Architecture

### Real External API Integrations
- **Google Sheets** (`/api/plugins/google-sheets/`)
- **Slack** (`/api/plugins/slack/`)
- **Notion** (`/api/plugins/notion/`)
- **Airtable** (`/api/plugins/airtable/`)
- **HubSpot** (`/api/plugins/hubspot/`)
- **n8n** (`/api/plugins/n8n/`)
- **Alpha Vantage** (`/api/plugins/alpha-vantage/`)

### Real Backend/Core Plugins
- **Custom Dataset** (`/api/plugins/custom-dataset/`)
- **Rate Limiter** (`/api/plugins/rate-limiter/`)
- **Data Validator** (`/api/plugins/data-validator/`)
- **JWT Authentication** (`/api/plugins/jwt-auth/`)
- **Image Upload & Resize** (`/api/plugins/image-upload/`)
- **Redis Cache** (`/api/plugins/redis-cache/`)

### Mock Plugins (Upgradeable)
- **Email Notifications** (`/api/plugins/email-notifications/`)
- **PostgreSQL Database** (`/api/plugins/postgresql-db/`)
- **Stripe Payments** (`/api/plugins/stripe-payments/`)

---

## ⚙️ Environment Setup

1. Copy `/packages/server/.env.example` to `/packages/server/.env`
2. Add your API keys and credentials for each service (see `.env.example` for details)

---

## 🛠️ Plugin Management

- **List plugins**: `GET /api/plugins`
- **Enable plugin**: `POST /api/plugins/{id}/enable`
- **Disable plugin**: `POST /api/plugins/{id}/disable`
- **Test plugin**: `GET /api/plugins/{plugin}/test`

---

## 📚 API Reference

### Google Sheets
- `GET /api/plugins/google-sheets/spreadsheets/:id/values/:range` - Read data
- `PUT /api/plugins/google-sheets/spreadsheets/:id/values/:range` - Write data
- `POST /api/plugins/google-sheets/spreadsheets/:id/values/:range/append` - Append data
- `POST /api/plugins/google-sheets/spreadsheets` - Create spreadsheet

### Slack
- `POST /api/plugins/slack/messages` - Send message
- `GET /api/plugins/slack/channels` - List channels
- `POST /api/plugins/slack/files` - Upload file

### Notion
- `POST /api/plugins/notion/pages` - Create page
- `POST /api/plugins/notion/databases/:id/query` - Query database
- `POST /api/plugins/notion/pages/:id/blocks` - Add blocks

### Airtable
- `GET /api/plugins/airtable/:baseId/:tableName/records` - Get records
- `POST /api/plugins/airtable/:baseId/:tableName/records` - Create record
- `POST /api/plugins/airtable/:baseId/:tableName/search` - Search records

### HubSpot
- `POST /api/plugins/hubspot/contacts` - Create contact
- `POST /api/plugins/hubspot/deals` - Create deal
- `POST /api/plugins/hubspot/quick/lead` - Quick lead

### n8n
- `GET /api/plugins/n8n/workflows` - List workflows
- `POST /api/plugins/n8n/workflows/:id/execute` - Execute workflow
- `POST /api/plugins/n8n/webhooks/:path` - Trigger webhook

### Alpha Vantage
- `GET /api/plugins/alpha-vantage/stocks/:symbol/quote` - Stock quote
- `GET /api/plugins/alpha-vantage/stocks/:symbol/intraday` - Intraday data
- `GET /api/plugins/alpha-vantage/search/:keywords` - Search symbols

---

## 🧑‍💻 Example Usage

### Enable a Plugin
```bash
curl -X POST http://localhost:3002/api/plugins/slack/enable
```

### Test a Plugin
```bash
curl http://localhost:3002/api/plugins/slack/test
```

### Send a Slack Message
```bash
curl -X POST http://localhost:3002/api/plugins/slack/messages \
  -H 'Content-Type: application/json' \
  -d '{"channel": "#general", "text": "Hello from APIYourself!"}'
```

---

## 🏆 Key Features
- **One-command launch**: `npm start` runs everything
- **Real integrations**: All major plugins use official SDKs
- **Plugin management**: Enable/disable plugins at runtime
- **Persistent state**: Projects and plugin settings saved to disk
- **Production-ready**: Error handling, environment-based config, scalable

---

## 📝 Contributing
- Fork the repo, create a branch, and submit a PR!
- Add new plugins in `/packages/server/src/plugins/`
- See existing plugins for structure and best practices

---

## 📣 Support & Community
- [APIYourself Docs](https://github.com/apiyourself/apiyourself)
- [Discord Community](https://discord.gg/apiyourself)
- [Issues & Feature Requests](https://github.com/apiyourself/apiyourself/issues)

---

## 🎉 Enjoy building APIs with real, production-grade integrations in one command!
