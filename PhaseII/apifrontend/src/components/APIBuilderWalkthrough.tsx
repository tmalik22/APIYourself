import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Database, 
  Globe, 
  Code, 
  Settings,
  Users,
  FileText,
  ShoppingCart,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  nextStep?: string;
  prevStep?: string;
}

interface APIBuilderWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProject?: (template: string) => void;
  onStartSimpleBuilder?: () => void;
}

export function APIBuilderWalkthrough({ isOpen, onClose, onStartProject, onStartSimpleBuilder }: APIBuilderWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState('overview');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: WalkthroughStep[] = [
    {
      id: 'overview',
      title: 'Welcome to APIYourself',
      description: 'Turn ideas into revenue-generating APIs in hours, not months',
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Skip the 6-Month Development Cycle</h2>
            <p className="text-gray-600 mb-6">
              Build production-ready APIs visually. No coding required, no massive budgets needed. 
              Get to market faster than your competition.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="text-center pb-2">
                <Database className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <CardTitle className="text-sm">Visual Data Design</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">Click, drag, connect. No SQL knowledge needed.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center pb-2">
                <Globe className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <CardTitle className="text-sm">Instant Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">RESTful APIs generated automatically from your design.</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="text-center pb-2">
                <Code className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <CardTitle className="text-sm">Production Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">Clean, documented, deployable code in seconds.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">❌ Traditional Development:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 6+ months development time</li>
                <li>• $100K+ in developer costs</li>
                <li>• High failure rate (70% of projects fail)</li>
                <li>• Missed market opportunities</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ APIYourself:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Launch in hours, not months</li>
                <li>• $99/month total cost</li>
                <li>• 100% success rate (it always works)</li>
                <li>• First-to-market advantage</li>
              </ul>
            </div>
          </div>
          
          <Alert className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to start?</strong> We'll walk you through creating your first data model in under 2 minutes - no technical experience needed!
            </AlertDescription>
          </Alert>
        </div>
      ),
      nextStep: 'concepts'
    },
    
    {
      id: 'concepts',
      title: 'Key Concepts',
      description: 'Understanding the building blocks',
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Three Main Components:</h3>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Database className="w-5 h-5 text-blue-500 mr-2" />
                  <h4 className="font-medium">1. Data Models</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Define the "things" in your app and their properties.
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Example:</strong> A "User" model might have: name, email, password, createdAt
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 text-green-500 mr-2" />
                  <h4 className="font-medium">2. API Endpoints</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Define how clients interact with your data.
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Example:</strong> GET /users (list all users), POST /users (create new user)
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Code className="w-5 h-5 text-purple-500 mr-2" />
                  <h4 className="font-medium">3. Generated Code</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Complete server code with database, routes, and documentation.
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Output:</strong> Express.js server, database models, API documentation
                </div>
              </div>
            </div>
          </div>
          
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>The Flow:</strong> Design Models → Create Endpoints → Generate Code → Deploy API
            </AlertDescription>
          </Alert>
        </div>
      ),
      nextStep: 'examples',
      prevStep: 'overview'
    },
    
    {
      id: 'examples',
      title: 'Real Business Value',
      description: 'Why APIs make financial sense',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">APIs = Business Acceleration</h3>
            <p className="text-gray-600">See how APIs save time, money, and unlock new revenue streams</p>
          </div>

          <Tabs defaultValue="startup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="startup">Startup</TabsTrigger>
              <TabsTrigger value="saas">SaaS</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>
            
            <TabsContent value="startup" className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Zap className="w-5 h-5 mr-2" />
                    Startup MVP: Food Delivery App
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">⚡ Without API (Traditional):</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Hire 2-3 developers: $180K/year</li>
                        <li>• 3-6 months development time</li>
                        <li>• $50K+ in infrastructure setup</li>
                        <li>• Missed market window</li>
                      </ul>
                      <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-sm font-medium">
                        Total: $280K+ & 6 months
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">🚀 With APIYourself:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Design API in 2 hours</li>
                        <li>• Generate production code instantly</li>
                        <li>• Focus budget on marketing & growth</li>
                        <li>• Launch in weeks, not months</li>
                      </ul>
                      <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-sm font-medium">
                        Total: $99/month & 2 weeks
                      </div>
                    </div>
                  </div>
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>ROI:</strong> Get to market 5x faster, save $250K+ in development costs, validate your idea before major investment
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saas" className="space-y-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Code className="w-5 h-5 mr-2" />
                    SaaS Platform: Customer Analytics Tool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold text-blue-800 mb-2">💰 Revenue Opportunity:</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Build API-first = Enable integrations with Zapier, Slack, HubSpot, etc.
                      </p>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Basic SaaS:</span> $50/month per customer
                        </div>
                        <div>
                          <span className="font-medium">API-enabled SaaS:</span> $200/month per customer
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold text-blue-800 mb-2">⏰ Time to Market:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Manual coding:</strong> 6+ months for MVP + API</li>
                        <li>• <strong>APIYourself:</strong> 1 week for complete system</li>
                        <li>• <strong>Result:</strong> 5 months earlier revenue generation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-100 border-blue-300">
                    <Users className="h-4 w-4 text-blue-700" />
                    <AlertDescription className="text-blue-800">
                      <strong>Scale Strategy:</strong> APIs let customers build their own integrations = network effects + reduced support burden
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ecommerce" className="space-y-4">
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    E-commerce: Multi-Channel Selling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold text-purple-800 mb-2">🛒 Why APIs Matter in E-commerce:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Omnichannel:</strong> Sell on website, mobile app, Amazon, eBay, social media</li>
                        <li>• <strong>Inventory sync:</strong> Real-time stock updates across all channels</li>
                        <li>• <strong>Customer data:</strong> Unified view across touchpoints</li>
                        <li>• <strong>Third-party tools:</strong> Connect analytics, email marketing, fulfillment</li>
                      </ul>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 rounded border border-red-200">
                        <h5 className="font-medium text-red-800 mb-1">Without API:</h5>
                        <ul className="text-xs text-red-700 space-y-1">
                          <li>• Manual inventory updates</li>
                          <li>• Overselling/stockouts</li>
                          <li>• Disconnected customer data</li>
                          <li>• Limited to one sales channel</li>
                        </ul>
                        <div className="mt-2 text-red-800 font-medium text-sm">Lost Revenue: 40-60%</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <h5 className="font-medium text-green-800 mb-1">With API:</h5>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Automated multi-channel sync</li>
                          <li>• Real-time inventory accuracy</li>
                          <li>• 360° customer insights</li>
                          <li>• Infinite integrations possible</li>
                        </ul>
                        <div className="mt-2 text-green-800 font-medium text-sm">Revenue Growth: 200-400%</div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-green-100 border-green-300">
                    <ShoppingCart className="h-4 w-4 text-green-700" />
                    <AlertDescription className="text-green-800">
                      <strong>Success Story:</strong> Shopify's API strategy enabled 100,000+ third-party apps, driving billions in merchant revenue
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-4">
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Settings className="w-5 h-5 mr-2" />
                    Enterprise: System Integration & Digital Transformation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold text-orange-800 mb-2">💼 Enterprise API Value:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Legacy modernization:</strong> Connect old systems without full rebuilds</li>
                        <li>• <strong>Data silos elimination:</strong> Break down departmental barriers</li>
                        <li>• <strong>Partner ecosystems:</strong> B2B integrations with suppliers/customers</li>
                        <li>• <strong>Operational efficiency:</strong> Automate manual processes</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold text-orange-800 mb-2">📊 Enterprise ROI Example:</h4>
                      <div className="text-sm text-gray-700">
                        <p className="mb-2"><strong>Fortune 500 Manufacturer:</strong></p>
                        <ul className="space-y-1 ml-4">
                          <li>• Connected 50+ internal systems via APIs</li>
                          <li>• Reduced manual data entry by 80%</li>
                          <li>• Eliminated 120 hours/week of redundant work</li>
                          <li>• Enabled real-time supply chain visibility</li>
                        </ul>
                        <div className="mt-2 p-2 bg-orange-100 rounded">
                          <strong>Result:</strong> $2.3M annual savings, 6-month payback period
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-orange-100 border-orange-300">
                    <Target className="h-4 w-4 text-orange-700" />
                    <AlertDescription className="text-orange-800">
                      <strong>Why Not Custom Development:</strong> 18-24 month projects, $500K+ budgets, high failure rates. APIs enable iterative, low-risk transformation.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
            <h4 className="font-bold mb-2">🎯 The Bottom Line:</h4>
            <p className="text-sm opacity-90">
              APIs aren't just technical infrastructure - they're business accelerators. Every day without an API is lost revenue, missed opportunities, and competitive disadvantage.
            </p>
          </div>
        </div>
      ),
      nextStep: 'scaling',
      prevStep: 'concepts'
    },

    {
      id: 'scaling',
      title: 'Deployment & Scale',
      description: 'From local development to production deployment',
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">🚀 APIYourself Scales With You</h3>
            <p className="text-gray-600">Open-source, free forever. Only costs: your LLM usage + hosting infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  ✅ Perfect For All Scales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-white rounded">
                    <strong>Prototyping & MVPs (0-1K users)</strong>
                    <p className="text-gray-600 text-xs">Validate ideas quickly with minimal infrastructure</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Growing Startups (1K-50K users)</strong>
                    <p className="text-gray-600 text-xs">Scale with proper database and caching setup</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Enterprise Scale (50K+ users)</strong>
                    <p className="text-gray-600 text-xs">Deploy with load balancers, CDN, multiple regions</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Internal Tools (Any scale)</strong>
                    <p className="text-gray-600 text-xs">Perfect for company dashboards, admin tools, workflows</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Microservices Architecture</strong>
                    <p className="text-gray-600 text-xs">Generate individual services, deploy independently</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  🌐 Deployment Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-white rounded">
                    <strong>Development ($0/month)</strong>
                    <p className="text-gray-600 text-xs">Run locally, use Ollama for free AI generation</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Basic Production ($5-20/month)</strong>
                    <p className="text-gray-600 text-xs">VPS + PostgreSQL + OpenAI API calls</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Scalable Cloud ($50-200/month)</strong>
                    <p className="text-gray-600 text-xs">AWS/Google Cloud + auto-scaling + CDN</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Enterprise ($200-1000/month)</strong>
                    <p className="text-gray-600 text-xs">Multi-region, load balancers, monitoring</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <strong>Self-Hosted (Hardware cost only)</strong>
                    <p className="text-gray-600 text-xs">Your servers, your control, maximum security</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-purple-50 border-purple-200">
            <Zap className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Open Source Advantage:</strong> No vendor lock-in, no licensing fees, no artificial limits. You own your code and data forever.
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white">
            <h4 className="font-bold mb-2">💡 Cost Reality Check:</h4>
            <p className="text-sm opacity-90">
              Traditional: $180K/year developer + $50K infrastructure. APIYourself: $10-20/month hosting + $30/month LLM calls = 99.9% cost savings.
            </p>
          </div>
        </div>
      ),
      nextStep: 'deployment',
      prevStep: 'examples'
    },

    {
      id: 'deployment',
      title: 'Deploy & Use Your APIs',
      description: 'From generated code to production deployment',
      icon: <Globe className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">🚀 From Code to Production</h3>
            <p className="text-gray-600">Step-by-step deployment and API consumption guide</p>
          </div>

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
              <TabsTrigger value="consume">Use APIs</TabsTrigger>
              <TabsTrigger value="scale">Scale</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-blue-500" />
                    Step 1: Generate Your API Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded border">
                      <h4 className="font-semibold text-blue-800 mb-2">What You Get:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>✅ <strong>Complete Express.js Server</strong> - Production-ready Node.js API</li>
                        <li>✅ <strong>Database Schema</strong> - PostgreSQL/MongoDB models and migrations</li>
                        <li>✅ <strong>RESTful Endpoints</strong> - CRUD operations for all your models</li>
                        <li>✅ <strong>API Documentation</strong> - Auto-generated OpenAPI/Swagger docs</li>
                        <li>✅ <strong>Authentication</strong> - JWT token-based auth system</li>
                        <li>✅ <strong>Validation</strong> - Input validation and error handling</li>
                        <li>✅ <strong>Docker Files</strong> - Containerization for easy deployment</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded border">
                      <h4 className="font-semibold mb-2">Generated File Structure:</h4>
                      <div className="text-xs font-mono text-gray-600">
                        <div>my-api/</div>
                        <div>├── server.js          # Main application</div>
                        <div>├── models/           # Database models</div>
                        <div>├── routes/           # API endpoints</div>
                        <div>├── middleware/       # Auth, validation</div>
                        <div>├── docs/            # API documentation</div>
                        <div>├── Dockerfile       # Container setup</div>
                        <div>└── package.json     # Dependencies</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deploy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-green-500" />
                    Step 2: Deploy to Production
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="cloud" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="cloud">Cloud Deploy</TabsTrigger>
                      <TabsTrigger value="vps">VPS Deploy</TabsTrigger>
                      <TabsTrigger value="docker">Docker Deploy</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cloud">
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded border">
                          <h5 className="font-semibold text-green-800 mb-2">🚀 One-Click Deploy Options:</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Heroku:</strong> Push code, auto-deploy, $7/month</div>
                            <div><strong>Railway:</strong> Git-based deploy, $5/month</div>
                            <div><strong>Render:</strong> Auto-scaling, $7/month</div>
                            <div><strong>Vercel:</strong> Serverless APIs, pay-per-use</div>
                            <div><strong>AWS Amplify:</strong> Full-stack, auto-scaling</div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded border">
                          <h5 className="font-semibold text-blue-800 mb-2">Deploy Commands:</h5>
                          <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                            <div># Deploy to Heroku</div>
                            <div>git push heroku main</div>
                            <div></div>
                            <div># Deploy to Railway</div>
                            <div>railway up</div>
                            <div></div>
                            <div># Your API is live at:</div>
                            <div>https://your-api.herokuapp.com</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vps">
                      <div className="space-y-3">
                        <div className="p-3 bg-purple-50 rounded border">
                          <h5 className="font-semibold text-purple-800 mb-2">🖥️ VPS Deployment (More Control):</h5>
                          <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                            <div># On your VPS (DigitalOcean, Linode, etc.)</div>
                            <div>git clone your-api-repo</div>
                            <div>cd your-api</div>
                            <div>npm install</div>
                            <div>npm start</div>
                            <div></div>
                            <div># Setup reverse proxy (Nginx)</div>
                            <div># Configure SSL (Let's Encrypt)</div>
                            <div># Your API: https://yourdomain.com/api</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="docker">
                      <div className="space-y-3">
                        <div className="p-3 bg-orange-50 rounded border">
                          <h5 className="font-semibold text-orange-800 mb-2">🐳 Docker Deployment (Scalable):</h5>
                          <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                            <div># Build and run with Docker</div>
                            <div>docker build -t my-api .</div>
                            <div>docker run -p 3000:3000 my-api</div>
                            <div></div>
                            <div># Or use Docker Compose</div>
                            <div>docker-compose up -d</div>
                            <div></div>
                            <div># Scale with Kubernetes</div>
                            <div>kubectl apply -f k8s/</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consume" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    Step 3: Use Your APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded border">
                      <h4 className="font-semibold text-purple-800 mb-2">📱 Frontend Applications:</h4>
                      <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                        <div>// React/Vue/Angular frontend</div>
                        <div>fetch('https://your-api.com/api/users')</div>
                        <div>  .then(res =&gt; res.json())</div>
                        <div>  .then(users =&gt; setUsers(users))</div>
                        <div></div>
                        <div>// Create new user</div>
                        <div>fetch('https://your-api.com/api/users', {'{'}</div>
                        <div>  method: 'POST',</div>
                        <div>  body: JSON.stringify({'{'}name: 'John'{'}'}){'}'}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded border">
                      <h4 className="font-semibold text-blue-800 mb-2">📱 Mobile Apps:</h4>
                      <div className="text-xs font-mono bg-black text-green-400 p-2 rounded">
                        <div>// React Native / Flutter</div>
                        <div>const response = await fetch(</div>
                        <div>  'https://your-api.com/api/products'</div>
                        <div>)</div>
                        <div>const products = await response.json()</div>
                        <div></div>
                        <div>// Swift iOS</div>
                        <div>URLSession.shared.dataTask(</div>
                        <div>  with: URL(string: "your-api.com/api/...")!</div>
                        <div>)</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded border">
                      <h4 className="font-semibold text-green-800 mb-2">🔗 Third-Party Integrations:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Zapier:</strong> Connect to 5000+ apps automatically</li>
                        <li>• <strong>n8n:</strong> Open-source workflow automation</li>
                        <li>• <strong>Postman:</strong> API testing and documentation</li>
                        <li>• <strong>Insomnia:</strong> API client and testing</li>
                        <li>• <strong>Webhook endpoints:</strong> Real-time notifications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scale" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-500" />
                    Step 4: Scale Your APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded border">
                      <h4 className="font-semibold text-orange-800 mb-2">📈 Scaling Strategies:</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Database Optimization:</strong>
                          <ul className="text-gray-600 text-xs space-y-1 mt-1">
                            <li>• Add database indexes</li>
                            <li>• Set up read replicas</li>
                            <li>• Implement caching (Redis)</li>
                            <li>• Database connection pooling</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Infrastructure Scaling:</strong>
                          <ul className="text-gray-600 text-xs space-y-1 mt-1">
                            <li>• Load balancers (multiple servers)</li>
                            <li>• CDN for static assets</li>
                            <li>• Auto-scaling groups</li>
                            <li>• Multiple regions/data centers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded border">
                      <h4 className="font-semibold text-green-800 mb-2">🚀 Performance Monitoring:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>New Relic/DataDog:</strong> Application performance monitoring</li>
                        <li>• <strong>Uptime Robot:</strong> 24/7 uptime monitoring</li>
                        <li>• <strong>LogRocket:</strong> Error tracking and debugging</li>
                        <li>• <strong>Google Analytics:</strong> API usage analytics</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-100 border-blue-300">
                    <CheckCircle className="h-4 w-4 text-blue-700" />
                    <AlertDescription className="text-blue-800">
                      <strong>Reality Check:</strong> Most APIs never need complex scaling. Start simple, scale when you actually hit limits, not before.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ),
      nextStep: 'workflow',
      prevStep: 'scaling'
    },
    
    {
      id: 'workflow',
      title: 'Step-by-Step Workflow',
      description: 'How to build your first API',
      icon: <Play className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <h4 className="font-medium">Create a New Project</h4>
                <p className="text-sm text-gray-600">Choose a template or start from scratch</p>
                <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                  💡 Templates give you a head start with pre-built models
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <h4 className="font-medium">Design Your Data Models</h4>
                <p className="text-sm text-gray-600">Define what information your API will store</p>
                <div className="mt-2 text-xs bg-green-50 p-2 rounded">
                  💡 Think about the "things" in your app: Users, Products, Orders, etc.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <h4 className="font-medium">Configure API Endpoints</h4>
                <p className="text-sm text-gray-600">Define how clients will interact with your data</p>
                <div className="mt-2 text-xs bg-purple-50 p-2 rounded">
                  💡 CRUD endpoints are created automatically, but you can customize them
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <div>
                <h4 className="font-medium">Generate & Deploy</h4>
                <p className="text-sm text-gray-600">Get complete code and deploy your API</p>
                <div className="mt-2 text-xs bg-orange-50 p-2 rounded">
                  💡 Code includes server, database, documentation, and tests
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Ready to Start?</h4>
                  <p className="text-sm text-gray-600">Choose a template to begin with or create a blank project</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      nextStep: 'start',
      prevStep: 'examples'
    },
    
    {
      id: 'start',
      title: 'Start Building',
      description: 'Choose your starting point',
      icon: <Play className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Choose Your Starting Point</h3>
            <p className="text-gray-600">Select a template or start with a blank project</p>
          </div>
          
          <div className="grid gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500" 
                  onClick={() => onStartProject?.('blog')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Blog Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Start with Users and Posts models</p>
                <Badge variant="outline" className="mt-2">Beginner Friendly</Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-500" 
                  onClick={() => onStartProject?.('ecommerce')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
                  E-commerce Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Products, Orders, and Customers</p>
                <Badge variant="outline" className="mt-2">Popular Choice</Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-500" 
                  onClick={() => onStartProject?.('todo')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-purple-500" />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Projects and Tasks models</p>
                <Badge variant="outline" className="mt-2">Great for Learning</Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-gray-500" 
                  onClick={() => onStartProject?.('blank')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-500" />
                  Blank Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Start from scratch with no pre-built models</p>
                <Badge variant="outline" className="mt-2">Full Control</Badge>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Don't worry!</strong> You can always modify templates or add more models later.
            </AlertDescription>
          </Alert>
        </div>
      ),
      prevStep: 'workflow'
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const goToStep = (stepId: string) => {
    setCurrentStep(stepId);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const nextStep = () => {
    if (currentStepData?.nextStep) {
      goToStep(currentStepData.nextStep);
    }
  };

  const prevStep = () => {
    if (currentStepData?.prevStep) {
      goToStep(currentStepData.prevStep);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {currentStepData?.icon}
            <span>{currentStepData?.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${step.id === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : completedSteps.includes(step.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {completedSteps.includes(step.id) ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  completedSteps.includes(step.id) ? 'bg-green-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="min-h-[400px]">
          {currentStepData?.content}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={!currentStepData?.prevStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
          </div>
          
          {currentStepData?.nextStep ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="space-x-3">
              <Button 
                onClick={() => {
                  onClose();
                  onStartSimpleBuilder?.();
                }} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Simple Builder
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onClose();
                  onStartProject?.('');
                }}
              >
                Browse Templates
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
