import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Bot, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LLMSetupProps {
  onSetupComplete: (config: LLMConfig) => void;
}

interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'deepseek';
  apiKey: string;
  model: string;
}

export function LLMSetup({ onSetupComplete }: LLMSetupProps) {
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'deepseek'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [testing, setTesting] = useState(false);

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o-mini',
      keyPrefix: 'sk-',
      signupUrl: 'https://platform.openai.com/api-keys',
      description: 'Most popular AI provider with GPT models'
    },
    anthropic: {
      name: 'Anthropic',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      defaultModel: 'claude-3-5-sonnet-20241022',
      keyPrefix: 'sk-ant-',
      signupUrl: 'https://console.anthropic.com/settings/keys',
      description: 'Claude models known for safety and helpfulness'
    },
    gemini: {
      name: 'Google Gemini',
      models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
      defaultModel: 'gemini-1.5-flash',
      keyPrefix: 'AI',
      signupUrl: 'https://aistudio.google.com/app/apikey',
      description: 'Google\'s multimodal AI with competitive pricing'
    },
    deepseek: {
      name: 'DeepSeek',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      defaultModel: 'deepseek-chat',
      keyPrefix: 'sk-',
      signupUrl: 'https://platform.deepseek.com/api_keys',
      description: 'High-performance AI with excellent coding capabilities'
    }
  };

  const handleProviderChange = (newProvider: 'openai' | 'anthropic' | 'gemini' | 'deepseek') => {
    setProvider(newProvider);
    setModel(providerInfo[newProvider].defaultModel);
    setApiKey('');
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setTesting(true);
    try {
      // Simple validation first
      if (!apiKey.startsWith(providerInfo[provider].keyPrefix)) {
        throw new Error(`Invalid API key format for ${providerInfo[provider].name}`);
      }

      // Make actual API call to test the connection
      let testResponse;
      
      if (provider === 'openai') {
        testResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
      } else if (provider === 'anthropic') {
        testResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 1,
            messages: [{ role: 'user', content: 'test' }]
          }),
        });
      } else if (provider === 'gemini') {
        testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }]
          }),
        });
      } else if (provider === 'deepseek') {
        testResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1
          }),
        });
      }

      if (!testResponse?.ok) {
        const errorData = await testResponse?.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API returned ${testResponse?.status}: ${testResponse?.statusText}`);
      }
      
      toast.success('API key is valid! 🎉');
      
      // Save to localStorage for persistence
      const config: LLMConfig = { provider, apiKey, model };
      localStorage.setItem('llm-config', JSON.stringify(config));
      
      onSetupComplete(config);
    } catch (error: any) {
      console.error('API test failed:', error);
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Set Up Your AI Assistant</CardTitle>
          <p className="text-gray-600">
            To use our AI Builder, you'll need to connect your own AI API key. 
            This keeps your data private and gives you full control.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">Choose Your AI Provider</Label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(providerInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span className="font-medium">{info.name}</span>
                        <span className="text-sm text-gray-500 ml-2">- {info.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {providerInfo[provider].models.map((modelName) => (
                    <SelectItem key={modelName} value={modelName}>
                      {modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(providerInfo[provider].signupUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get API Key
                </Button>
              </div>
              <Input
                id="apiKey"
                type="password"
                placeholder={`Enter your ${providerInfo[provider].name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your API key starts with "{providerInfo[provider].keyPrefix}" and stays on your device.
              </p>
            </div>
          </div>

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy First:</strong> Your API key is stored locally in your browser and never sent to our servers. 
              All AI requests go directly from your browser to {providerInfo[provider].name}.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={testConnection} 
            disabled={!apiKey.trim() || testing}
            className="w-full"
            size="lg"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing Connection...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Test & Continue
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why do I need this?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>🔒 <strong>Privacy:</strong> Your conversations stay between you and your chosen AI provider</p>
          <p>💰 <strong>Cost Control:</strong> You only pay for what you use, directly to the AI provider</p>
          <p>🚀 <strong>Latest Models:</strong> Always get access to the newest AI models</p>
          <p>⚡ <strong>Performance:</strong> Direct connection means faster responses</p>
        </CardContent>
      </Card>
    </div>
  );
}
