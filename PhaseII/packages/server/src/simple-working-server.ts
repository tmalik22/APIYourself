import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { DeploymentService } from './services/deploymentService';
import { apiMonitoringService } from './services/api-monitoring';
import googleSheetsPlugin from './plugins/google-sheets';
import customDatasetPlugin from './plugins/custom-dataset';
import rateLimiterPlugin from './plugins/rate-limiter';
import dataValidatorPlugin from './plugins/data-validator';
import jwtAuthPlugin from './plugins/jwt-auth';
import emailNotificationsPlugin from './plugins/email-notifications';
import imageUploadPlugin from './plugins/image-upload';
import redisCachePlugin from './plugins/redis-cache';
import postgresqlDbPlugin from './plugins/postgresql-db';
import stripePaymentsPlugin from './plugins/stripe-payments';
import slackPlugin from './plugins/slack';
import notionPlugin from './plugins/notion';
import airtablePlugin from './plugins/airtable';
import hubspotPlugin from './plugins/hubspot';
import n8nPlugin from './plugins/n8n';
import alphaVantagePlugin from './plugins/alpha-vantage';
import type { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3002;
const deploymentService = new DeploymentService();

// --- Persistent storage helpers ---
const PROJECTS_FILE = path.join(__dirname, '../../../projects.json');
const PLUGINS_FILE = path.join(__dirname, '../../../plugins.json');

function saveProjects(projects: any[]) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}

function loadProjects(): any[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    }
    return [];
  } catch (err) {
    console.error('Failed to load projects:', err);
    return [];
  }
}

function savePlugins(plugins: any[]) {
  try {
    fs.writeFileSync(PLUGINS_FILE, JSON.stringify(plugins, null, 2));
  } catch (err) {
    console.error('Failed to save plugins:', err);
  }
}

function loadPlugins(): any[] {
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
  } catch (err) {
    console.error('Failed to load plugins:', err);
    return [];
  }
}

// --- Load projects and plugins from disk at startup ---
let projects: any[] = loadProjects();
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

let plugins: any[] = loadPlugins();

// --- Plugin logic example ---

// Only use CORS if the CORS plugin is enabled
if (plugins.find(p => p.id === 'cors' && p.enabled)) {
  app.use(cors());
}

// Dummy auth middleware for demonstration
function requireAuth(req: Request, res: Response, next: NextFunction) {
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
app.use(bodyParser.json());

// Add API monitoring middleware to track all requests
app.use(apiMonitoringService.middleware());

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
  } catch (error: any) {
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
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: result.error 
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: `Deployment failed: ${error.message}` 
    });
  }
});

// API monitoring and evaluation dashboard endpoints
app.get('/api/evaluation/dashboard', (req, res) => {
  try {
    const dashboardData = apiMonitoringService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get API stats with optional time range
app.get('/api/evaluation/stats', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let timeRange;
    
    if (startDate && endDate) {
      timeRange = {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      };
    }
    
    const stats = apiMonitoringService.getAPIStats(timeRange);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching API stats:', error);
    res.status(500).json({ error: 'Failed to fetch API stats' });
  }
});

// Get endpoint health details
app.get('/api/evaluation/endpoints', (req, res) => {
  try {
    const endpoints = apiMonitoringService.getEndpointHealthSummary();
    res.json(endpoints);
  } catch (error) {
    console.error('Error fetching endpoint health:', error);
    res.status(500).json({ error: 'Failed to fetch endpoint health' });
  }
});

// Get active alerts
app.get('/api/evaluation/alerts', (req, res) => {
  try {
    const alerts = apiMonitoringService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Resolve an alert
app.post('/api/evaluation/alerts/:id/resolve', (req, res) => {
  try {
    const resolved = apiMonitoringService.resolveAlert(req.params.id);
    if (resolved) {
      res.json({ success: true, message: 'Alert resolved' });
    } else {
      res.status(404).json({ error: 'Alert not found or already resolved' });
    }
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Get system metrics
app.get('/api/evaluation/system', (req, res) => {
  try {
    const { hours } = req.query;
    let timeRange;
    
    if (hours) {
      const now = new Date();
      const hoursAgo = new Date(now.getTime() - (parseInt(hours as string) * 60 * 60 * 1000));
      timeRange = { start: hoursAgo, end: now };
    }
    
    const metrics = apiMonitoringService.getSystemMetrics(timeRange);
    const currentHealth = apiMonitoringService.getCurrentHealth();
    
    res.json({
      current: currentHealth,
      history: metrics,
    });
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// --- CHAT AND API GENERATION ENDPOINTS ---

// In-memory storage for generation tasks
const generationTasks = new Map();

// Chat endpoint for conversational API building
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Simple keyword detection for API building intent
    const apiBuildingKeywords = ['build', 'create', 'make', 'api', 'endpoint', 'integration', 'service', 'backend'];
    const hasAPIIntent = apiBuildingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (hasAPIIntent) {
      return res.json({
        response: `🚀 **BUILDING YOUR API**

⏳ **Status:** Analyzing requirements...

I'll have your API ready in moments with all endpoints, authentication, database, and deployment configuration.

Building now...`,
        shouldBuild: true
      });
    }

    // Simple conversational responses for non-building requests
    const responses = [
      "I can help you build APIs! Just tell me what kind of API you need.",
      "Great! What specific functionality should your API have?",
      "Perfect! Let me know more details about your API requirements.",
      "Excellent! I'll help you build that API. What features do you need?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    res.json({ response: randomResponse, shouldBuild: false });
    
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// API Generation endpoint
app.post('/api/generate-api', async (req, res) => {
  try {
    const { requirements } = req.body;
    const projectId = `api-${Date.now()}`;
    
    // Create generation task
    const task = {
      id: projectId,
      requirements,
      status: 'analyzing',
      progress: 0,
      stage: 'Analyzing requirements...',
      startTime: Date.now(),
      stages: [
        { name: 'Analyzing requirements...', duration: 1200 },
        { name: 'Designing API architecture...', duration: 1500 },
        { name: 'Creating data models and schemas...', duration: 1800 },
        { name: 'Generating API endpoints...', duration: 1300 },
        { name: 'Implementing authentication and security...', duration: 1000 },
        { name: 'Finalizing deployment configuration...', duration: 800 }
      ],
      currentStageIndex: 0
    };
    
    generationTasks.set(projectId, task);
    
    // Start the generation process
    processAPIGeneration(projectId, requirements);
    
    res.json({ projectId, progress: task });
    
  } catch (error: any) {
    console.error('API generation error:', error);
    res.status(500).json({ error: 'Failed to start API generation' });
  }
});

// Get generation progress
app.get('/api/generate-api/:projectId/progress', (req, res) => {
  const task = generationTasks.get(req.params.projectId);
  if (!task) {
    return res.status(404).json({ error: 'Generation task not found' });
  }
  
  res.json({
    status: task.status,
    progress: task.progress,
    stage: task.stage
  });
});

// Finalize API generation and create actual project
app.post('/api/generate-api/:projectId/finalize', async (req, res) => {
  try {
    const task = generationTasks.get(req.params.projectId);
    if (!task) {
      return res.status(404).json({ error: 'Generation task not found' });
    }
    
    if (task.status !== 'completed') {
      return res.status(400).json({ error: 'Generation not completed yet' });
    }
    
    // Create a real project from the generated API
    const apiName = generateAPIName(task.requirements);
    const project = {
      id: task.id,
      name: apiName,
      description: `Generated API based on: ${task.requirements}`,
      createdAt: new Date().toISOString(),
      dataModel: generateDataModel(task.requirements),
      endpoints: generateEndpoints(task.requirements),
      settings: {
        authentication: 'jwt',
        database: 'postgresql',
        cache: 'redis',
        generated: true,
        originalRequirements: task.requirements
      }
    };
    
    projects.push(project);
    saveProjects(projects);
    
    // Clean up the generation task
    generationTasks.delete(req.params.projectId);
    
    res.json(project);
    
  } catch (error: any) {
    console.error('API finalization error:', error);
    res.status(500).json({ error: 'Failed to finalize API generation' });
  }
});

// Helper function to process API generation with realistic timing
async function processAPIGeneration(projectId: string, requirements: string) {
  const task = generationTasks.get(projectId);
  if (!task) return;
  
  try {
    for (let i = 0; i < task.stages.length; i++) {
      const stage = task.stages[i];
      task.currentStageIndex = i;
      task.stage = stage.name;
      task.progress = Math.round((i / task.stages.length) * 100);
      task.status = 'processing';
      
      // Simulate realistic processing time
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }
    
    task.status = 'completed';
    task.progress = 100;
    task.stage = 'API generation completed!';
    
  } catch (error) {
    task.status = 'failed';
    task.stage = 'Generation failed';
    console.error('Generation process error:', error);
  }
}

// Helper functions for generating realistic API specs
function generateAPIName(requirements: string): string {
  const req = requirements.toLowerCase();
  if (req.includes('telematics')) return 'Telematics Gateway API';
  if (req.includes('logistics')) return 'Logistics Hub API';
  if (req.includes('tracking')) return 'Fleet Tracking API';
  if (req.includes('user')) return 'User Management API';
  if (req.includes('payment')) return 'Payment Processing API';
  if (req.includes('notification')) return 'Notification Service API';
  if (req.includes('inventory')) return 'Inventory Management API';
  return 'Custom Integration API';
}

function generateDataModel(requirements: string): any {
  const req = requirements.toLowerCase();
  const baseModel: any = {};
  
  if (req.includes('user') || req.includes('customer')) {
    baseModel.User = {
      fields: [
        { name: 'id', type: 'string', primary: true },
        { name: 'email', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'createdAt', type: 'datetime', required: true },
        { name: 'updatedAt', type: 'datetime', required: true }
      ]
    };
  }
  
  if (req.includes('vehicle') || req.includes('fleet') || req.includes('telematics')) {
    baseModel.Vehicle = {
      fields: [
        { name: 'id', type: 'string', primary: true },
        { name: 'vin', type: 'string', required: true },
        { name: 'make', type: 'string', required: true },
        { name: 'model', type: 'string', required: true },
        { name: 'year', type: 'number', required: true },
        { name: 'status', type: 'string', required: true }
      ]
    };
    
    baseModel.Location = {
      fields: [
        { name: 'id', type: 'string', primary: true },
        { name: 'vehicleId', type: 'string', required: true },
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
        { name: 'timestamp', type: 'datetime', required: true }
      ]
    };
  }
  
  return baseModel;
}

function generateEndpoints(requirements: string): any[] {
  const req = requirements.toLowerCase();
  const endpoints: any[] = [];
  
  // Always include health check
  endpoints.push({
    path: '/health',
    method: 'GET',
    description: 'Health check endpoint',
    auth: false
  });
  
  if (req.includes('user') || req.includes('customer')) {
    endpoints.push(
      { path: '/users', method: 'GET', description: 'List all users', auth: true },
      { path: '/users', method: 'POST', description: 'Create new user', auth: true },
      { path: '/users/:id', method: 'GET', description: 'Get user by ID', auth: true },
      { path: '/users/:id', method: 'PUT', description: 'Update user', auth: true },
      { path: '/users/:id', method: 'DELETE', description: 'Delete user', auth: true }
    );
  }
  
  if (req.includes('vehicle') || req.includes('fleet') || req.includes('telematics')) {
    endpoints.push(
      { path: '/vehicles', method: 'GET', description: 'List all vehicles', auth: true },
      { path: '/vehicles/:id', method: 'GET', description: 'Get vehicle details', auth: true },
      { path: '/vehicles/:id/location', method: 'GET', description: 'Get vehicle location', auth: true },
      { path: '/vehicles/:id/locations', method: 'GET', description: 'Get location history', auth: true }
    );
  }
  
  // Add authentication endpoints
  endpoints.push(
    { path: '/auth/login', method: 'POST', description: 'User login', auth: false },
    { path: '/auth/register', method: 'POST', description: 'User registration', auth: false },
    { path: '/auth/refresh', method: 'POST', description: 'Refresh token', auth: false }
  );
  
  return endpoints;
}

// --- END CHAT AND API GENERATION ENDPOINTS ---

// Get time series data for charts
app.get('/api/evaluation/timeseries', (req, res) => {
  try {
    const { hours = '24' } = req.query;
    const timeSeriesData = apiMonitoringService.getTimeSeriesData(parseInt(hours as string));
    res.json(timeSeriesData);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    res.status(500).json({ error: 'Failed to fetch time series data' });
  }
});

// POST /api/projects/:id/generate
app.post('/api/projects/:id/generate', async (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

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
  const archive = archiver('zip', { zlib: { level: 9 } });

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
  if (!plugin) return res.status(404).json({ error: 'Plugin not found' });
  plugin.enabled = true;
  savePlugins(plugins);
  res.json({ success: true });
});

app.post('/api/plugins/:id/disable', (req, res) => {
  const plugin = plugins.find(p => p.id === req.params.id);
  if (!plugin) return res.status(404).json({ error: 'Plugin not found' });
  plugin.enabled = false;
  savePlugins(plugins);
  res.json({ success: true });
});

// Register plugin routes BEFORE frontend routes
if (plugins.find(p => p.id === 'google-sheets' && p.enabled)) {
  app.use('/api/plugins/google-sheets', googleSheetsPlugin);
}

if (plugins.find(p => p.id === 'custom-dataset' && p.enabled)) {
  app.use('/api/plugins/custom-dataset', customDatasetPlugin);
}

if (plugins.find(p => p.id === 'rate-limiter' && p.enabled)) {
  app.use('/api/plugins/rate-limiter', rateLimiterPlugin);
}

if (plugins.find(p => p.id === 'data-validator' && p.enabled)) {
  app.use('/api/plugins/data-validator', dataValidatorPlugin);
}

if (plugins.find(p => p.id === 'jwt-auth' && p.enabled)) {
  app.use('/api/plugins/jwt-auth', jwtAuthPlugin);
}

if (plugins.find(p => p.id === 'email-notifications' && p.enabled)) {
  app.use('/api/plugins/email-notifications', emailNotificationsPlugin);
}

if (plugins.find(p => p.id === 'image-upload' && p.enabled)) {
  app.use('/api/plugins/image-upload', imageUploadPlugin);
}

if (plugins.find(p => p.id === 'redis-cache' && p.enabled)) {
  app.use('/api/plugins/redis-cache', redisCachePlugin);
}

if (plugins.find(p => p.id === 'postgresql-db' && p.enabled)) {
  app.use('/api/plugins/postgresql-db', postgresqlDbPlugin);
}

if (plugins.find(p => p.id === 'stripe-payments' && p.enabled)) {
  app.use('/api/plugins/stripe-payments', stripePaymentsPlugin);
}

if (plugins.find(p => p.id === 'slack' && p.enabled)) {
  app.use('/api/plugins/slack', slackPlugin);
}

if (plugins.find(p => p.id === 'notion' && p.enabled)) {
  app.use('/api/plugins/notion', notionPlugin);
}

if (plugins.find(p => p.id === 'airtable' && p.enabled)) {
  app.use('/api/plugins/airtable', airtablePlugin);
}

if (plugins.find(p => p.id === 'hubspot' && p.enabled)) {
  app.use('/api/plugins/hubspot', hubspotPlugin);
}

if (plugins.find(p => p.id === 'n8n' && p.enabled)) {
  app.use('/api/plugins/n8n', n8nPlugin);
}

if (plugins.find(p => p.id === 'alpha-vantage' && p.enabled)) {
  app.use('/api/plugins/alpha-vantage', alphaVantagePlugin);
}

// Add plugin auth routes (BEFORE frontend static files)
app.get('/api/plugins/auth/google-sheets', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/google-sheets/auth',
    message: 'Google Sheets authentication required' 
  });
});

app.get('/api/plugins/auth/slack', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/slack/auth',
    message: 'Slack authentication required' 
  });
});

app.get('/api/plugins/auth/notion', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/notion/auth',
    message: 'Notion authentication required' 
  });
});

app.get('/api/plugins/auth/airtable', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/airtable/auth',
    message: 'Airtable authentication required' 
  });
});

app.get('/api/plugins/auth/hubspot', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/hubspot/auth',
    message: 'HubSpot authentication required' 
  });
});

app.get('/api/plugins/auth/jira', (req, res) => {
  res.json({ 
    authenticated: false, 
    authUrl: '/api/plugins/jira/auth',
    message: 'Jira authentication required' 
  });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../../apifrontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.warn('⚠️  Frontend build not found. Please run `npm run build` in apifrontend.');
}

app.listen(port, () => {
  console.log(`🚀 API Builder Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`📁 Projects: http://localhost:${port}/api/projects`);
});

export default app;