import { logger } from './logging.js';

export interface CodeGenConfig {
  framework: string;
  database: string;
  authentication: string;
  deployment: string;
  features: string[];
  security: {
    rateLimiting: boolean;
    inputValidation: boolean;
    outputSanitization: boolean;
    cors: string[];
  };
  performance: {
    caching: boolean;
    compression: boolean;
    monitoring: boolean;
  };
}

export interface RequirementsData {
  projectName: string;
  description: string;
  endpoints: any[];
  models: any[];
  security: any;
  deployment: any;
  performance: any;
}

export class RequirementsEngine {
  private logger = logger;

  static mapRequirementsToConfig(requirements: any): CodeGenConfig {
    return {
      framework: requirements.framework || 'express',
      database: requirements.database || 'postgresql',
      authentication: requirements.authentication || 'jwt',
      deployment: requirements.deployment || 'docker',
      features: requirements.features || [],
      security: {
        rateLimiting: requirements.security?.rateLimiting || true,
        inputValidation: requirements.security?.inputValidation || true,
        outputSanitization: requirements.security?.outputSanitization || true,
        cors: requirements.security?.cors || ['*']
      },
      performance: {
        caching: requirements.performance?.caching || false,
        compression: requirements.performance?.compression || true,
        monitoring: requirements.performance?.monitoring || true
      }
    };
  }

  static async generateProductionCode(requirements: RequirementsData, config: CodeGenConfig): Promise<{
    success: boolean;
    code: string;
    config: any;
    deployment: any;
    message?: string;
  }> {
    const engine = new RequirementsEngine();
    return engine.generateProductionCode(requirements, config);
  }

  static async generateDeploymentScripts(requirements: RequirementsData, config: CodeGenConfig): Promise<{
    success: boolean;
    scripts: Record<string, string>;
    message?: string;
  }> {
    try {
      const scripts = {
        'Dockerfile': `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
        'docker-compose.yml': `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production`,
        'deploy.sh': `#!/bin/bash
docker build -t ${requirements.projectName.toLowerCase().replace(/\s+/g, '-')} .
docker run -p 3000:3000 ${requirements.projectName.toLowerCase().replace(/\s+/g, '-')}`
      };

      return {
        success: true,
        scripts
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        scripts: {},
        message: errorMessage
      };
    }
  }

  static async generateCICDConfigs(requirements: RequirementsData, config: CodeGenConfig): Promise<{
    success: boolean;
    configs: Record<string, string>;
    message?: string;
  }> {
    try {
      const configs = {
        '.github/workflows/deploy.yml': `name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build`
      };

      return {
        success: true,
        configs
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        configs: {},
        message: errorMessage
      };
    }
  }

  async generateProductionCode(requirements: RequirementsData, config: CodeGenConfig): Promise<{
    success: boolean;
    code: string;
    config: any;
    deployment: any;
    message?: string;
  }> {
    try {
      this.logger.info('Generating production code', { 
        projectName: requirements.projectName,
        framework: config.framework 
      });

      // Simulate code generation
      const code = this.generateFrameworkCode(requirements, config);
      const deploymentConfig = this.generateDeploymentConfig(requirements, config);
      
      return {
        success: true,
        code,
        config: config,
        deployment: deploymentConfig
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error('Code generation failed', { error: errorMessage });
      return {
        success: false,
        code: '',
        config: {},
        deployment: {},
        message: errorMessage
      };
    }
  }

  private generateFrameworkCode(requirements: RequirementsData, config: CodeGenConfig): string {
    // Basic code generation template
    return `
// Generated ${config.framework} API for ${requirements.projectName}
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Generated endpoints would go here
${requirements.endpoints.map(endpoint => `
app.${endpoint.method?.toLowerCase() || 'get'}('${endpoint.path}', (req, res) => {
  // Implementation for ${endpoint.name}
  res.json({ message: 'Endpoint ${endpoint.name} is working' });
});
`).join('')}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`${requirements.projectName} API running on port \${port}\`);
});
`;
  }

  private generateDeploymentConfig(requirements: RequirementsData, config: CodeGenConfig): any {
    return {
      platform: config.deployment,
      environment: 'production',
      scaling: {
        minInstances: 1,
        maxInstances: 10
      },
      resources: {
        cpu: '1',
        memory: '1Gi'
      }
    };
  }

  async validateRequirements(requirements: RequirementsData): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!requirements.projectName) {
      errors.push('Project name is required');
    }

    if (!requirements.description) {
      errors.push('Project description is required');
    }

    if (!requirements.endpoints || requirements.endpoints.length === 0) {
      errors.push('At least one endpoint is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const requirementsEngine = new RequirementsEngine();
