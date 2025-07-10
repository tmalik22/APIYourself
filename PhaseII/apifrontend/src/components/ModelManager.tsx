import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Loader2, Plus, Trash2, TestTube, Eye, EyeOff } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  modelName: string;
  endpoint?: string;
  apiKey?: string;
  maxTokens?: number;
  temperature?: number;
  capabilities: {
    languages: string[];
    frameworks: string[];
    maxContextLength: number;
    supportsStreaming: boolean;
    supportsFunctionCalling: boolean;
    costPerToken?: number;
  };
  config: Record<string, any>;
  plugin: string;
  status: 'available' | 'error' | 'loading';
  lastTested?: string;
  averageLatency?: number;
}

interface ModelStats {
  totalModels: number;
  modelsByProvider: Record<string, number>;
  modelsByStatus: Record<string, number>;
}

export function ModelManager() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [newModel, setNewModel] = useState({
    id: '',
    name: '',
    provider: 'openai',
    modelName: '',
    endpoint: '',
    apiKey: '',
    maxTokens: 4000,
    temperature: 0.1,
    languages: ['javascript', 'typescript', 'python'],
    frameworks: ['express', 'fastapi'],
    maxContextLength: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true,
    costPerToken: 0.00003
  });

  useEffect(() => {
    loadModels();
    loadStats();
  }, []);

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load models",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/models/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const testModel = async (modelId: string) => {
    setTestingModel(modelId);
    try {
      const response = await fetch(`/api/models/${modelId}/test`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Test Successful",
          description: `Model ${modelId} is working correctly. Latency: ${result.latency}ms`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: result.message,
          variant: "destructive"
        });
      }
      
      // Reload models to update status
      loadModels();
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to test model",
        variant: "destructive"
      });
    } finally {
      setTestingModel(null);
    }
  };

  const addModel = async () => {
    try {
      const model = {
        id: newModel.id,
        name: newModel.name,
        provider: newModel.provider,
        modelName: newModel.modelName,
        endpoint: newModel.endpoint || undefined,
        apiKey: newModel.apiKey || undefined,
        maxTokens: newModel.maxTokens,
        temperature: newModel.temperature,
        capabilities: {
          languages: newModel.languages,
          frameworks: newModel.frameworks,
          maxContextLength: newModel.maxContextLength,
          supportsStreaming: newModel.supportsStreaming,
          supportsFunctionCalling: newModel.supportsFunctionCalling,
          costPerToken: newModel.costPerToken
        },
        config: {}
      };

      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Model added successfully"
        });
        setShowAddModel(false);
        setNewModel({
          id: '',
          name: '',
          provider: 'openai',
          modelName: '',
          endpoint: '',
          apiKey: '',
          maxTokens: 4000,
          temperature: 0.1,
          languages: ['javascript', 'typescript', 'python'],
          frameworks: ['express', 'fastapi'],
          maxContextLength: 8192,
          supportsStreaming: true,
          supportsFunctionCalling: true,
          costPerToken: 0.00003
        });
        loadModels();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to add model",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add model",
        variant: "destructive"
      });
    }
  };

  const removeModel = async (modelId: string) => {
    try {
      const response = await fetch(`/api/models/${modelId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Model removed successfully"
        });
        loadModels();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to remove model",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove model",
        variant: "destructive"
      });
    }
  };

  const toggleApiKeyVisibility = (modelId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-blue-100 text-blue-800';
      case 'ollama': return 'bg-purple-100 text-purple-800';
      case 'anthropic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading models...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Model Management</h2>
          <p className="text-gray-600">Manage AI models for code generation</p>
        </div>
        <Button onClick={() => setShowAddModel(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalModels}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(stats.modelsByProvider).map(([provider, count]) => (
                  <div key={provider} className="flex justify-between text-sm">
                    <span className="capitalize">{provider}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(stats.modelsByStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Models List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="ollama">Ollama</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {models.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  No models configured. Add a model to get started.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {model.name}
                          <Badge className={getProviderColor(model.provider)}>
                            {model.provider}
                          </Badge>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Model: {model.modelName}
                          {model.endpoint && ` • Endpoint: ${model.endpoint}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testModel(model.id)}
                          disabled={testingModel === model.id}
                        >
                          {testingModel === model.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeModel(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Capabilities:</strong>
                        <div className="mt-1">
                          <div>Languages: {model.capabilities.languages.join(', ')}</div>
                          <div>Frameworks: {model.capabilities.frameworks.join(', ')}</div>
                          <div>Max Context: {model.capabilities.maxContextLength.toLocaleString()} tokens</div>
                        </div>
                      </div>
                      <div>
                        <strong>Configuration:</strong>
                        <div className="mt-1">
                          <div>Max Tokens: {model.maxTokens}</div>
                          <div>Temperature: {model.temperature}</div>
                          {model.capabilities.costPerToken && (
                            <div>Cost: ${model.capabilities.costPerToken.toFixed(6)}/token</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {model.apiKey && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">API Key:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility(model.id)}
                          >
                            {showApiKey[model.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="mt-1 font-mono text-sm">
                          {showApiKey[model.id] ? model.apiKey : '••••••••••••••••'}
                        </div>
                      </div>
                    )}
                    
                    {model.lastTested && (
                      <div className="mt-4 text-xs text-gray-500">
                        Last tested: {new Date(model.lastTested).toLocaleString()}
                        {model.averageLatency && ` • Latency: ${model.averageLatency}ms`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Provider-specific tabs */}
        {['openai', 'ollama', 'custom'].map((provider) => (
          <TabsContent key={provider} value={provider} className="space-y-4">
            <div className="grid gap-4">
              {models.filter(m => m.provider === provider).map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {model.name}
                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{model.modelName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {model.capabilities.languages.join(', ')}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testModel(model.id)}
                          disabled={testingModel === model.id}
                        >
                          {testingModel === model.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeModel(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Model Dialog */}
      {showAddModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Model</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model-id">Model ID</Label>
                  <Input
                    id="model-id"
                    value={newModel.id}
                    onChange={(e) => setNewModel(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="my-custom-model"
                  />
                </div>
                <div>
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input
                    id="model-name"
                    value={newModel.name}
                    onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Custom Model"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={newModel.provider} onValueChange={(value) => setNewModel(prev => ({ ...prev, provider: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="ollama">Ollama</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model-name-field">Model Name/ID</Label>
                  <Input
                    id="model-name-field"
                    value={newModel.modelName}
                    onChange={(e) => setNewModel(prev => ({ ...prev, modelName: e.target.value }))}
                    placeholder="gpt-4, codellama, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endpoint">Endpoint (Optional)</Label>
                  <Input
                    id="endpoint"
                    value={newModel.endpoint}
                    onChange={(e) => setNewModel(prev => ({ ...prev, endpoint: e.target.value }))}
                    placeholder="http://localhost:11434"
                  />
                </div>
                <div>
                  <Label htmlFor="api-key">API Key (Optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={newModel.apiKey}
                    onChange={(e) => setNewModel(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Your API key"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={newModel.maxTokens}
                    onChange={(e) => setNewModel(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={newModel.temperature}
                    onChange={(e) => setNewModel(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="languages">Supported Languages (comma-separated)</Label>
                <Input
                  id="languages"
                  value={newModel.languages.join(', ')}
                  onChange={(e) => setNewModel(prev => ({ ...prev, languages: e.target.value.split(',').map(s => s.trim()) }))}
                  placeholder="javascript, typescript, python"
                />
              </div>

              <div>
                <Label htmlFor="frameworks">Supported Frameworks (comma-separated)</Label>
                <Input
                  id="frameworks"
                  value={newModel.frameworks.join(', ')}
                  onChange={(e) => setNewModel(prev => ({ ...prev, frameworks: e.target.value.split(',').map(s => s.trim()) }))}
                  placeholder="express, fastapi, spring"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={addModel}>Add Model</Button>
              <Button variant="outline" onClick={() => setShowAddModel(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
