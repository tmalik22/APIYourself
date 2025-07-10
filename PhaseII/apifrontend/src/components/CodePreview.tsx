
import { useState, useEffect } from "react";
import { Copy, Download, RefreshCw, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const serverCode = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Auto-generated CRUD routes for User model
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, name, avatar) VALUES ($1, $2, $3) RETURNING *',
      [email, name, avatar]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-generated CRUD routes for Post model
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(\`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id
    \`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, published, author_id } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (title, content, published, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, published, author_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Authentication logic here
    res.json({ token: 'jwt-token-here', user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

const packageJsonCode = `{
  "name": "my-api-project",
  "version": "1.0.0",
  "description": "Auto-generated API built with API Builder",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "pg": "^8.11.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  },
  "keywords": ["api", "express", "nodejs", "crud"],
  "author": "API Builder",
  "license": "MIT"
}`;

const readmeCode = `# My API Project

Auto-generated API built with API Builder.

## Features

- ✅ CRUD operations for User model
- ✅ CRUD operations for Post model
- ✅ JWT Authentication
- ✅ Rate limiting
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ PostgreSQL database integration

## Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   \`\`\`

4. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Users
- \`GET /api/users\` - Get all users
- \`POST /api/users\` - Create a new user
- \`GET /api/users/:id\` - Get user by ID
- \`PUT /api/users/:id\` - Update user
- \`DELETE /api/users/:id\` - Delete user

### Posts
- \`GET /api/posts\` - Get all posts
- \`POST /api/posts\` - Create a new post
- \`GET /api/posts/:id\` - Get post by ID
- \`PUT /api/posts/:id\` - Update post
- \`DELETE /api/posts/:id\` - Delete post

### Authentication
- \`POST /api/auth/login\` - User login

## Database Schema

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Built with API Builder
This project was generated using API Builder - a no-code platform for creating REST APIs.
`;

interface CodePreviewProps {
  project: any;
}

export function CodePreview({ project }: CodePreviewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [aiExplanation, setAiExplanation] = useState('');
  const [showAiGeneration, setShowAiGeneration] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data.filter((m: any) => m.status === 'available'));
        if (data.length > 0) {
          setSelectedModel(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const generateWithAI = async () => {
    if (!selectedModel) {
      toast({
        title: "No Model Selected",
        description: "Please select an AI model first",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const prompt = customPrompt || `Generate a complete, production-ready API implementation for the project "${project?.name || 'API Project'}"`;
      
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          context: project ? {
            project,
            dataModel: project.dataModel,
            endpoints: project.endpoints
          } : undefined,
          options: {
            language: 'javascript',
            framework: 'express',
            style: 'production',
            includeTests: true,
            includeDocumentation: true
          },
          modelId: selectedModel
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedCode(result.code || {});
        setAiExplanation(result.explanation || '');
        toast({
          title: "Code Generated Successfully",
          description: `Generated using ${result.modelUsed}. ${result.tokensUsed ? `Tokens used: ${result.tokensUsed}` : ''}`,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to AI service",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
    toast({
      title: "Code regenerated",
      description: "Your code has been updated with the latest changes",
    });
  };

  const handleDownload = () => {
    const zip = `data:application/zip;base64,UEsDBAoAAAAAAKxWeFMAAAAAAAAAAAAAAAAJAAAAbXktYXBpLWFwcC8=`;
    const link = document.createElement('a');
    link.href = zip;
    link.download = 'my-api-project.zip';
    link.click();
    
    toast({
      title: "Download started",
      description: "Your project files are being downloaded",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generated Code
          </h1>
          <p className="text-gray-600 mt-2">View and download your auto-generated API code</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Download Project
          </Button>
        </div>
      </div>

      {/* AI Code Generation Section */}
      <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-purple-800">AI Code Generation</CardTitle>
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                Powered by AI
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiGeneration(!showAiGeneration)}
            >
              {showAiGeneration ? 'Hide' : 'Show'} AI Generator
            </Button>
          </div>
        </CardHeader>
        {showAiGeneration && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model-select">Select AI Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Choose an AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center space-x-2">
                          <span>{model.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {model.provider}
                          </Badge>
                          {model.capabilities.costPerToken === 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Free
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language-select">Target Language</Label>
                <Select defaultValue="javascript">
                  <SelectTrigger id="language-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript (Node.js)</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="custom-prompt">Custom Prompt (Optional)</Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe what you want to generate... (leave empty for default prompt)"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={generateWithAI} 
                disabled={generating || !selectedModel}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
              {models.length === 0 && (
                <p className="text-sm text-gray-500">
                  No AI models available. Configure models in the AI Models section.
                </p>
              )}
            </div>
            
            {aiExplanation && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">AI Explanation:</h4>
                <p className="text-sm text-gray-700">{aiExplanation}</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Code Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(generatedCode).length > 0 ? "ai-generated" : "server"} className="w-full">
            <TabsList className={`grid w-full ${Object.keys(generatedCode).length > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {Object.keys(generatedCode).length > 0 && (
                <TabsTrigger value="ai-generated" className="text-purple-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generated
                </TabsTrigger>
              )}
              <TabsTrigger value="server">server.js</TabsTrigger>
              <TabsTrigger value="package">package.json</TabsTrigger>
              <TabsTrigger value="readme">README.md</TabsTrigger>
            </TabsList>

            {/* AI Generated Code Tab */}
            {Object.keys(generatedCode).length > 0 && (
              <TabsContent value="ai-generated" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-purple-800">AI Generated Files</h3>
                    <Badge variant="outline" className="text-purple-600">
                      {Object.keys(generatedCode).length} files
                    </Badge>
                  </div>
                  
                  {Object.entries(generatedCode).map(([filename, code]) => (
                    <div key={filename} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">{filename}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(code)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="server" className="mt-4">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleCopy(serverCode)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{serverCode}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="package" className="mt-4">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleCopy(packageJsonCode)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{packageJsonCode}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="readme" className="mt-4">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleCopy(readmeCode)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{readmeCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">247</p>
              <p className="text-sm text-gray-600">Lines of Code</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-600">API Endpoints</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-gray-600">Active Plugins</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
