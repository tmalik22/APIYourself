import { useState, useEffect } from "react";
import { Search, ExternalLink, CheckCircle, PlusCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePluginSystem } from "@/hooks/usePluginSystem";
import { CustomDatasetUploader } from "./CustomDatasetUploader";
import { N8nSetup } from "./N8nSetup";

// New data structure for external plugins
interface ExternalPlugin {
  id: string;
  name: string;
  description: string;
  category: 'Business & Sales' | 'Security & Monitoring' | 'Productivity & Data Management' | 'Research & Data';
  logo: string; // URL or path to logo
  docsUrl: string;
  tags: string[];
}

// Curated list of external plugins (FREE SERVICES ONLY)
const externalPlugins: ExternalPlugin[] = [
  // Custom Data Sources
  {
    id: "custom-dataset",
    name: "Custom Dataset",
    description: "Upload your own JSON data or connect to Excel/CSV files to create APIs instantly. Perfect for prototyping with your own data.",
    category: "Productivity & Data Management",
    logo: "https://cdn.jsdelivr.net/npm/lucide@latest/icons/database.svg",
    docsUrl: "#",
    tags: ["json", "csv", "custom", "upload"]
  },
  // Workflow Automation
  {
    id: "n8n",
    name: "n8n Workflow Automation",
    description: "Connect your APIs to powerful n8n workflows for automation, data processing, and integration with 400+ services. Free and open-source.",
    category: "Productivity & Data Management",
    logo: "https://docs.n8n.io/assets/images/n8n-logo-icon.svg",
    docsUrl: "https://docs.n8n.io/",
    tags: ["automation", "workflow", "integration", "webhook"]
  },
  // Productivity & Data Management
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Read, write, and format data in Google Sheets. Perfect for data-driven APIs.",
    category: "Productivity & Data Management",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
    docsUrl: "https://developers.google.com/sheets/api",
    tags: ["spreadsheet", "data", "google"]
  },
  {
    id: "microsoft-excel",
    name: "Microsoft Excel",
    description: "Automate tasks and integrate with Excel data using the Microsoft Graph API.",
    category: "Productivity & Data Management",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png",
    docsUrl: "https://learn.microsoft.com/en-us/graph/excel-concept-overview",
    tags: ["spreadsheet", "data", "microsoft"]
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Connect to your Airtable bases to manage records and build powerful workflows. (Free tier: 1,200 records)",
    category: "Productivity & Data Management",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/airtable.svg",
    docsUrl: "https://airtable.com/developers/web/api/introduction",
    tags: ["database", "collaboration", "data"]
  },
  {
    id: "notion",
    name: "Notion",
    description: "Create, read, and update pages, databases, and comments in your Notion workspace.",
    category: "Productivity & Data Management",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    docsUrl: "https://developers.notion.com/",
    tags: ["productivity", "docs", "database"]
  },
  {
    id: "jira",
    name: "Jira",
    description: "Manage issues, projects, and workflows in Jira Software Cloud. (Free for up to 10 users)",
    category: "Productivity & Data Management",
    logo: "https://cdn.worldvectorlogo.com/logos/jira-1.svg",
    docsUrl: "https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/",
    tags: ["project management", "agile", "atlassian"]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages, manage channels, and build interactive workflows in Slack.",
    category: "Productivity & Data Management",
    logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
    docsUrl: "https://api.slack.com/",
    tags: ["communication", "messaging", "automation"]
  },
  // Finance & Data
  {
    id: "alpha-vantage",
    name: "Alpha Vantage",
    description: "Access real-time and historical data on stocks, forex, and cryptocurrencies. (Free: 500 calls/day)",
    category: "Research & Data",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/alphavantage.svg",
    docsUrl: "https://www.alphavantage.co/documentation/",
    tags: ["stocks", "crypto", "finance"]
  },
  // Business & Sales  
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Manage contacts, deals, and marketing campaigns with the HubSpot API. (Free CRM tier)",
    category: "Business & Sales",
    logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg",
    docsUrl: "https://developers.hubspot.com/",
    tags: ["crm", "marketing", "sales"]
  },
  // Security & Monitoring
  {
    id: "sentry",
    name: "Sentry",
    description: "Track errors and performance issues in your APIs. (Free: 5,000 errors/month)",
    category: "Security & Monitoring",
    logo: "https://cdn.worldvectorlogo.com/logos/sentry.svg",
    docsUrl: "https://docs.sentry.io/api/",
    tags: ["monitoring", "errors", "security"]
  },
  // Research & Data
  {
    id: "the-odds-api",
    name: "The Odds API",
    description: "Get real-time sports odds from multiple bookmakers. (Free: 500 requests/month)",
    category: "Research & Data",
    logo: "", // Placeholder
    docsUrl: "https://the-odds-api.com/",
    tags: ["sports", "betting", "odds"]
  },
  {
    id: "google-scholar",
    name: "Google Scholar",
    description: "Access academic articles, citations, and author information. (Free: 100 searches/month via SerpApi)",
    category: "Research & Data",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Scholar_logo.svg",
    docsUrl: "https://serpapi.com/google-scholar-api",
    tags: ["research", "academic", "citations"]
  }
];

const pluginCategories = [
  "All",
  "Productivity & Data Management",
  "Business & Sales",
  "Security & Monitoring",
  "Research & Data",
];

interface PluginMarketplaceProps {
  project?: any;
  onBackToDashboard?: () => void;
}

export default function PluginMarketplace({ project, onBackToDashboard }: PluginMarketplaceProps) {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showN8nSetup, setShowN8nSetup] = useState(false);
  const [showCustomDataset, setShowCustomDataset] = useState(false);
  const { plugins, enabledPlugins, togglePlugin } = usePluginSystem();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, categoryFilter]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth_status');
    const pluginName = urlParams.get('plugin');

    if (authStatus === 'success' && pluginName) {
      toast.success(`Successfully connected to ${pluginName.replace('-', ' ')}!`);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectPlugin = (plugin: ExternalPlugin) => {
    // Handle custom dataset upload separately
    if (plugin.id === 'custom-dataset') {
      setShowCustomDataset(true);
      return;
    }
    
    // Handle n8n setup separately
    if (plugin.id === 'n8n') {
      setShowN8nSetup(true);
      return;
    }
    
    // Redirect to the backend connector OAuth flow for known providers
    const oauthProviders = ['google-sheets', 'microsoft-excel', 'hubspot', 'notion', 'airtable', 'slack', 'jira'];
    if (oauthProviders.includes(plugin.id)) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const authUrl = `${backendUrl}/api/plugins/auth/${plugin.id}`;
      
      // Check if backend is available before redirecting
      fetch(`${backendUrl}/api/health`)
        .then(() => {
          window.location.href = authUrl;
        })
        .catch(() => {
          toast.error(`Backend server not available. Please ensure the server is running on ${backendUrl}`);
        });
    } else {
      toast.info(`Connecting to ${plugin.name}... (Setup instructions available in docs)`);
    }
  };

  const filteredPlugins = externalPlugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || plugin.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pluginsByCategory = filteredPlugins.reduce((acc, plugin) => {
    if (!acc[plugin.category]) {
      acc[plugin.category] = [];
    }
    acc[plugin.category].push(plugin);
    return acc;
  }, {} as Record<string, ExternalPlugin[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Plugin Marketplace
        </h1>
        <p className="text-gray-600 mt-2">Connect to external services and supercharge your API.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">🚀 Discover</TabsTrigger>
          <TabsTrigger value="installed">🔌 Installed ({enabledPlugins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Plugin Library</h3>
                <p className="text-sm text-gray-600">
                  {filteredPlugins.length} of {externalPlugins.length} plugins available
                  {categoryFilter !== "All" && ` in ${categoryFilter}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  🔌 {externalPlugins.length} Total
                </Badge>
                <Badge variant="outline" className="text-sm">
                  🆓 All Free
                </Badge>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {pluginCategories.map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  onClick={() => setCategoryFilter(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Plugin Grid */}
          <div className="space-y-8">
            {Object.entries(pluginsByCategory).map(([category, plugins]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  {category} 
                  <Badge variant="outline" className="ml-2">{plugins.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plugins.map((plugin) => (
                    <Card key={plugin.id} className="hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          {plugin.logo ? (
                            <img
                              src={plugin.logo}
                              alt={`${plugin.name} logo`}
                              className="w-10 h-10 object-contain flex-shrink-0"
                              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40?text=' + plugin.name.charAt(0); }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-semibold leading-tight truncate">{plugin.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pt-0">
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{plugin.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {plugin.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                          ))}
                          {plugin.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-500">+{plugin.tags.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <div className="p-4 border-t flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={plugin.docsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Docs
                          </a>
                        </Button>
                        <Button size="sm" onClick={() => handleConnectPlugin(plugin)}>
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPlugins.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No plugins found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Request new integration */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">Don't see your favorite service?</p>
            <Button asChild>
              <a
                href="https://github.com/your-org/your-repo/issues/new?labels=integration"
                target="_blank"
                rel="noopener noreferrer"
              >
                Request an Integration
              </a>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="installed">
          <Card>
            <CardHeader>
              <CardTitle>Installed Plugins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{plugin.name}</h4>
                    <p className="text-sm text-gray-500">v{plugin.version} by {plugin.author}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {enabledPlugins.find(p => p.id === plugin.id) ? (
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => togglePlugin(plugin.id)}>
                      {enabledPlugins.find(p => p.id === plugin.id) ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* n8n Setup Dialog */}
      <Dialog open={showN8nSetup} onOpenChange={setShowN8nSetup}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>n8n Workflow Automation Setup</DialogTitle>
          </DialogHeader>
          <N8nSetup onClose={() => setShowN8nSetup(false)} />
        </DialogContent>
      </Dialog>

      {/* Custom Dataset Dialog */}
      <Dialog open={showCustomDataset} onOpenChange={setShowCustomDataset}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Custom Dataset</DialogTitle>
          </DialogHeader>
          <CustomDatasetUploader onClose={() => setShowCustomDataset(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
