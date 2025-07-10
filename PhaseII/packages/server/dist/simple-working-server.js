"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const deploymentService_1 = require("./services/deploymentService");
const google_sheets_1 = __importDefault(require("./plugins/google-sheets"));
const custom_dataset_1 = __importDefault(require("./plugins/custom-dataset"));
const rate_limiter_1 = __importDefault(require("./plugins/rate-limiter"));
const data_validator_1 = __importDefault(require("./plugins/data-validator"));
const jwt_auth_1 = __importDefault(require("./plugins/jwt-auth"));
const email_notifications_1 = __importDefault(require("./plugins/email-notifications"));
const image_upload_1 = __importDefault(require("./plugins/image-upload"));
const redis_cache_1 = __importDefault(require("./plugins/redis-cache"));
const postgresql_db_1 = __importDefault(require("./plugins/postgresql-db"));
const stripe_payments_1 = __importDefault(require("./plugins/stripe-payments"));
const slack_1 = __importDefault(require("./plugins/slack"));
const notion_1 = __importDefault(require("./plugins/notion"));
const airtable_1 = __importDefault(require("./plugins/airtable"));
const hubspot_1 = __importDefault(require("./plugins/hubspot"));
const n8n_1 = __importDefault(require("./plugins/n8n"));
const alpha_vantage_1 = __importDefault(require("./plugins/alpha-vantage"));
const app = (0, express_1.default)();
const port = 3002;
const deploymentService = new deploymentService_1.DeploymentService();
// --- Persistent storage helpers ---
const PROJECTS_FILE = path.join(__dirname, '../../../projects.json');
const PLUGINS_FILE = path.join(__dirname, '../../../plugins.json');
function saveProjects(projects) {
    try {
        fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    }
    catch (err) {
        console.error('Failed to save projects:', err);
    }
}
function loadProjects() {
    try {
        if (fs.existsSync(PROJECTS_FILE)) {
            return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
        }
        return [];
    }
    catch (err) {
        console.error('Failed to load projects:', err);
        return [];
    }
}
function savePlugins(plugins) {
    try {
        fs.writeFileSync(PLUGINS_FILE, JSON.stringify(plugins, null, 2));
    }
    catch (err) {
        console.error('Failed to save plugins:', err);
    }
}
function loadPlugins() {
    try {
        if (fs.existsSync(PLUGINS_FILE)) {
            return JSON.parse(fs.readFileSync(PLUGINS_FILE, 'utf-8'));
        }
        return [
            { id: 'auth', name: 'Authentication', version: '1.0.0', enabled: true, metadata: {} },
            { id: 'cors', name: 'CORS', version: '1.0.0', enabled: true, metadata: {} },
            { id: 'custom-dataset', name: 'Custom Dataset Upload', version: '1.0.0', enabled: true, metadata: {} },
            { id: 'rate-limiter', name: 'Rate Limiter', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'data-validator', name: 'Data Validator', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'jwt-auth', name: 'JWT Authentication', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'email-notifications', name: 'Email Notifications', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'image-upload', name: 'Image Upload & Resize', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'redis-cache', name: 'Redis Cache', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'postgresql-db', name: 'PostgreSQL Database', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'stripe-payments', name: 'Stripe Payments', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'google-sheets', name: 'Google Sheets API', version: '1.0.0', enabled: true, metadata: {} },
            { id: 'slack', name: 'Slack Integration', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'notion', name: 'Notion API', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'airtable', name: 'Airtable API', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'hubspot', name: 'HubSpot CRM', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'n8n', name: 'n8n Workflow Automation', version: '1.0.0', enabled: false, metadata: {} },
            { id: 'alpha-vantage', name: 'Alpha Vantage Financial Data', version: '1.0.0', enabled: false, metadata: {} }
        ];
    }
    catch (err) {
        console.error('Failed to load plugins:', err);
        return [];
    }
}
// --- Load projects and plugins from disk at startup ---
let projects = loadProjects();
if (!projects.length) {
    projects = [
        {
            id: 'demo-1',
            name: 'E-commerce API',
            description: 'Complete e-commerce backend with authentication',
            createdAt: new Date().toISOString(),
            dataModel: {},
            endpoints: [],
            settings: {}
        }
    ];
    saveProjects(projects);
}
let plugins = loadPlugins();
// --- Plugin logic example ---
// Only use CORS if the CORS plugin is enabled
if (plugins.find(p => p.id === 'cors' && p.enabled)) {
    app.use((0, cors_1.default)());
}
// Dummy auth middleware for demonstration
function requireAuth(req, res, next) {
    // In real use, check JWT or session here
    if (req.headers['x-demo-auth'] === 'letmein') {
        return next();
    }
    res.status(401).json({ error: 'Authentication required (auth plugin enabled)' });
}
// Protect all /api/secure/* routes if auth plugin is enabled
if (plugins.find(p => p.id === 'auth' && p.enabled)) {
    app.use('/api/secure', requireAuth);
}
// Middleware
app.use(body_parser_1.default.json());
// Simple in-memory storage for demo
/* let projects: any[] = [
  {
    id: 'demo-1',
    name: 'E-commerce API',
    description: 'Complete e-commerce backend with authentication',
    createdAt: new Date().toISOString(),
    dataModel: {},
    endpoints: [],
    settings: {}
  }
]; */
// Basic health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Builder Server is running',
        timestamp: new Date()
    });
});
// Projects endpoints
app.get('/api/projects', (req, res) => {
    res.json(projects);
});
app.post('/api/projects', (req, res) => {
    try {
        const { id, name, description } = req.body;
        const project = {
            id: id || Date.now().toString(),
            name,
            description,
            createdAt: new Date().toISOString(),
            dataModel: {},
            endpoints: [],
            settings: {}
        };
        projects.push(project);
        saveProjects(projects); // persists to disk
        res.status(201).json(project);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});
// Add project deletion with persistence
app.delete('/api/projects/:id', (req, res) => {
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    projects.splice(idx, 1);
    saveProjects(projects);
    res.json({ success: true });
});
// Working deployment endpoint
app.post('/api/deploy', async (req, res) => {
    const { project, platformId } = req.body;
    if (!project || !platformId) {
        return res.status(400).json({ message: 'Missing project or platformId' });
    }
    console.log(`Real deployment requested for project ${project.name} on platform ${platformId}`);
    try {
        let result;
        switch (platformId) {
            case 'vercel':
                result = await deploymentService.deployToVercel(project);
                break;
            case 'railway':
                result = await deploymentService.deployToRailway(project);
                break;
            case 'render':
                result = await deploymentService.deployToRender(project);
                break;
            default:
                return res.status(400).json({
                    status: 'error',
                    message: `Unsupported deployment platform: ${platformId}`
                });
        }
        if (result.success) {
            res.json({
                status: 'success',
                message: `Deployment for ${project.name} to ${platformId} completed successfully.`,
                deploymentUrl: result.deploymentUrl,
                deploymentId: result.deploymentId
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: result.error
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Deployment failed: ${error.message}`
        });
    }
});
// Evaluation dashboard endpoint
app.get('/api/evaluation/dashboard', (req, res) => {
    res.json({
        status: 'active',
        metrics: {
            totalProjects: projects.length,
            activeDeployments: 0,
            successRate: 95.5,
            avgResponseTime: 150
        },
        recentActivity: [
            {
                id: '1',
                type: 'project_created',
                project: 'E-commerce API',
                timestamp: new Date().toISOString()
            }
        ]
    });
});
// POST /api/projects/:id/generate
app.post('/api/projects/:id/generate', async (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project)
        return res.status(404).json({ error: 'Project not found' });
    // Generate code files using DeploymentService
    const files = await deploymentService.generateProjectFiles(project);
    // Universal local path for generated code
    const genDir = path.join(__dirname, '../../../generated', project.id);
    fs.mkdirSync(genDir, { recursive: true });
    // Write files to generated directory
    for (const [filename, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(genDir, filename), content);
    }
    // Respond with download URL
    res.json({ success: true, downloadUrl: `/api/projects/${project.id}/download` });
});
// GET /api/projects/:id/download
app.get('/api/projects/:id/download', (req, res) => {
    const genDir = path.join(__dirname, '../../../generated', req.params.id);
    const zipPath = path.join(__dirname, '../../../generated', `${req.params.id}.zip`);
    // Create zip archive of generated code
    const output = fs.createWriteStream(zipPath);
    const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
    output.on('close', () => {
        res.download(zipPath, `${req.params.id}.zip`, () => {
            fs.unlinkSync(zipPath); // Clean up zip after download
        });
    });
    archive.on('error', err => res.status(500).send({ error: err.message }));
    archive.pipe(output);
    archive.directory(genDir, false);
    archive.finalize();
});
// Plugin management endpoints
app.get('/api/plugins', (req, res) => {
    res.json(plugins);
});
app.post('/api/plugins/:id/enable', (req, res) => {
    const plugin = plugins.find(p => p.id === req.params.id);
    if (!plugin)
        return res.status(404).json({ error: 'Plugin not found' });
    plugin.enabled = true;
    savePlugins(plugins);
    res.json({ success: true });
});
app.post('/api/plugins/:id/disable', (req, res) => {
    const plugin = plugins.find(p => p.id === req.params.id);
    if (!plugin)
        return res.status(404).json({ error: 'Plugin not found' });
    plugin.enabled = false;
    savePlugins(plugins);
    res.json({ success: true });
});
// Serve frontend static files
const frontendPath = path.join(__dirname, '../../../apifrontend/dist');
if (fs.existsSync(frontendPath)) {
    app.use(express_1.default.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}
else {
    console.warn('⚠️  Frontend build not found. Please run `npm run build` in apifrontend.');
}
// Register plugin routes
if (plugins.find(p => p.id === 'google-sheets' && p.enabled)) {
    app.use('/api/plugins/google-sheets', google_sheets_1.default);
}
if (plugins.find(p => p.id === 'custom-dataset' && p.enabled)) {
    app.use('/api/plugins/custom-dataset', custom_dataset_1.default);
}
if (plugins.find(p => p.id === 'rate-limiter' && p.enabled)) {
    app.use('/api/plugins/rate-limiter', rate_limiter_1.default);
}
if (plugins.find(p => p.id === 'data-validator' && p.enabled)) {
    app.use('/api/plugins/data-validator', data_validator_1.default);
}
if (plugins.find(p => p.id === 'jwt-auth' && p.enabled)) {
    app.use('/api/plugins/jwt-auth', jwt_auth_1.default);
}
if (plugins.find(p => p.id === 'email-notifications' && p.enabled)) {
    app.use('/api/plugins/email-notifications', email_notifications_1.default);
}
if (plugins.find(p => p.id === 'image-upload' && p.enabled)) {
    app.use('/api/plugins/image-upload', image_upload_1.default);
}
if (plugins.find(p => p.id === 'redis-cache' && p.enabled)) {
    app.use('/api/plugins/redis-cache', redis_cache_1.default);
}
if (plugins.find(p => p.id === 'postgresql-db' && p.enabled)) {
    app.use('/api/plugins/postgresql-db', postgresql_db_1.default);
}
if (plugins.find(p => p.id === 'stripe-payments' && p.enabled)) {
    app.use('/api/plugins/stripe-payments', stripe_payments_1.default);
}
if (plugins.find(p => p.id === 'slack' && p.enabled)) {
    app.use('/api/plugins/slack', slack_1.default);
}
if (plugins.find(p => p.id === 'notion' && p.enabled)) {
    app.use('/api/plugins/notion', notion_1.default);
}
if (plugins.find(p => p.id === 'airtable' && p.enabled)) {
    app.use('/api/plugins/airtable', airtable_1.default);
}
if (plugins.find(p => p.id === 'hubspot' && p.enabled)) {
    app.use('/api/plugins/hubspot', hubspot_1.default);
}
if (plugins.find(p => p.id === 'n8n' && p.enabled)) {
    app.use('/api/plugins/n8n', n8n_1.default);
}
if (plugins.find(p => p.id === 'alpha-vantage' && p.enabled)) {
    app.use('/api/plugins/alpha-vantage', alpha_vantage_1.default);
}
app.listen(port, () => {
    console.log(`🚀 API Builder Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`📁 Projects: http://localhost:${port}/api/projects`);
});
exports.default = app;
//# sourceMappingURL=simple-working-server.js.map