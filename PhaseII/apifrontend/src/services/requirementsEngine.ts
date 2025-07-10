/**
 * Requirements Engine - Central service for managing API requirements and generation
 * This service orchestrates the entire API creation workflow from requirements to code
 */

import { ProductionRequirements } from '../components/ProductionWizard';
import { ProductionRequirementsEngine, ProductionCodeConfig } from '../components/ProductionRequirementsEngine';
import { LLMSecurityGuard, LLMInteractionContext, SecurityViolation } from '../components/LLMSecurityGuard';

export interface APIRequirement {
  id: string;
  type: 'model' | 'endpoint' | 'middleware' | 'integration' | 'security' | 'testing';
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dependencies: string[];
  metadata: Record<string, any>;
}

export interface ProjectRequirements {
  id: string;
  name: string;
  description: string;
  template: string;
  requirements: APIRequirement[];
  productionRequirements?: ProductionRequirements;
  securityProfile: SecurityProfile;
  complianceNeeds: ComplianceRequirement[];
  integrations: Integration[];
  deploymentTarget: DeploymentTarget;
}

export interface SecurityProfile {
  level: 'basic' | 'standard' | 'high' | 'enterprise';
  authentication: string[];
  authorization: string[];
  encryption: boolean;
  auditLogging: boolean;
  rateLimiting: boolean;
  inputValidation: boolean;
}

export interface ComplianceRequirement {
  standard: 'gdpr' | 'hipaa' | 'sox' | 'pci' | 'iso27001';
  required: boolean;
  implementationLevel: 'basic' | 'full';
  documentation: boolean;
}

export interface Integration {
  type: 'database' | 'external_api' | 'messaging' | 'storage' | 'analytics';
  provider: string;
  configuration: Record<string, any>;
  required: boolean;
}

export interface DeploymentTarget {
  platform: 'docker' | 'vercel' | 'heroku' | 'aws' | 'gcp' | 'azure';
  environment: 'development' | 'staging' | 'production';
  scaling: 'none' | 'horizontal' | 'vertical' | 'auto';
  monitoring: boolean;
  cicd: boolean;
}

export interface GeneratedArtifact {
  type: 'source_code' | 'configuration' | 'documentation' | 'tests' | 'deployment';
  name: string;
  path: string;
  content: string;
  language?: string;
  framework?: string;
  dependencies: string[];
}

export interface GenerationResult {
  success: boolean;
  projectId: string;
  artifacts: GeneratedArtifact[];
  productionCode?: ProductionCodeConfig;
  securityReport: SecurityReport;
  recommendations: string[];
  warnings: string[];
  errors: string[];
}

export interface SecurityReport {
  vulnerabilities: SecurityViolation[];
  complianceStatus: Record<string, boolean>;
  securityScore: number;
  recommendations: string[];
}

export class RequirementsEngine {
  private static instance: RequirementsEngine;
  private projects: Map<string, ProjectRequirements> = new Map();
  private securityGuard: typeof LLMSecurityGuard;

  private constructor() {
    this.securityGuard = LLMSecurityGuard;
  }

  static getInstance(): RequirementsEngine {
    if (!RequirementsEngine.instance) {
      RequirementsEngine.instance = new RequirementsEngine();
    }
    return RequirementsEngine.instance;
  }

  /**
   * Create a new project with requirements analysis
   */
  async createProject(
    name: string,
    description: string,
    template: string,
    userRequirements: string[],
    options: Partial<ProjectRequirements> = {}
  ): Promise<ProjectRequirements> {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Analyze user requirements and extract structured requirements
    const requirements = await this.analyzeRequirements(userRequirements);
    
    // Determine security profile based on requirements
    const securityProfile = this.deriveSecurityProfile(requirements);
    
    // Identify compliance needs
    const complianceNeeds = this.identifyComplianceNeeds(requirements, description);
    
    // Suggest integrations
    const integrations = this.suggestIntegrations(requirements, template);
    
    // Determine deployment target
    const deploymentTarget = this.determineDeploymentTarget(requirements, options.deploymentTarget);

    const project: ProjectRequirements = {
      id: projectId,
      name,
      description,
      template,
      requirements,
      securityProfile,
      complianceNeeds,
      integrations,
      deploymentTarget,
      ...options
    };

    this.projects.set(projectId, project);
    return project;
  }

  /**
   * Generate production-ready code from project requirements
   */
  async generateProductionCode(projectId: string): Promise<GenerationResult> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    try {
      // Convert requirements to production requirements format
      const productionRequirements = this.convertToProductionRequirements(project);
      
      // Generate code using the ProductionRequirementsEngine
      const productionCode = ProductionRequirementsEngine.generateProductionCode(
        productionRequirements,
        { name: project.template, description: project.description }
      );

      // Generate additional artifacts
      const artifacts = await this.generateArtifacts(project, productionCode);
      
      // Run security analysis
      const securityReport = await this.analyzeSecurityCompliance(project, productionCode);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(project, securityReport);

      return {
        success: true,
        projectId,
        artifacts,
        productionCode,
        securityReport,
        recommendations,
        warnings: this.generateWarnings(project),
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        projectId,
        artifacts: [],
        securityReport: {
          vulnerabilities: [],
          complianceStatus: {},
          securityScore: 0,
          recommendations: []
        },
        recommendations: [],
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  /**
   * Analyze user requirements and convert to structured format
   */
  private async analyzeRequirements(userRequirements: string[]): Promise<APIRequirement[]> {
    const requirements: APIRequirement[] = [];
    
    for (const req of userRequirements) {
      const analyzed = this.parseRequirement(req);
      if (analyzed) {
        requirements.push(analyzed);
      }
    }

    // Add default requirements based on best practices
    requirements.push(...this.getDefaultRequirements());

    return requirements;
  }

  private parseRequirement(requirement: string): APIRequirement | null {
    const reqLower = requirement.toLowerCase();
    
    // Model requirements
    if (reqLower.includes('model') || reqLower.includes('data') || reqLower.includes('entity')) {
      return {
        id: `req_model_${Date.now()}`,
        type: 'model',
        name: `Data Model: ${this.extractEntityName(requirement)}`,
        description: requirement,
        priority: 'high',
        status: 'pending',
        dependencies: [],
        metadata: { originalText: requirement }
      };
    }

    // Endpoint requirements
    if (reqLower.includes('endpoint') || reqLower.includes('api') || reqLower.includes('route')) {
      return {
        id: `req_endpoint_${Date.now()}`,
        type: 'endpoint',
        name: `API Endpoint: ${this.extractEndpointName(requirement)}`,
        description: requirement,
        priority: 'high',
        status: 'pending',
        dependencies: [],
        metadata: { originalText: requirement }
      };
    }

    // Security requirements
    if (reqLower.includes('auth') || reqLower.includes('security') || reqLower.includes('permission')) {
      return {
        id: `req_security_${Date.now()}`,
        type: 'security',
        name: `Security: ${this.extractSecurityFeature(requirement)}`,
        description: requirement,
        priority: 'critical',
        status: 'pending',
        dependencies: [],
        metadata: { originalText: requirement }
      };
    }

    return null;
  }

  private extractEntityName(text: string): string {
    // Simple extraction - in production, this could use NLP
    const words = text.split(' ');
    const entities = words.filter(word => 
      word.length > 3 && 
      /^[A-Z]/.test(word) && 
      !['Model', 'Data', 'Entity', 'API'].includes(word)
    );
    return entities[0] || 'Entity';
  }

  private extractEndpointName(text: string): string {
    const words = text.split(' ');
    const endpoints = words.filter(word => 
      word.includes('/') || 
      ['GET', 'POST', 'PUT', 'DELETE'].some(method => text.toUpperCase().includes(method))
    );
    return endpoints[0] || 'Endpoint';
  }

  private extractSecurityFeature(text: string): string {
    if (text.toLowerCase().includes('jwt')) return 'JWT Authentication';
    if (text.toLowerCase().includes('oauth')) return 'OAuth Integration';
    if (text.toLowerCase().includes('rate')) return 'Rate Limiting';
    if (text.toLowerCase().includes('validation')) return 'Input Validation';
    return 'Security Feature';
  }

  private getDefaultRequirements(): APIRequirement[] {
    return [
      {
        id: 'req_default_error_handling',
        type: 'middleware',
        name: 'Error Handling Middleware',
        description: 'Centralized error handling for all API endpoints',
        priority: 'high',
        status: 'pending',
        dependencies: [],
        metadata: { category: 'reliability' }
      },
      {
        id: 'req_default_logging',
        type: 'middleware',
        name: 'Request Logging',
        description: 'Log all API requests for monitoring and debugging',
        priority: 'medium',
        status: 'pending',
        dependencies: [],
        metadata: { category: 'observability' }
      },
      {
        id: 'req_default_cors',
        type: 'security',
        name: 'CORS Configuration',
        description: 'Cross-Origin Resource Sharing setup',
        priority: 'high',
        status: 'pending',
        dependencies: [],
        metadata: { category: 'security' }
      }
    ];
  }

  private deriveSecurityProfile(requirements: APIRequirement[]): SecurityProfile {
    const securityReqs = requirements.filter(req => req.type === 'security');
    
    // Determine security level based on requirements
    let level: SecurityProfile['level'] = 'basic';
    if (securityReqs.length > 3) level = 'standard';
    if (securityReqs.some(req => req.metadata?.category === 'compliance')) level = 'high';
    if (securityReqs.some(req => req.description.toLowerCase().includes('enterprise'))) level = 'enterprise';

    return {
      level,
      authentication: this.extractAuthMethods(securityReqs),
      authorization: this.extractAuthzMethods(securityReqs),
      encryption: securityReqs.some(req => req.description.toLowerCase().includes('encrypt')),
      auditLogging: securityReqs.some(req => req.description.toLowerCase().includes('audit')),
      rateLimiting: securityReqs.some(req => req.description.toLowerCase().includes('rate')),
      inputValidation: securityReqs.some(req => req.description.toLowerCase().includes('validation'))
    };
  }

  private extractAuthMethods(securityReqs: APIRequirement[]): string[] {
    const methods: string[] = [];
    
    securityReqs.forEach(req => {
      const desc = req.description.toLowerCase();
      if (desc.includes('jwt')) methods.push('jwt');
      if (desc.includes('oauth')) methods.push('oauth');
      if (desc.includes('basic')) methods.push('basic');
      if (desc.includes('api key')) methods.push('apikey');
    });

    return methods.length > 0 ? methods : ['jwt']; // Default to JWT
  }

  private extractAuthzMethods(securityReqs: APIRequirement[]): string[] {
    const methods: string[] = [];
    
    securityReqs.forEach(req => {
      const desc = req.description.toLowerCase();
      if (desc.includes('rbac') || desc.includes('role')) methods.push('rbac');
      if (desc.includes('acl')) methods.push('acl');
      if (desc.includes('permission')) methods.push('permissions');
    });

    return methods.length > 0 ? methods : ['rbac']; // Default to RBAC
  }

  private identifyComplianceNeeds(requirements: APIRequirement[], description: string): ComplianceRequirement[] {
    const needs: ComplianceRequirement[] = [];
    const text = (description + ' ' + requirements.map(r => r.description).join(' ')).toLowerCase();

    if (text.includes('gdpr') || text.includes('privacy') || text.includes('personal data')) {
      needs.push({
        standard: 'gdpr',
        required: true,
        implementationLevel: 'full',
        documentation: true
      });
    }

    if (text.includes('health') || text.includes('medical') || text.includes('hipaa')) {
      needs.push({
        standard: 'hipaa',
        required: true,
        implementationLevel: 'full',
        documentation: true
      });
    }

    if (text.includes('financial') || text.includes('payment') || text.includes('sox')) {
      needs.push({
        standard: 'sox',
        required: true,
        implementationLevel: 'full',
        documentation: true
      });
    }

    return needs;
  }

  private suggestIntegrations(requirements: APIRequirement[], template: string): Integration[] {
    const integrations: Integration[] = [];

    // Database integration (always needed)
    integrations.push({
      type: 'database',
      provider: 'postgresql',
      configuration: { version: '15', ssl: true },
      required: true
    });

    // Add template-specific integrations
    if (template.toLowerCase().includes('ecommerce')) {
      integrations.push({
        type: 'external_api',
        provider: 'stripe',
        configuration: { webhooks: true },
        required: true
      });
    }

    if (template.toLowerCase().includes('social')) {
      integrations.push({
        type: 'messaging',
        provider: 'redis',
        configuration: { persistence: true },
        required: true
      });
    }

    return integrations;
  }

  private determineDeploymentTarget(
    requirements: APIRequirement[], 
    userTarget?: DeploymentTarget
  ): DeploymentTarget {
    if (userTarget) return userTarget;

    // Default deployment strategy based on requirements
    const hasHighSecurity = requirements.some(req => 
      req.type === 'security' && req.priority === 'critical'
    );

    return {
      platform: hasHighSecurity ? 'aws' : 'docker',
      environment: 'production',
      scaling: 'horizontal',
      monitoring: true,
      cicd: true
    };
  }

  private convertToProductionRequirements(project: ProjectRequirements): ProductionRequirements {
    const authMethod = project.securityProfile.authentication[0];
    const validAuth = ['none', 'basic', 'jwt', 'oauth', 'sso'].includes(authMethod) ? 
      authMethod as 'none' | 'basic' | 'jwt' | 'oauth' | 'sso' : 'jwt';

    const validCompliance = project.complianceNeeds
      .map(c => c.standard)
      .filter(std => ['gdpr', 'hipaa', 'pci', 'soc2'].includes(std)) as ('gdpr' | 'hipaa' | 'pci' | 'soc2')[];

    // Determine authorization method from project requirements
    const authzMethod = project.securityProfile.authorization.includes('rbac') || 
                       project.securityProfile.authorization.includes('roles') ? 'roles' :
                       project.securityProfile.authorization.includes('permissions') ? 'permissions' : 'none';

    // Determine deployment platform
    const validDeployment = ['vercel', 'aws', 'heroku', 'docker', 'gcp', 'azure'].includes(project.deploymentTarget.platform) ?
      project.deploymentTarget.platform as 'vercel' | 'aws' | 'heroku' | 'docker' | 'gcp' | 'azure' : 'docker';

    // Determine scaling approach
    const scaling = project.deploymentTarget.scaling === 'auto' ? 'auto' :
                   project.deploymentTarget.scaling === 'horizontal' || project.deploymentTarget.scaling === 'vertical' ? 'manual' : 'basic';

    // Determine use case based on security level and requirements
    const useCase = project.securityProfile.level === 'enterprise' ? 'enterprise' :
                   project.securityProfile.level === 'high' ? 'startup' :
                   project.requirements.length > 5 ? 'startup' : 'prototype';

    // Determine expected users based on deployment and scaling requirements
    const expectedUsers = project.deploymentTarget.scaling === 'auto' ? 'enterprise' :
                         project.deploymentTarget.scaling === 'horizontal' ? 'large' :
                         project.requirements.length > 10 ? 'medium' : 'small';

    return {
      // Security
      authentication: validAuth,
      authorization: authzMethod as 'roles' | 'permissions' | 'none',
      rateLimiting: project.securityProfile.rateLimiting,
      cors: true, // Always enable CORS for APIs
      ipWhitelist: project.securityProfile.level === 'enterprise' || project.securityProfile.level === 'high',
      inputValidation: project.securityProfile.inputValidation,
      
      // Compliance
      compliance: validCompliance,
      dataRetention: project.complianceNeeds.length > 0,
      auditLogging: project.securityProfile.auditLogging,
      encryption: project.securityProfile.encryption,
      
      // Testing
      unitTests: true,
      integrationTests: true,
      e2eTests: project.securityProfile.level === 'enterprise' || project.securityProfile.level === 'high',
      testEnvironment: true,
      
      // DevOps
      cicd: project.deploymentTarget.cicd ? 'github' : 'none',
      monitoring: project.deploymentTarget.monitoring ? ['sentry'] : ['none'],
      logging: true,
      backups: project.deploymentTarget.platform === 'aws' || project.deploymentTarget.platform === 'gcp' || project.deploymentTarget.platform === 'azure',
      secrets: project.deploymentTarget.platform === 'aws' ? 'aws-secrets' :
              project.deploymentTarget.platform === 'azure' ? 'azure-keyvault' :
              project.securityProfile.level === 'enterprise' ? 'vault' : 'env',
      
      // Deployment
      deployment: validDeployment,
      scaling: scaling as 'basic' | 'auto' | 'manual',
      cdn: project.deploymentTarget.platform !== 'docker' && (useCase === 'enterprise' || useCase === 'startup'),
      
      // Business
      useCase: useCase as 'prototype' | 'startup' | 'enterprise' | 'internal',
      expectedUsers: expectedUsers as 'small' | 'medium' | 'large' | 'enterprise'
    };
  }

  private async generateArtifacts(
    project: ProjectRequirements, 
    productionCode: ProductionCodeConfig
  ): Promise<GeneratedArtifact[]> {
    const artifacts: GeneratedArtifact[] = [];

    // Convert ProductionCodeConfig files to GeneratedArtifacts
    productionCode.files.forEach(file => {
      artifacts.push({
        type: 'source_code',
        name: file.path.split('/').pop() || file.path,
        path: file.path,
        content: file.content,
        language: this.detectLanguage(file.path),
        framework: 'express',
        dependencies: Object.keys(productionCode.dependencies)
      });
    });

    // Add configuration artifacts
    artifacts.push({
      type: 'configuration',
      name: 'package.json',
      path: 'package.json',
      content: JSON.stringify({
        name: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: project.description,
        scripts: productionCode.scripts,
        dependencies: productionCode.dependencies,
        devDependencies: productionCode.devDependencies
      }, null, 2),
      language: 'json',
      dependencies: []
    });

    // Add Docker configuration if needed
    if (productionCode.dockerFile) {
      artifacts.push({
        type: 'deployment',
        name: 'Dockerfile',
        path: 'Dockerfile',
        content: productionCode.dockerFile,
        dependencies: []
      });
    }

    return artifacts;
  }

  private detectLanguage(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      case 'json': return 'json';
      case 'yml':
      case 'yaml': return 'yaml';
      case 'md': return 'markdown';
      default: return 'text';
    }
  }

  private async analyzeSecurityCompliance(
    project: ProjectRequirements,
    productionCode: ProductionCodeConfig
  ): Promise<SecurityReport> {
    // Simulate security analysis
    const vulnerabilities: SecurityViolation[] = [];
    const complianceStatus: Record<string, boolean> = {};

    // Check compliance requirements
    project.complianceNeeds.forEach(compliance => {
      complianceStatus[compliance.standard] = this.checkComplianceImplementation(
        compliance.standard,
        productionCode
      );
    });

    // Calculate security score
    const securityScore = this.calculateSecurityScore(project, productionCode);

    return {
      vulnerabilities,
      complianceStatus,
      securityScore,
      recommendations: this.generateSecurityRecommendations(project, productionCode)
    };
  }

  private checkComplianceImplementation(standard: string, code: ProductionCodeConfig): boolean {
    // Check if compliance requirements are implemented
    switch (standard) {
      case 'gdpr':
        return code.files.some(f => f.path.includes('gdpr')) &&
               code.files.some(f => f.path.includes('privacy'));
      case 'hipaa':
        return code.dependencies['crypto'] !== undefined &&
               code.files.some(f => f.content.includes('encryption'));
      default:
        return false;
    }
  }

  private calculateSecurityScore(project: ProjectRequirements, code: ProductionCodeConfig): number {
    let score = 0;
    
    // Base security features
    if (code.dependencies['helmet']) score += 10;
    if (code.dependencies['cors']) score += 10;
    if (code.middleware.includes('helmet()')) score += 10;
    
    // Authentication
    if (project.securityProfile.authentication.length > 0) score += 20;
    
    // Compliance
    score += project.complianceNeeds.length * 15;
    
    // Testing
    if (code.dependencies['jest']) score += 10;
    
    // Monitoring
    if (code.dependencies['winston']) score += 10;
    
    return Math.min(score, 100);
  }

  private generateSecurityRecommendations(
    project: ProjectRequirements,
    code: ProductionCodeConfig
  ): string[] {
    const recommendations: string[] = [];

    if (!code.dependencies['helmet']) {
      recommendations.push('Add Helmet.js for security headers');
    }

    if (project.securityProfile.level === 'enterprise' && !code.dependencies['@sentry/node']) {
      recommendations.push('Add enterprise monitoring with Sentry');
    }

    if (project.complianceNeeds.length > 0 && !code.files.some(f => f.path.includes('audit'))) {
      recommendations.push('Implement audit logging for compliance');
    }

    return recommendations;
  }

  private generateRecommendations(project: ProjectRequirements, securityReport: SecurityReport): string[] {
    const recommendations: string[] = [];

    if (securityReport.securityScore < 70) {
      recommendations.push('Consider enhancing security features to improve security score');
    }

    if (project.deploymentTarget.platform === 'docker' && project.requirements.length > 10) {
      recommendations.push('Consider cloud deployment for better scalability');
    }

    recommendations.push(...securityReport.recommendations);

    return recommendations;
  }

  private generateWarnings(project: ProjectRequirements): string[] {
    const warnings: string[] = [];

    if (project.securityProfile.level === 'basic' && project.complianceNeeds.length > 0) {
      warnings.push('Basic security level may not meet compliance requirements');
    }

    if (project.integrations.length > 5) {
      warnings.push('Large number of integrations may increase complexity');
    }

    return warnings;
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): ProjectRequirements | undefined {
    return this.projects.get(projectId);
  }

  /**
   * List all projects
   */
  listProjects(): ProjectRequirements[] {
    return Array.from(this.projects.values());
  }

  /**
   * Delete project
   */
  deleteProject(projectId: string): boolean {
    return this.projects.delete(projectId);
  }

  /**
   * Update project requirements
   */
  updateProject(projectId: string, updates: Partial<ProjectRequirements>): ProjectRequirements | null {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const updatedProject = { ...project, ...updates };
    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }
}