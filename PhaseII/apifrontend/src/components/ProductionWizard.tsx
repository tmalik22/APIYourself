import React, { useState } from 'react';
import { Shield, Settings, TestTube, Cloud, FileCheck, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ProductionRequirements {
  // Security
  authentication: 'jwt' | 'oauth' | 'sso' | 'basic' | 'none';
  authorization: 'roles' | 'permissions' | 'none';
  rateLimiting: boolean;
  cors: boolean;
  ipWhitelist: boolean;
  inputValidation: boolean;
  
  // Compliance
  compliance: ('gdpr' | 'hipaa' | 'soc2' | 'pci')[];
  dataRetention: boolean;
  auditLogging: boolean;
  encryption: boolean;
  
  // Testing
  unitTests: boolean;
  integrationTests: boolean;
  e2eTests: boolean;
  testEnvironment: boolean;
  
  // DevOps
  cicd: 'github' | 'gitlab' | 'azure' | 'none';
  monitoring: ('sentry' | 'datadog' | 'newrelic' | 'none')[];
  logging: boolean;
  backups: boolean;
  secrets: 'env' | 'vault' | 'aws-secrets' | 'azure-keyvault';
  
  // Deployment
  deployment: 'vercel' | 'aws' | 'heroku' | 'docker' | 'gcp' | 'azure';
  scaling: 'basic' | 'auto' | 'manual';
  cdn: boolean;
  
  // Business
  useCase: 'prototype' | 'startup' | 'enterprise' | 'internal';
  expectedUsers: 'small' | 'medium' | 'large' | 'enterprise';
}

interface ProductionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (requirements: ProductionRequirements, template: any) => void;
  selectedTemplate: any;
}

export function ProductionWizard({ isOpen, onClose, onComplete, selectedTemplate }: ProductionWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [requirements, setRequirements] = useState<ProductionRequirements>({
    authentication: 'jwt',
    authorization: 'roles',
    rateLimiting: true,
    cors: true,
    ipWhitelist: false,
    inputValidation: true,
    compliance: [],
    dataRetention: false,
    auditLogging: false,
    encryption: true,
    unitTests: true,
    integrationTests: true,
    e2eTests: false,
    testEnvironment: true,
    cicd: 'github',
    monitoring: ['sentry'],
    logging: true,
    backups: true,
    secrets: 'env',
    deployment: 'vercel',
    scaling: 'basic',
    cdn: false,
    useCase: 'startup',
    expectedUsers: 'small'
  });

  const steps = [
    {
      id: 'business',
      title: 'Business Context',
      icon: <Settings className="w-6 h-6" />,
      description: 'Tell us about your project'
    },
    {
      id: 'security',
      title: 'Security & Auth',
      icon: <Shield className="w-6 h-6" />,
      description: 'Configure authentication and security'
    },
    {
      id: 'compliance',
      title: 'Compliance',
      icon: <FileCheck className="w-6 h-6" />,
      description: 'Regulatory and compliance requirements'
    },
    {
      id: 'testing',
      title: 'Testing Strategy',
      icon: <TestTube className="w-6 h-6" />,
      description: 'Automated testing setup'
    },
    {
      id: 'devops',
      title: 'DevOps & Monitoring',
      icon: <Cloud className="w-6 h-6" />,
      description: 'CI/CD, monitoring, and infrastructure'
    },
    {
      id: 'review',
      title: 'Review & Generate',
      icon: <ChevronRight className="w-6 h-6" />,
      description: 'Review your choices and generate code'
    }
  ];

  const updateRequirement = (key: keyof ProductionRequirements, value: any) => {
    setRequirements(prev => ({ ...prev, [key]: value }));
  };

  const getEstimatedComplexity = () => {
    let complexity = 0;
    if (requirements.compliance.length > 0) complexity += 3;
    if (requirements.authentication !== 'none') complexity += 2;
    if (requirements.unitTests || requirements.integrationTests) complexity += 2;
    if (requirements.cicd !== 'none') complexity += 2;
    if (requirements.monitoring.length > 0) complexity += 1;
    
    if (complexity <= 3) return { level: 'Simple', color: 'bg-green-100 text-green-800', days: '1-2 days' };
    if (complexity <= 6) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800', days: '3-5 days' };
    return { level: 'Advanced', color: 'bg-red-100 text-red-800', days: '1-2 weeks' };
  };

  const renderBusinessStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">What's your primary use case?</Label>
        <RadioGroup value={requirements.useCase} onValueChange={(value: any) => updateRequirement('useCase', value)} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prototype" id="prototype" />
            <Label htmlFor="prototype">Prototype/MVP - Quick validation, basic features</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup">Startup - Growth-ready, scalable foundation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise">Enterprise - High security, compliance, scale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="internal" id="internal" />
            <Label htmlFor="internal">Internal Tool - Company workflows, moderate scale</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold">Expected user base?</Label>
        <Select value={requirements.expectedUsers} onValueChange={(value: any) => updateRequirement('expectedUsers', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (&lt; 1K users)</SelectItem>
            <SelectItem value="medium">Medium (1K - 50K users)</SelectItem>
            <SelectItem value="large">Large (50K - 500K users)</SelectItem>
            <SelectItem value="enterprise">Enterprise (500K+ users)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSecurityStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Authentication Method</Label>
        <RadioGroup value={requirements.authentication} onValueChange={(value: any) => updateRequirement('authentication', value)} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="jwt" id="jwt" />
            <Label htmlFor="jwt">JWT Tokens - Modern, stateless authentication</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oauth" id="oauth" />
            <Label htmlFor="oauth">OAuth 2.0 - Third-party login (Google, GitHub, etc.)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sso" id="sso" />
            <Label htmlFor="sso">SSO/SAML - Enterprise single sign-on</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic">Basic Auth - Simple username/password</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">No Authentication - Public API</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold">Security Features</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'rateLimiting', label: 'Rate Limiting - Prevent API abuse' },
            { key: 'cors', label: 'CORS Configuration - Cross-origin security' },
            { key: 'ipWhitelist', label: 'IP Whitelisting - Restrict access by IP' },
            { key: 'inputValidation', label: 'Input Validation - Sanitize all inputs' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements[item.key as keyof ProductionRequirements] as boolean}
                onCheckedChange={(checked) => updateRequirement(item.key as keyof ProductionRequirements, checked)}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComplianceStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Compliance Requirements</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'gdpr', label: 'GDPR - EU data protection regulation' },
            { key: 'hipaa', label: 'HIPAA - Healthcare data protection' },
            { key: 'soc2', label: 'SOC 2 - Security and availability controls' },
            { key: 'pci', label: 'PCI DSS - Payment card data security' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements.compliance.includes(item.key as any)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateRequirement('compliance', [...requirements.compliance, item.key]);
                  } else {
                    updateRequirement('compliance', requirements.compliance.filter(c => c !== item.key));
                  }
                }}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Data Protection Features</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'dataRetention', label: 'Data Retention Policies - Auto-delete old data' },
            { key: 'auditLogging', label: 'Audit Logging - Track all data access' },
            { key: 'encryption', label: 'Data Encryption - Encrypt sensitive data' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements[item.key as keyof ProductionRequirements] as boolean}
                onCheckedChange={(checked) => updateRequirement(item.key as keyof ProductionRequirements, checked)}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {requirements.compliance.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Compliance features will add additional code for data handling, user consent flows, and audit trails.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderTestingStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Testing Strategy</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'unitTests', label: 'Unit Tests - Test individual functions (Jest/Mocha)' },
            { key: 'integrationTests', label: 'Integration Tests - Test API endpoints (Supertest)' },
            { key: 'e2eTests', label: 'End-to-End Tests - Full user workflows (Playwright)' },
            { key: 'testEnvironment', label: 'Test Environment - Separate test database' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements[item.key as keyof ProductionRequirements] as boolean}
                onCheckedChange={(checked) => updateRequirement(item.key as keyof ProductionRequirements, checked)}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {(requirements.unitTests || requirements.integrationTests) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We'll generate a complete test suite with sample tests for all your endpoints and business logic.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderDevOpsStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">CI/CD Pipeline</Label>
        <Select value={requirements.cicd} onValueChange={(value: any) => updateRequirement('cicd', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="github">GitHub Actions</SelectItem>
            <SelectItem value="gitlab">GitLab CI</SelectItem>
            <SelectItem value="azure">Azure DevOps</SelectItem>
            <SelectItem value="none">No CI/CD (Manual deployment)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-semibold">Monitoring & Observability</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'sentry', label: 'Sentry - Error tracking and performance' },
            { key: 'datadog', label: 'Datadog - Infrastructure monitoring' },
            { key: 'newrelic', label: 'New Relic - Application performance' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements.monitoring.includes(item.key as any)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateRequirement('monitoring', [...requirements.monitoring.filter(m => m !== 'none'), item.key]);
                  } else {
                    updateRequirement('monitoring', requirements.monitoring.filter(m => m !== item.key));
                  }
                }}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Deployment Target</Label>
        <Select value={requirements.deployment} onValueChange={(value: any) => updateRequirement('deployment', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vercel">Vercel - Serverless, auto-scaling</SelectItem>
            <SelectItem value="heroku">Heroku - Simple deployment</SelectItem>
            <SelectItem value="aws">AWS - Full cloud infrastructure</SelectItem>
            <SelectItem value="gcp">Google Cloud Platform</SelectItem>
            <SelectItem value="azure">Microsoft Azure</SelectItem>
            <SelectItem value="docker">Docker Container</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-semibold">Infrastructure Features</Label>
        <div className="mt-2 space-y-2">
          {[
            { key: 'logging', label: 'Structured Logging - Centralized log management' },
            { key: 'backups', label: 'Automated Backups - Database backup strategy' },
            { key: 'cdn', label: 'CDN - Content delivery network for static assets' }
          ].map(item => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox 
                checked={requirements[item.key as keyof ProductionRequirements] as boolean}
                onCheckedChange={(checked) => updateRequirement(item.key as keyof ProductionRequirements, checked)}
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const complexity = getEstimatedComplexity();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Production Readiness Summary</h3>
            <Badge className={complexity.color}>{complexity.level}</Badge>
          </div>
          <p className="text-gray-600 mb-4">
            Based on your selections, we'll generate a production-ready API with the following features:
          </p>
          <div className="text-sm text-gray-500">
            <strong>Estimated setup time:</strong> {complexity.days}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Security & Auth
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Authentication: {requirements.authentication.toUpperCase()}</div>
              {requirements.rateLimiting && <div>• Rate limiting enabled</div>}
              {requirements.cors && <div>• CORS configured</div>}
              {requirements.inputValidation && <div>• Input validation</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <FileCheck className="w-4 h-4 mr-2" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {requirements.compliance.length > 0 ? (
                requirements.compliance.map(c => <div key={c}>• {c.toUpperCase()}</div>)
              ) : (
                <div>No specific compliance required</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <TestTube className="w-4 h-4 mr-2" />
                Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {requirements.unitTests && <div>• Unit tests</div>}
              {requirements.integrationTests && <div>• Integration tests</div>}
              {requirements.e2eTests && <div>• E2E tests</div>}
              {requirements.testEnvironment && <div>• Test environment</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Cloud className="w-4 h-4 mr-2" />
                DevOps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Deploy to: {requirements.deployment}</div>
              {requirements.cicd !== 'none' && <div>• {requirements.cicd} CI/CD</div>}
              {requirements.monitoring.length > 0 && <div>• Monitoring: {requirements.monitoring.join(', ')}</div>}
              {requirements.backups && <div>• Automated backups</div>}
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your API will be generated with all selected features pre-configured. You can always modify these settings later.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return requirements.useCase && requirements.expectedUsers;
      case 1: return requirements.authentication;
      default: return true;
    }
  };

  const handleComplete = () => {
    onComplete(requirements, selectedTemplate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="text-2xl mr-3">🚀</div>
            Production Readiness Wizard
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {index < currentStep ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-xs mt-1 text-center whitespace-nowrap">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {currentStep === 0 && renderBusinessStep()}
          {currentStep === 1 && renderSecurityStep()}
          {currentStep === 2 && renderComplianceStep()}
          {currentStep === 3 && renderTestingStep()}
          {currentStep === 4 && renderDevOpsStep()}
          {currentStep === 5 && renderReviewStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Generate Production API
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
