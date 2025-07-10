import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb, CheckCircle, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSecureLLM, SecureLLMConfig } from '@/hooks/useSecureLLM';
import { SecurityMonitor, RateLimitWarning } from './SecurityMonitor';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface APISpec {
  name: string;
  description: string;
  models: any[];
  endpoints: any[];
  complete: boolean;
}

interface ConversationalAPIBuilderProps {
  onProjectCreate?: (projectData: { name: string; description: string; models: any[]; endpoints: any[] }) => void;
}

export function ConversationalAPIBuilder({ onProjectCreate }: ConversationalAPIBuilderProps) {
  // Generate unique session ID
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const userId = 'user_' + Date.now(); // In production, get from auth context
  
  // Secure LLM configuration
  const [llmConfig, setLlmConfig] = useState<SecureLLMConfig>({
    provider: 'ollama',
    model: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434'
  });
  const [useAI, setUseAI] = useState(false);
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  
  // Initialize secure LLM hook
  const { secureLLMCall, isLoading: isLLMLoading, lastResponse } = useSecureLLM(userId, sessionId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI API assistant. I'll help you build a custom API using natural language. Just describe what kind of application or system you want to create, and I'll ask the right questions to build it for you.",
      timestamp: new Date(),
      suggestions: [
        "I want to build a blog platform",
        "Create an e-commerce store API",
        "Build a task management system",
        "I need a social media app"
      ]
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<'initial' | 'gathering' | 'confirming' | 'complete'>('initial');
  const [apiSpec, setApiSpec] = useState<APISpec>({
    name: '',
    description: '',
    models: [],
    endpoints: [],
    complete: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'bot', content: string, suggestions?: string[]) => {
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
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    addMessage('bot', response, suggestions);
  };

  const analyzeUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Detect app type
    if (lowerInput.includes('blog') || lowerInput.includes('article') || lowerInput.includes('post')) {
      return 'blog';
    } else if (lowerInput.includes('shop') || lowerInput.includes('store') || lowerInput.includes('ecommerce') || lowerInput.includes('product')) {
      return 'ecommerce';
    } else if (lowerInput.includes('task') || lowerInput.includes('todo') || lowerInput.includes('project') || lowerInput.includes('manage')) {
      return 'task';
    } else if (lowerInput.includes('social') || lowerInput.includes('chat') || lowerInput.includes('friend') || lowerInput.includes('follow')) {
      return 'social';
    } else if (lowerInput.includes('user') || lowerInput.includes('auth') || lowerInput.includes('login')) {
      return 'user_management';
    }
    return 'custom';
  };

  const getStandardizedQuestions = (appType: string) => {
    const questions = {
      blog: [
        "What features should your blog have? (comments, categories, tags, etc.)",
        "Should users be able to register and create their own posts?",
        "Do you need moderation features for posts and comments?",
        "What information should be stored about authors?"
      ],
      ecommerce: [
        "What types of products will you sell?",
        "Do you need inventory tracking?",
        "What payment methods should be supported?",
        "Should customers be able to create accounts and save orders?",
        "Do you need categories, reviews, or wishlists?"
      ],
      task: [
        "Should tasks be organized in projects or lists?",
        "Do you need team collaboration features?",
        "What priority levels or statuses should tasks have?",
        "Should there be deadlines and reminders?",
        "Do you need time tracking or reporting?"
      ],
      social: [
        "What can users post? (text, images, videos, etc.)",
        "Should users be able to follow each other?",
        "Do you need messaging or chat features?",
        "What about likes, comments, or shares?",
        "Should there be groups or communities?"
      ],
      custom: [
        "What is the main purpose of your application?",
        "Who are the main users of this system?",
        "What are the most important features you need?",
        "What kind of data will be stored?"
      ]
    };
    return questions[appType as keyof typeof questions] || questions.custom;
  };

  const generateAPISpec = (appType: string, responses: string[]) => {
    // This would typically use AI/LLM to generate the spec
    // For now, we'll create templates based on app type
    const templates = {
      blog: {
        name: "Blog Platform API",
        description: "A complete blog platform with users, posts, and comments",
        models: [
          {
            name: "User",
            fields: [
              { name: "name", type: "text", required: true },
              { name: "email", type: "email", required: true },
              { name: "avatar", type: "url", required: false },
              { name: "bio", type: "text", required: false }
            ]
          },
          {
            name: "Post",
            fields: [
              { name: "title", type: "text", required: true },
              { name: "content", type: "text", required: true },
              { name: "publishedAt", type: "date", required: false },
              { name: "isPublished", type: "boolean", required: true },
              { name: "author", type: "relation", required: true, relationTarget: "User" }
            ]
          },
          {
            name: "Comment",
            fields: [
              { name: "content", type: "text", required: true },
              { name: "author", type: "relation", required: true, relationTarget: "User" },
              { name: "post", type: "relation", required: true, relationTarget: "Post" },
              { name: "createdAt", type: "date", required: true }
            ]
          }
        ]
      },
      ecommerce: {
        name: "E-commerce Store API",
        description: "Online store with products, customers, and orders",
        models: [
          {
            name: "Product",
            fields: [
              { name: "name", type: "text", required: true },
              { name: "description", type: "text", required: false },
              { name: "price", type: "number", required: true },
              { name: "inStock", type: "boolean", required: true },
              { name: "category", type: "text", required: false }
            ]
          },
          {
            name: "Customer",
            fields: [
              { name: "name", type: "text", required: true },
              { name: "email", type: "email", required: true },
              { name: "address", type: "text", required: false },
              { name: "phone", type: "text", required: false }
            ]
          },
          {
            name: "Order",
            fields: [
              { name: "total", type: "number", required: true },
              { name: "status", type: "text", required: true },
              { name: "customer", type: "relation", required: true, relationTarget: "Customer" },
              { name: "orderDate", type: "date", required: true }
            ]
          }
        ]
      }
    };

    return templates[appType as keyof typeof templates] || templates.blog;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    addMessage('user', userMessage);
    setCurrentInput('');

    if (useAI) {
      // Use secure LLM for AI-powered conversation
      await handleAIResponse(userMessage);
    } else {
      // Use original predefined conversation flow
      await handlePredefinedFlow(userMessage);
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const contextPrompt = `
User is building an API and said: "${userMessage}"

Previous conversation context:
${messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n')}

Current conversation state: ${conversationState}

Please respond as a helpful API creation assistant. Your response should:
1. Be conversational and helpful
2. Ask clarifying questions about their API needs
3. Focus on data models, endpoints, and API structure
4. Suggest specific API features or patterns
5. Keep responses concise (under 200 words)

If they've provided enough information, offer to generate their API specification.
`;

      const response = await secureLLMCall(
        contextPrompt,
        'API_CREATION',
        llmConfig
      );

      if (response.success && response.content) {
        await simulateTyping(response.content, generateContextualSuggestions(userMessage));
        
        // Update conversation state based on AI response
        if (response.content.toLowerCase().includes('generate') || 
            response.content.toLowerCase().includes('create your api')) {
          setConversationState('confirming');
        } else if (conversationState === 'initial') {
          setConversationState('gathering');
        }
      } else if (response.violations) {
        // Show security violations
        await simulateTyping(
          "I can only help with API creation tasks. Please describe what kind of API you'd like to build, what data you need to store, or what endpoints you need.",
          [
            "I want to build a REST API",
            "Help me design data models",
            "What endpoints do I need?"
          ]
        );
      } else if (response.rateLimited) {
        await simulateTyping(
          "I'm currently rate limited. Let me continue with our conversation using my built-in knowledge.",
          []
        );
        await handlePredefinedFlow(userMessage);
      } else {
        throw new Error(response.error || 'AI response failed');
      }
    } catch (error) {
      console.error('AI response error:', error);
      toast.error('AI assistant is temporarily unavailable. Using standard flow.');
      await handlePredefinedFlow(userMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedFlow = async (userMessage: string) => {
    if (conversationState === 'initial') {
      const appType = analyzeUserInput(userMessage);
      const questions = getStandardizedQuestions(appType);
      
      setConversationState('gathering');
      await simulateTyping(
        `Great! I understand you want to build a ${appType === 'custom' ? 'custom application' : appType.replace('_', ' ')}. Let me ask you a few questions to create the perfect API for you.`,
        []
      );
      
      await simulateTyping(
        questions[0],
        [
          "Yes, that sounds good",
          "No, I don't need that",
          "I'm not sure, what do you recommend?"
        ]
      );
    } else if (conversationState === 'gathering') {
      // Continue gathering requirements
      await simulateTyping(
        "Thanks for that information! Let me ask you another question to better understand your needs.",
        []
      );
      
      await simulateTyping(
        "Based on what you've told me, I'm ready to create your API. Would you like me to generate the data models and endpoints now?",
        [
          "Yes, create my API",
          "I have more requirements",
          "Let me review what we discussed"
        ]
      );
      setConversationState('confirming');
    } else if (conversationState === 'confirming') {
      if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('create')) {
        const appType = analyzeUserInput(messages[1]?.content || '');
        const spec = generateAPISpec(appType, []);
        setApiSpec({ 
          ...spec, 
          endpoints: [], // Initialize endpoints as empty array
          complete: true 
        });
        setConversationState('complete');
        
        await simulateTyping(
          `Perfect! I've created your ${spec.name} with ${spec.models.length} data models. You can now create this project and switch to the "My Projects" tab to see and customize your API structure.`,
          [
            "Create this project",
            "Generate more features", 
            "Start over with a different idea"
          ]
        );
        
        toast.success("API generated successfully!");
      }
    }
  };

  const generateContextualSuggestions = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('blog') || lowerMessage.includes('content')) {
      return ["Add user authentication", "Include comment system", "Add categories"];
    } else if (lowerMessage.includes('ecommerce') || lowerMessage.includes('shop')) {
      return ["Add payment processing", "Include inventory management", "Add order tracking"];
    } else if (lowerMessage.includes('social') || lowerMessage.includes('media')) {
      return ["Add friend connections", "Include messaging", "Add post reactions"];
    } else {
      return [
        "Yes, create my API",
        "Add more features",
        "I need authentication",
        "What about security?"
      ];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Create this project") {
      handleCreateProject();
    } else {
      setCurrentInput(suggestion);
    }
  };

  const handleCreateProject = () => {
    if (apiSpec.complete && onProjectCreate) {
      onProjectCreate({
        name: apiSpec.name,
        description: apiSpec.description,
        models: apiSpec.models,
        endpoints: apiSpec.endpoints
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI APIYourself
          </h2>
          <p className="text-gray-600 text-sm">Describe your idea and I'll build the API for you</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* AI Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="ai-mode" className="text-sm">AI Mode</Label>
            <Switch
              id="ai-mode"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
          </div>

          {/* LLM Configuration */}
          {useAI && (
            <Dialog open={showLLMConfig} onOpenChange={setShowLLMConfig}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  AI Config
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">AI Provider</Label>
                    <Select 
                      value={llmConfig.provider} 
                      onValueChange={(value: 'ollama' | 'api' | 'openai') => 
                        setLlmConfig(prev => ({ ...prev, provider: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ollama">Ollama (Local)</SelectItem>
                        <SelectItem value="api">Custom API</SelectItem>
                        {process.env.VITE_OPENAI_ENABLED && (
                          <SelectItem value="openai">OpenAI</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {llmConfig.provider === 'ollama' && (
                    <>
                      <div>
                        <Label htmlFor="ollama-endpoint">Ollama Endpoint</Label>
                        <Input
                          id="ollama-endpoint"
                          value={llmConfig.ollamaEndpoint || ''}
                          onChange={(e) => setLlmConfig(prev => ({ 
                            ...prev, 
                            ollamaEndpoint: e.target.value 
                          }))}
                          placeholder="http://localhost:11434"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ollama-model">Model</Label>
                        <Select 
                          value={llmConfig.model} 
                          onValueChange={(value) => 
                            setLlmConfig(prev => ({ ...prev, model: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llama3.2">Llama 3.2</SelectItem>
                            <SelectItem value="llama3.1">Llama 3.1</SelectItem>
                            <SelectItem value="codellama">CodeLlama</SelectItem>
                            <SelectItem value="mistral">Mistral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {llmConfig.provider === 'api' && (
                    <div>
                      <Label htmlFor="api-endpoint">API Endpoint</Label>
                      <Input
                        id="api-endpoint"
                        value={llmConfig.apiEndpoint || ''}
                        onChange={(e) => setLlmConfig(prev => ({ 
                          ...prev, 
                          apiEndpoint: e.target.value 
                        }))}
                        placeholder="https://your-llm-api.com/v1/chat"
                      />
                    </div>
                  )}

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Security Note:</strong> All AI interactions are secured with built-in 
                    prompt injection protection and are limited to API creation tasks only.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {conversationState !== 'initial' && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {conversationState === 'gathering' && '🔍 Gathering Requirements'}
                {conversationState === 'confirming' && '✅ Ready to Generate'}
                {conversationState === 'complete' && '🎉 API Generated'}
              </Badge>
            )}
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white ml-2' 
                      : 'bg-purple-100 text-purple-600 mr-2'
                  }`}
                >
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1]?.suggestions && (
            <div className="flex justify-start">
              <div className="max-w-[80%] ml-10">
                <p className="text-xs text-gray-500 mb-2">Quick responses:</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8"
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
              <div className="flex items-center ml-10">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Security Monitoring */}
        {lastResponse?.violations && lastResponse.violations.length > 0 && (
          <div className="px-4 pb-4">
            <SecurityMonitor violations={lastResponse.violations} />
          </div>
        )}

        {lastResponse?.rateLimited && (
          <div className="px-4 pb-4">
            <RateLimitWarning resetTime={Date.now() + 3600000} />
          </div>
        )}
      </ScrollArea>

      {/* Generated API Preview */}
      {apiSpec.complete && (
        <div className="p-4 border-t bg-green-50">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Generated API: {apiSpec.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{apiSpec.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Badge variant="outline" className="mr-1">{apiSpec.models.length}</Badge>
                  Data Models
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Button 
                  size="sm" 
                  onClick={handleCreateProject}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2 max-w-3xl mx-auto">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={useAI ? "Describe your API idea (AI-powered)" : "Describe your API idea or answer the question..."}
            className="flex-1"
            disabled={isTyping || isLLMLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentInput.trim() || isTyping || isLLMLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLLMLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {conversationState === 'initial' && (
          <div className="mt-3 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Lightbulb className="w-3 h-3" />
                <span>Try: "I want to build a blog platform" or "Create an e-commerce store"</span>
              </div>
              {useAI && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <Bot className="w-3 h-3" />
                  <span>AI Enhanced</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
