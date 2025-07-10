import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Copy, ExternalLink, Zap, Workflow } from "lucide-react";
import { toast } from "sonner";

interface N8nSetupProps {
  onClose?: () => void;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  useCase: string;
  workflow: {
    nodes: Array<{ type: string; name: string }>;
  };
}

export function N8nSetup({ onClose }: N8nSetupProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [n8nApiUrl, setN8nApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testData, setTestData] = useState('{\n  "message": "Hello from APIYourself!",\n  "timestamp": "' + new Date().toISOString() + '"\n}');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    fetchTemplatesAndSchema();
  }, []);

  const fetchTemplatesAndSchema = async () => {
    try {
      const [templatesRes, schemaRes] = await Promise.all([
        fetch('http://localhost:3002/api/n8n/templates'),
        fetch('http://localhost:3002/api/n8n/schema')
      ]);

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }

      if (schemaRes.ok) {
        const schemaData = await schemaRes.json();
        setSchema(schemaData.schema);
      }
    } catch (error) {
      console.error('Failed to fetch n8n templates/schema:', error);
    }
  };

  const handleTestWorkflow = async () => {
    if (!webhookUrl || !testData) {
      toast.error("Please provide both webhook URL and test data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/n8n/trigger-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl,
          data: JSON.parse(testData)
        })
      });

      const result = await response.json();
      setTestResult(result);

      if (result.success) {
        toast.success("Workflow triggered successfully!");
      } else {
        toast.error("Failed to trigger workflow");
      }
    } catch (error: any) {
      toast.error(`Test failed: ${error.message}`);
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const setupInstructions = [
    "1. Create an n8n account at cloud.n8n.io or set up a self-hosted instance",
    "2. Create a new workflow in n8n",
    "3. Add a 'Webhook' node as the trigger",
    "4. Copy the webhook URL from the Webhook node",
    "5. Paste the webhook URL below and test the connection",
    "6. Build your workflow to process the incoming data",
    "7. Save and activate your workflow in n8n"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="w-6 h-6" />
            n8n Integration Setup
          </h2>
          <p className="text-gray-600">Connect your APIs to powerful n8n workflows</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Quick Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {setupInstructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {instruction}
                  </li>
                ))}
              </ol>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> n8n cloud offers a free tier with 5,000 workflow executions per month.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">n8n Webhook URL *</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Copy this from your n8n webhook node
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="n8nApiUrl">n8n API URL (Optional)</Label>
                <Input
                  id="n8nApiUrl"
                  placeholder="https://your-n8n-instance.com"
                  value={n8nApiUrl}
                  onChange={(e) => setN8nApiUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  For checking workflow execution status
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your n8n API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Required for status checking and advanced features
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testData">Test Data (JSON)</Label>
                <Textarea
                  id="testData"
                  rows={8}
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleTestWorkflow} 
                disabled={isLoading || !webhookUrl}
                className="w-full"
              >
                {isLoading ? "Testing..." : "Test Workflow"}
                <Zap className="w-4 h-4 ml-2" />
              </Button>

              {testResult && (
                <Card className={testResult.success ? "border-green-200" : "border-red-200"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {testResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      Test Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Templates</h3>
            <div className="grid gap-4">
              {templates.map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="mb-3">
                      <Badge variant="outline">{template.useCase}</Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Workflow Nodes:</Label>
                      <div className="flex flex-wrap gap-1">
                        {template.workflow.nodes.map((node, nodeIndex) => (
                          <Badge key={nodeIndex} variant="secondary" className="text-xs">
                            {node.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              {schema && schema.endpoints && (
                <div className="space-y-4">
                  {schema.endpoints.map((endpoint: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`http://localhost:3002/api/n8n${endpoint.path}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      {endpoint.parameters && (
                        <div>
                          <Label className="text-xs font-semibold">Parameters:</Label>
                          <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            {Object.entries(endpoint.parameters).map(([param, desc]) => (
                              <li key={param}>
                                <code>{param}</code>: {desc as string}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Useful Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://docs.n8n.io/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    n8n Documentation
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://cloud.n8n.io/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    n8n Cloud (Free Tier)
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Webhook Node Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
