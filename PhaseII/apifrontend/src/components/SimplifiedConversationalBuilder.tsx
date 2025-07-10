import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb, CheckCircle, ArrowRight, Heart, Star, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getAIService, type ChatMessage } from '@/services/realAIService';
import { apiService } from '@/services/apiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AppInfo {
  name: string;
  description: string;
  things: string[];
  actions: string[];
  users: string[];
  connections: string[];
}

interface SimplifiedConversationalBuilderProps {
  onProjectCreate?: (projectData: any) => void;
}

export function SimplifiedConversationalBuilder({ onProjectCreate }: SimplifiedConversationalBuilderProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "🚀 **I'm APIBuilder - I BUILD working APIs instantly!**\n\nJust tell me what API you need and I'll build it for you right now with:\n• Production-ready endpoints\n• Authentication & security\n• Database & deployment config\n• Complete documentation\n\n**What API should I build for you?**",
      timestamp: new Date(),
      suggestions: [
        "Build telematics API like Terminal49",
        "Create user management API with auth",
        "Build payment processing API",
        "Create notification webhook API"
      ]
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState({ stage: '', progress: 0 });
  const [builtAPI, setBuiltAPI] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [appInfo, setAppInfo] = useState<AppInfo>({
    name: '',
    description: '',
    things: [],
    actions: [],
    users: [],
    connections: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    // Only scroll within the chat container, not the entire page
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    // Only auto-scroll if user is near the bottom of the chat
    const chatContainer = messagesEndRef.current?.parentElement?.parentElement;
    if (chatContainer) {
      const isNearBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 100;
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [currentInput]);

  const addMessage = (type: 'user' | 'ai', content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (response: string, suggestions?: string[]) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
    setIsTyping(false);
    addMessage('ai', response, suggestions);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    console.log('Sending message:', userMessage, 'Current step:', step);
    addMessage('user', userMessage);
    setCurrentInput('');

    try {
      // Send message to real backend
      const chatResponse = await apiService.sendChatMessage(userMessage, { step, appInfo });
      
      // Add AI response
      addMessage('ai', chatResponse.response);
      
      // If backend indicates we should build, start the real build process
      if (chatResponse.shouldBuild) {
        await buildAPI(userMessage);
        return;
      }
      
      // Handle other conversation flow logic...
      if (userMessage.toLowerCase().includes('yes') && userMessage.toLowerCase().includes('create') && step === 4) {
        console.log('Creating API with info:', appInfo);
        await buildAPI(appInfo.description || 'Custom API based on user requirements');
        return;
      }
      
      // Extract app info from the user's response
      await updateAppInfo(userMessage, step);
      
      // Advance step if needed
      if (step < 4) {
        setStep(step + 1);
      }
      
    } catch (error: any) {
      console.error('Chat request failed:', error);
      
      // Fallback to basic response if backend fails
      const fallbackResponse = getFallbackResponse(userMessage, step);
      addMessage('ai', fallbackResponse);
      
      if (step < 4) {
        setStep(step + 1);
      }
      
      toast.error('Connection issue: ' + error.message);
    }
  };

  const updateAppInfo = async (userMessage: string, currentStep: number) => {
    const message = userMessage.toLowerCase();
    
    switch (currentStep) {
      case 0:
        setAppInfo(prev => ({
          ...prev,
          name: userMessage.split(' ').slice(0, 3).join(' ') || 'My API',
          description: userMessage
        }));
        break;
      case 1:
        const things = extractThings(message);
        setAppInfo(prev => ({ ...prev, things }));
        break;
      case 2:
        const actions = extractActions(message);
        setAppInfo(prev => ({ ...prev, actions }));
        break;
      case 3:
        const users = extractUsers(message);
        setAppInfo(prev => ({ ...prev, users }));
        break;
      case 4:
        const connections = extractConnections(message);
        setAppInfo(prev => ({ ...prev, connections }));
        break;
    }
  };

  const extractThings = (message: string): string[] => {
    const commonThings = ['users', 'posts', 'comments', 'products', 'orders', 'customers', 'items', 'files', 'messages', 'tasks', 'projects', 'events', 'bookings', 'reviews', 'categories'];
    return commonThings.filter(thing => message.includes(thing));
  };

  const extractActions = (message: string): string[] => {
    const commonActions = ['create', 'edit', 'delete', 'view', 'share', 'comment', 'like', 'purchase', 'search', 'filter', 'upload', 'download', 'send', 'receive'];
    return commonActions.filter(action => message.includes(action));
  };

  const extractUsers = (message: string): string[] => {
    const commonUsers = ['customers', 'admin', 'users', 'team members', 'guests', 'moderators'];
    return commonUsers.filter(user => message.includes(user));
  };

  const extractConnections = (message: string): string[] => {
    const commonConnections = ['email', 'payment', 'social media', 'storage', 'analytics', 'notifications'];
    return commonConnections.filter(connection => message.includes(connection));
  };

  const getFallbackResponse = (userMessage: string, currentStep: number): string => {
    // Always try to build first
    if (hasSpecificRequirements(userMessage)) {
      return "Building your API now! Here's your complete API specification with endpoints, data models, and implementation code...";
    }
    
    // Only ask clarifying questions if message is extremely vague
    if (userMessage.length < 10) {
      return "What API should I build for you? Describe what you need and I'll generate the complete API specification.";
    }
    
    // For anything else, make assumptions and build
    return "Building a general-purpose API based on your requirements. Here's your complete API specification...";
  };

  const convertToTechnicalSpec = (info: AppInfo) => {
    // Convert everyday language to API technical specifications
    const models = info.things.map(thing => ({
      id: Date.now().toString() + Math.random(),
      name: thing.charAt(0).toUpperCase() + thing.slice(1).replace(/s$/, ''),
      fields: [
        { id: '1', name: 'id', type: 'number', required: true },
        { id: '2', name: 'name', type: 'text', required: true },
        { id: '3', name: 'description', type: 'text', required: false },
        { id: '4', name: 'createdAt', type: 'date', required: true },
        ...(thing.includes('user') ? [
          { id: '5', name: 'email', type: 'email', required: true },
          { id: '6', name: 'password', type: 'text', required: true }
        ] : [])
      ]
    }));

    // Generate API endpoints based on actions
    const endpoints = info.actions.map(action => {
      const method = action.includes('create') ? 'POST' : 
                    action.includes('update') ? 'PUT' : 
                    action.includes('delete') ? 'DELETE' : 'GET';
      return {
        id: Date.now().toString() + Math.random(),
        path: `/api/${action.toLowerCase().replace(/\s+/g, '-')}`,
        method,
        description: `${action} endpoint`
      };
    });

    return {
      name: info.name,
      description: info.description,
      models,
      endpoints
    };
  };

  const handleSuggestionClick = async (suggestion: string) => {
    addMessage('user', suggestion);
    
    // Immediately show building status and start building
    addMessage('ai', `🚀 **BUILDING YOUR API**

⏳ **Status:** Starting build process...

I'll have your API ready in moments with all endpoints, authentication, database, and deployment configuration.

Building now...`);
    
    // Start building immediately
    await buildAPI(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        copyChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [messages]);

  const getProgressEmoji = () => {
    switch (step) {
      case 0: return '🎯';
      case 1: return '🏷️';
      case 2: return '👥';
      case 3: return '📝';
      case 4: return '🔗';
      default: return '✨';
    }
  };

  const getProgressText = () => {
    switch (step) {
      case 0: return 'Understanding your API idea';
      case 1: return 'Defining API data models';
      case 2: return 'Planning API operations';
      case 3: return 'Setting API access control';
      case 4: return 'Configuring API integrations';
      default: return 'Building your API';
    }
  };

  const hasSpecificRequirements = (message: string): boolean => {
    const lower = message.toLowerCase();
    
    // Check for any API-related terminology or business domain
    const apiTerms = [
      'api', 'endpoint', 'rest', 'graphql', 'webhook', 'crud',
      'authentication', 'jwt', 'oauth', 'token', 'auth',
      'database', 'data', 'model', 'schema', 'json',
      'integration', 'service', 'platform', 'system'
    ];
    
    // Check for business domains that clearly indicate API needs
    const businessDomains = [
      'logistics', 'telematics', 'tracking', 'fleet',
      'ecommerce', 'payment', 'user', 'customer',
      'inventory', 'order', 'product', 'booking',
      'notification', 'messaging', 'social', 'media'
    ];
    
    // Check for action words that indicate building intent
    const actionWords = [
      'build', 'create', 'make', 'develop', 'design',
      'need', 'want', 'require', 'looking for'
    ];
    
    // If message has any combination of these, it's buildable
    const hasApiTerms = apiTerms.some(term => lower.includes(term));
    const hasDomain = businessDomains.some(domain => lower.includes(domain));
    const hasAction = actionWords.some(action => lower.includes(action));
    
    // Be generous - if they mention building anything with API context, build it
    return hasApiTerms || hasDomain || hasAction || message.length > 30;
  };

  const copyChat = async () => {
    const chatContent = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleString();
      const sender = msg.type === 'user' ? 'User' : 'APIBuilder';
      return `[${timestamp}] ${sender}: ${msg.content}`;
    }).join('\n\n');
    
    const fullContent = `API Builder Chat Session
Generated: ${new Date().toLocaleString()}
Total Messages: ${messages.length}

${chatContent}`;
    
    try {
      await navigator.clipboard.writeText(fullContent);
      toast.success('Chat copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy chat');
    }
  };

  const generateIntegrationCode = (api: any) => {
    const className = api.name.replace(/\s+/g, '');
    const packageName = api.name.toLowerCase().replace(/\s+/g, '-');
    
    return {
      javascript: `// Install the SDK
npm install ${packageName}-sdk

// Initialize
import { ${className}Client } from '${packageName}-sdk';

const client = new ${className}Client({
  apiKey: 'your-api-key',
  baseURL: '${api.deploymentUrl}'
});

// Usage examples
const vehicles = await client.vehicles.list();
const driver = await client.drivers.get('driver-id');`,
      
      python: `# Install the SDK
pip install ${packageName}-python

# Initialize
from ${packageName} import ${className}Client

client = ${className}Client(
    api_key='your-api-key',
    base_url='${api.deploymentUrl}'
)

# Usage examples
vehicles = client.vehicles.list()
driver = client.drivers.get('driver-id')`,

      curl: `# Authentication
curl -X POST ${api.deploymentUrl}/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"api_key": "your-api-key"}'

# List vehicles
curl -X GET ${api.deploymentUrl}/vehicles \\
  -H "Authorization: Bearer YOUR_TOKEN"`
    };
  };

  const buildAPI = async (requirements: string) => {
    setIsBuilding(true);
    setBuildProgress({ stage: 'Starting build...', progress: 0 });
    
    try {
      // Start real API generation on backend
      const { projectId } = await apiService.generateAPI(requirements);
      
      // Poll for progress updates
      const pollProgress = async () => {
        try {
          const progress = await apiService.getGenerationProgress(projectId);
          
          setBuildProgress({
            stage: progress.stage,
            progress: progress.progress
          });
          
          // Add progress message
          addMessage('ai', `� **${progress.stage}**`);
          
          if (progress.status === 'completed') {
            // Finalize and create the project
            const project = await apiService.finalizeAPIGeneration(projectId);
            
            setBuildProgress({ stage: 'Complete!', progress: 100 });
            
            // Show completion with real data
            addMessage('ai', `✅ **API BUILD COMPLETE!**

**${project.name}** is ready with:
• ${project.endpoints?.length || 0} REST endpoints
• ${Object.keys(project.dataModel || {}).length} data models  
• JWT authentication & security
• PostgreSQL with Redis cache storage
• Interactive OpenAPI 3.0 documentation

**🎯 NEXT ACTIONS:**
1. **🚀 DEPLOY** → Deploy to production environment
2. **🧪 TEST** → Run integration tests & validate  
3. **📊 MONITOR** → Set up real-time monitoring
4. **🔗 INTEGRATE** → Connect to your applications

**Ready to deploy?** Click Deploy to go live!`, [
              '🚀 Deploy to Production',
              '🧪 Run Tests',
              '📊 Setup Monitoring', 
              '📖 View Documentation'
            ]);
            
            setBuiltAPI({
              name: project.name,
              endpoints: project.endpoints?.length || 0,
              models: Object.keys(project.dataModel || {}).length,
              authentication: "JWT Authentication",
              database: "PostgreSQL with Redis cache",
              documentation: "Interactive OpenAPI 3.0",
              deploymentUrl: `https://api-${project.id}.production.com`,
              features: [
                "Real-time data synchronization",
                "Webhook event system", 
                "Rate limiting & monitoring",
                "Multi-provider integrations",
                "Automated data normalization",
                "Error handling & logging",
                "API versioning support"
              ],
              projectId: project.id,
              project: project
            });
            
            // Notify parent component that project was created
            if (onProjectCreate) {
              onProjectCreate(project);
            }
            
            toast.success(`${project.name} API has been created successfully!`);
            
          } else if (progress.status === 'failed') {
            throw new Error('API generation failed');
          } else {
            // Continue polling
            setTimeout(pollProgress, 1000);
          }
          
        } catch (error) {
          console.error('Progress polling error:', error);
          setTimeout(pollProgress, 2000); // Retry with longer delay
        }
      };
      
      // Start polling
      setTimeout(pollProgress, 1000);
      
    } catch (error: any) {
      console.error('Build error:', error);
      addMessage('ai', '❌ **BUILD FAILED** - Please try again or contact support.', [
        'Try Again',
        'Get Support'
      ]);
      toast.error('Failed to build API: ' + error.message);
    } finally {
      setIsBuilding(false);
    }
  };



  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Let's Build Your API! 
          </h2>
          <p className="text-gray-600 text-sm">No technical knowledge required - just describe your API idea</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyChat}
            className="flex items-center space-x-2 bg-white/80 hover:bg-white"
            title="Copy entire chat for troubleshooting (Ctrl+K / Cmd+K)"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">Copy Chat</span>
          </Button>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-lg">{getProgressEmoji()}</span>
            <span className="text-sm text-gray-600">{getProgressText()}</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[85%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                } items-end space-x-3`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm border'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1]?.suggestions && (
            <div className="flex justify-start">
              <div className="max-w-[85%] ml-13">
                <p className="text-xs text-gray-500 mb-3">💡 Try these:</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white hover:bg-purple-50 border-purple-200 text-purple-700 rounded-full"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center ml-13">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Built API Actions */}
      {builtAPI && (
        <div className="px-6 py-4 border-t bg-gradient-to-r from-green-50 to-blue-50 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">{builtAPI.name} Ready!</h3>
                  <p className="text-sm text-green-600">{builtAPI.endpoints} endpoints • {builtAPI.models} models</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    toast.success('Deployment started! Your API will be live in 2-3 minutes.');
                    addMessage('ai', `🚀 **DEPLOYING TO PRODUCTION**

Your ${builtAPI.name} is being deployed to: \`${builtAPI.deploymentUrl}\`

⏳ Estimated time: 2-3 minutes
📦 Creating containers...
🔧 Configuring load balancer...
🛡️ Setting up security...

You'll receive a notification when deployment is complete!`);
                  }}
                >
                  🚀 Deploy
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    toast.success('Test suite launched! Running comprehensive API tests...');
                    addMessage('ai', `🧪 **RUNNING API TESTS**

Testing your ${builtAPI.name}:
✅ Authentication endpoints
✅ CRUD operations  
✅ Data validation
✅ Error handling
⏳ Performance tests...
⏳ Security scans...

Tests typically complete in 1-2 minutes.`);
                  }}
                >
                  🧪 Test
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    toast.success('Monitoring dashboard configured!');
                    addMessage('ai', `📊 **MONITORING SETUP COMPLETE**

Your ${builtAPI.name} monitoring includes:
• Real-time request/response metrics
• Error rate tracking  
• Performance analytics
• Security event logging
• Alert notifications

Dashboard: \`https://monitor-${builtAPI.deploymentUrl.split('-')[1]?.split('.')[0]}.production.com\`
Alerts will be sent to your email.`);
                  }}
                >
                  📊 Monitor
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  onClick={() => {
                    const integrationCode = generateIntegrationCode(builtAPI);
                    addMessage('ai', `🔗 **INTEGRATION CODE READY**

Add this to your application:

\`\`\`javascript
// Install the SDK
npm install ${builtAPI.name.toLowerCase().replace(/\s+/g, '-')}-sdk

// Initialize
import { ${builtAPI.name.replace(/\s+/g, '')}Client } from '${builtAPI.name.toLowerCase().replace(/\s+/g, '-')}-sdk';

const client = new ${builtAPI.name.replace(/\s+/g, '')}Client({
  apiKey: 'your-api-key',
  baseURL: '${builtAPI.deploymentUrl}'
});

// Usage examples
const vehicles = await client.vehicles.list();
const driver = await client.drivers.get('driver-id');
\`\`\`

**Next steps:**
1. Get your API key from the dashboard
2. Install the SDK: \`npm install ${builtAPI.name.toLowerCase().replace(/\s+/g, '-')}-sdk\`
3. Follow the integration guide above`);
                    toast.success('Integration code generated! Check the chat for implementation details.');
                  }}
                >
                  � Integrate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-end space-x-3 max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your API idea..."
            className="flex-1 rounded-2xl border-purple-200 focus:border-purple-400 focus:ring-purple-400 min-h-[50px] max-h-[200px] resize-none"
            disabled={isTyping}
            rows={1}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentInput.trim() || isTyping}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full px-6 h-12"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {step === 0 && (
          <div className="mt-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Heart className="w-3 h-3" />
                <span>Just describe your API idea in plain English - I'll handle all the technical stuff!</span>
              </div>
              <div className="flex items-center space-x-2">
                <Copy className="w-3 h-3" />
                <span>Ctrl+K to copy chat</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
