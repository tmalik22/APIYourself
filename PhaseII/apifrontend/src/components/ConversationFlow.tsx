import React, { useState } from 'react';
import { Send, Sparkles, MessageCircle, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface ParsedAPI {
  name: string;
  description: string;
  models: Array<{
    name: string;
    description: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    fieldName: string;
    type: string;
  }>;
}

interface ConversationFlowProps {
  onGenerateAPI: (apiSpec: ParsedAPI) => void;
  onBackToDashboard?: () => void;
}

export function ConversationFlow({ onGenerateAPI, onBackToDashboard }: ConversationFlowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI API assistant. I'll help you create a complete API just by describing what you want to build. What kind of application or system are you creating?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [extractedInfo, setExtractedInfo] = useState({
    appType: '',
    entities: [] as string[],
    features: [] as string[],
    userTypes: [] as string[],
    dataNeeds: [] as string[]
  });

  const conversationQuestions = [
    {
      trigger: ['app', 'application', 'system', 'platform', 'website'],
      follow_up: "Great! What are the main things (entities) your users will interact with? For example: users, posts, products, orders, etc."
    },
    {
      trigger: ['users', 'people', 'customers', 'members'],
      follow_up: "Perfect! What actions should users be able to perform? For example: create, view, edit, delete, search, etc."
    },
    {
      trigger: ['create', 'add', 'post', 'upload', 'submit'],
      follow_up: "Excellent! What information needs to be stored for each of these items? What fields or properties should they have?"
    },
    {
      trigger: ['field', 'property', 'information', 'data', 'store'],
      follow_up: "Almost there! Do any of these items connect to each other? For example: 'users have posts' or 'orders belong to customers'?"
    }
  ];

  const generateStandardizedQuestions = (userInput: string) => {
    const questions = [];
    
    if (!extractedInfo.appType) {
      questions.push("What type of application are you building? (e.g., blog, e-commerce, social media, task manager)");
    }
    
    if (!extractedInfo.entities.length) {
      questions.push("What are the main things your app will manage? (e.g., users, posts, products, orders)");
    }
    
    if (!extractedInfo.features.length) {
      questions.push("What should users be able to do? (e.g., create posts, place orders, leave comments)");
    }
    
    if (!extractedInfo.userTypes.length) {
      questions.push("Who will use your app? (e.g., regular users, admins, customers, authors)");
    }
    
    return questions;
  };

  const parseUserInput = (input: string) => {
    const newInfo = { ...extractedInfo };
    
    // Extract app type
    const appTypes = ['blog', 'ecommerce', 'e-commerce', 'social', 'task', 'project', 'cms', 'forum'];
    appTypes.forEach(type => {
      if (input.toLowerCase().includes(type)) {
        newInfo.appType = type;
      }
    });
    
    // Extract entities
    const commonEntities = ['user', 'post', 'product', 'order', 'comment', 'category', 'tag', 'image', 'file', 'message', 'task', 'project'];
    commonEntities.forEach(entity => {
      if (input.toLowerCase().includes(entity) && !newInfo.entities.includes(entity)) {
        newInfo.entities.push(entity);
      }
    });
    
    // Extract features
    const features = ['create', 'edit', 'delete', 'view', 'search', 'filter', 'upload', 'download', 'share', 'like', 'comment'];
    features.forEach(feature => {
      if (input.toLowerCase().includes(feature) && !newInfo.features.includes(feature)) {
        newInfo.features.push(feature);
      }
    });
    
    setExtractedInfo(newInfo);
  };

  const generateAIResponse = (userInput: string) => {
    parseUserInput(userInput);
    
    const responses = [
      "I understand you want to build a {appType} application. Let me ask a few more questions to get the details right.",
      "That's a great idea! I can see you'll need {entities} in your system. What specific information should we store for each?",
      "Perfect! I'm getting a clear picture. Do any of these items relate to each other? For example, do users create posts, or do orders belong to customers?",
      "Excellent! I think I have enough information to generate your API. Let me create the data models and endpoints for you.",
      "All set! I'll now generate a complete API with all the models, fields, and relationships you described."
    ];
    
    const questions = generateStandardizedQuestions(userInput);
    if (questions.length > 0) {
      return questions[0];
    }
    
    return responses[Math.min(conversationStep, responses.length - 1)]
      .replace('{appType}', extractedInfo.appType)
      .replace('{entities}', extractedInfo.entities.join(', '));
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setConversationStep(prev => prev + 1);
      
      // Check if we have enough info to generate API
      if (extractedInfo.entities.length >= 2 && extractedInfo.features.length >= 1) {
        setTimeout(() => {
          const completeMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'system',
            content: "I have enough information! Would you like me to generate your API now?",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, completeMessage]);
        }, 1000);
      }
    }, 1500);
    
    setCurrentInput('');
  };

  const generateAPI = () => {
    // Generate API spec based on extracted information
    const apiSpec: ParsedAPI = {
      name: `${extractedInfo.appType || 'Custom'} API`,
      description: `Generated API for ${extractedInfo.appType || 'custom'} application`,
      models: extractedInfo.entities.map(entity => ({
        name: entity.charAt(0).toUpperCase() + entity.slice(1),
        description: `Represents a ${entity} in the system`,
        fields: [
          { name: 'id', type: 'number', required: true, description: 'Unique identifier' },
          { name: 'name', type: 'text', required: true, description: `${entity} name` },
          { name: 'createdAt', type: 'date', required: true, description: 'Creation timestamp' },
          ...(entity === 'user' ? [
            { name: 'email', type: 'email', required: true, description: 'User email address' },
            { name: 'isActive', type: 'boolean', required: true, description: 'Account status' }
          ] : []),
          ...(entity === 'post' ? [
            { name: 'title', type: 'text', required: true, description: 'Post title' },
            { name: 'content', type: 'text', required: true, description: 'Post content' },
            { name: 'published', type: 'boolean', required: true, description: 'Publication status' }
          ] : []),
          ...(entity === 'product' ? [
            { name: 'price', type: 'number', required: true, description: 'Product price' },
            { name: 'description', type: 'text', required: false, description: 'Product description' },
            { name: 'inStock', type: 'boolean', required: true, description: 'Availability status' }
          ] : [])
        ]
      })),
      relationships: []
    };

    // Add common relationships
    if (extractedInfo.entities.includes('user') && extractedInfo.entities.includes('post')) {
      apiSpec.relationships.push({
        from: 'Post',
        to: 'User',
        fieldName: 'author',
        type: 'belongs_to'
      });
    }
    
    if (extractedInfo.entities.includes('user') && extractedInfo.entities.includes('order')) {
      apiSpec.relationships.push({
        from: 'Order',
        to: 'User',
        fieldName: 'customer',
        type: 'belongs_to'
      });
    }

    onGenerateAPI(apiSpec);
    toast.success("API generated successfully!");
  };

  const progress = Math.min((conversationStep / 4) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI APIYourself
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe your idea in natural language, and I'll create a complete API with data models, relationships, and endpoints for you.
        </p>
        
        {/* Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">Progress: {Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Conversation</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'ai'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="flex space-x-2">
            <Textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Describe your API idea..."
              className="flex-1 min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentInput.trim() || isLoading}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Information Preview */}
      {(extractedInfo.entities.length > 0 || extractedInfo.features.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What I Understand So Far</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {extractedInfo.appType && (
              <div>
                <span className="text-sm font-medium text-gray-700">App Type: </span>
                <Badge variant="outline">{extractedInfo.appType}</Badge>
              </div>
            )}
            
            {extractedInfo.entities.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Entities: </span>
                {extractedInfo.entities.map(entity => (
                  <Badge key={entity} variant="outline" className="mr-1">
                    {entity}
                  </Badge>
                ))}
              </div>
            )}
            
            {extractedInfo.features.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Features: </span>
                {extractedInfo.features.map(feature => (
                  <Badge key={feature} variant="outline" className="mr-1">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
            
            {extractedInfo.entities.length >= 2 && (
              <div className="pt-3 border-t">
                <Button onClick={generateAPI} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My API Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need inspiration? Try these examples:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "I want to build a blog where users can create posts and other users can comment on them",
              "I need an e-commerce API for products, customers, orders, and shopping carts",
              "Create a task management system where teams can create projects and assign tasks to members",
              "I want a social media platform where users can post images, follow each other, and like posts"
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 text-sm"
                onClick={() => setCurrentInput(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      {onBackToDashboard && (
        <div className="text-center">
          <Button variant="outline" onClick={onBackToDashboard}>
            ← Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
