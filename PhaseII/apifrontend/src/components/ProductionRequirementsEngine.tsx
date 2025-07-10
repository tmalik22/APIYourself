import { ProductionRequirements } from "./ProductionWizard";

export interface ProductionCodeConfig {
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  dependencies: string[];
  environment: Record<string, string>;
  deploymentConfig: any;
  dockerConfig?: string;
  cicdConfig?: string;
}

export class ProductionRequirementsEngine {
  static generateProductionCode(requirements: ProductionRequirements, template: any): ProductionCodeConfig {
    const files: Array<{ path: string; content: string; language: string }> = [];
    const dependencies: string[] = ['express', 'cors', 'helmet', 'dotenv'];
    const environment: Record<string, string> = {
      NODE_ENV: 'production',
      PORT: '3000',
      API_VERSION: 'v1'
    };

    // Generate main server file
    files.push({
      path: 'src/server.js',
      content: this.generateServerCode(requirements, template),
      language: 'javascript'
    });

    // Generate package.json
    files.push({
      path: 'package.json',
      content: this.generatePackageJson(requirements, dependencies),
      language: 'json'
    });

    // Generate environment file
    files.push({
      path: '.env.example',
      content: this.generateEnvironmentFile(requirements, environment),
      language: 'text'
    });

    // Add authentication if required
    if (requirements.authentication !== 'none') {
      files.push({
        path: 'src/middleware/auth.js',
        content: this.generateAuthMiddleware(requirements),
        language: 'javascript'
      });
      
      if (requirements.authentication === 'jwt') {
        dependencies.push('jsonwebtoken');
        environment.JWT_SECRET = 'your-jwt-secret-here';
      }
    }

    // Add database configuration
    files.push({
      path: 'src/config/database.js',
      content: this.generateDatabaseConfig(requirements),
      language: 'javascript'
    });
    dependencies.push('sqlite3'); // Default to SQLite for demo

    // Add security middleware
    if (requirements.rateLimiting) {
      dependencies.push('express-rate-limit');
    }
    dependencies.push('helmet');

    // Generate model files
    if (template?.modelDefinitions) {
      template.modelDefinitions.forEach((model: any) => {
        files.push({
          path: `src/models/${model.name.toLowerCase()}.js`,
          content: this.generateModelCode(model, requirements),
          language: 'javascript'
        });
      });
    }

    // Generate routes
    files.push({
      path: 'src/routes/index.js',
      content: this.generateRoutesCode(template, requirements),
      language: 'javascript'
    });

    // Generate tests if requested
    if (requirements.unitTests || requirements.integrationTests) {
      dependencies.push('jest', 'supertest');
      files.push({
        path: 'tests/api.test.js',
        content: this.generateTestCode(template, requirements),
        language: 'javascript'
      });
    }

    // Generate Docker configuration
    let dockerConfig: string | undefined;
    if (requirements.deployment === 'docker') {
      dockerConfig = this.generateDockerfile(requirements);
      files.push({
        path: 'Dockerfile',
        content: dockerConfig,
        language: 'dockerfile'
      });
    }

    // Generate CI/CD configuration
    let cicdConfig: string | undefined;
    if (requirements.cicd !== 'none') {
      cicdConfig = this.generateCICD(requirements);
      const cicdPath = requirements.cicd === 'github' ? '.github/workflows/deploy.yml' : '.gitlab-ci.yml';
      files.push({
        path: cicdPath,
        content: cicdConfig,
        language: 'yaml'
      });
    }

    return {
      files,
      dependencies,
      environment,
      deploymentConfig: this.generateDeploymentConfig(requirements),
      dockerConfig,
      cicdConfig
    };
  }

  private static generateServerCode(requirements: ProductionRequirements, template: any): string {
    return `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

${requirements.rateLimiting ? `
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
` : ''}

${requirements.authentication !== 'none' ? `
// Authentication middleware
const authMiddleware = require('./middleware/auth');
app.use('/api/protected', authMiddleware);
` : ''}

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(\`🚀 Server running on port \${port}\`);
});

module.exports = app;`;
  }

  private static generatePackageJson(requirements: ProductionRequirements, dependencies: string[]): string {
    const scripts: Record<string, string> = {
      start: 'node src/server.js',
      dev: 'nodemon src/server.js',
      build: 'echo "No build step required"'
    };

    if (requirements.unitTests || requirements.integrationTests) {
      scripts.test = 'jest';
    }

    return JSON.stringify({
      name: 'production-api',
      version: '1.0.0',
      description: 'Production-ready API generated by APIYourself',
      main: 'src/server.js',
      scripts,
      dependencies: dependencies.reduce((acc, dep) => {
        acc[dep] = 'latest';
        return acc;
      }, {} as Record<string, string>),
      devDependencies: {
        nodemon: 'latest'
      }
    }, null, 2);
  }

  private static generateEnvironmentFile(requirements: ProductionRequirements, environment: Record<string, string>): string {
    return Object.entries(environment)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  private static generateAuthMiddleware(requirements: ProductionRequirements): string {
    if (requirements.authentication === 'jwt') {
      return `const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};`;
    }

    return `module.exports = (req, res, next) => {
  // Implement your authentication logic here
  next();
};`;
  }

  private static generateDatabaseConfig(requirements: ProductionRequirements): string {
    return `const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Add your table creation queries here
});

module.exports = db;`;
  }

  private static generateModelCode(model: any, requirements: ProductionRequirements): string {
    return `const db = require('../config/database');

class ${model.name} {
  static async create(data) {
    // Implement create logic
    return new Promise((resolve, reject) => {
      // Database insert logic here
      resolve(data);
    });
  }

  static async findAll() {
    // Implement find all logic
    return new Promise((resolve, reject) => {
      // Database select logic here
      resolve([]);
    });
  }

  static async findById(id) {
    // Implement find by ID logic
    return new Promise((resolve, reject) => {
      // Database select by ID logic here
      resolve(null);
    });
  }

  static async update(id, data) {
    // Implement update logic
    return new Promise((resolve, reject) => {
      // Database update logic here
      resolve(data);
    });
  }

  static async delete(id) {
    // Implement delete logic
    return new Promise((resolve, reject) => {
      // Database delete logic here
      resolve(true);
    });
  }
}

module.exports = ${model.name};`;
  }

  private static generateRoutesCode(template: any, requirements: ProductionRequirements): string {
    return `const express = require('express');
const router = express.Router();

// Import models
${template?.modelDefinitions?.map((model: any) => 
  `const ${model.name} = require('../models/${model.name.toLowerCase()}');`
).join('\n') || ''}

${template?.modelDefinitions?.map((model: any) => `
// ${model.name} routes
router.get('/${model.name.toLowerCase()}s', async (req, res) => {
  try {
    const items = await ${model.name}.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/${model.name.toLowerCase()}s/:id', async (req, res) => {
  try {
    const item = await ${model.name}.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: '${model.name} not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/${model.name.toLowerCase()}s', async (req, res) => {
  try {
    const item = await ${model.name}.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/${model.name.toLowerCase()}s/:id', async (req, res) => {
  try {
    const item = await ${model.name}.update(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/${model.name.toLowerCase()}s/:id', async (req, res) => {
  try {
    await ${model.name}.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`).join('\n') || ''}

module.exports = router;`;
  }

  private static generateTestCode(template: any, requirements: ProductionRequirements): string {
    return `const request = require('supertest');
const app = require('../src/server');

describe('API Tests', () => {
  test('Health check should return OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

${template?.modelDefinitions?.map((model: any) => `
  describe('${model.name} endpoints', () => {
    test('GET /${model.name.toLowerCase()}s should return array', async () => {
      const response = await request(app).get('/api/${model.name.toLowerCase()}s');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /${model.name.toLowerCase()}s should create item', async () => {
      const testData = { name: 'Test ${model.name}' };
      const response = await request(app)
        .post('/api/${model.name.toLowerCase()}s')
        .send(testData);
      expect(response.status).toBe(201);
    });
  });
`).join('\n') || ''}
});`;
  }

  private static generateDockerfile(requirements: ProductionRequirements): string {
    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]`;
  }

  private static generateCICD(requirements: ProductionRequirements): string {
    if (requirements.cicd === 'github') {
      return `name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy
      run: echo "Deploy to your platform"`;
    }

    return `stages:
  - test
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  script:
    - echo "Deploy to your platform"
  only:
    - main`;
  }

  private static generateDeploymentConfig(requirements: ProductionRequirements): any {
    return {
      platform: requirements.deployment,
      scaling: requirements.scaling,
      environment: 'production'
    };
  }
}
