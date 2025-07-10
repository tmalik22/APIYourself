
import { useState } from "react";
import { Search, Filter, Star, Download, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  enabled: boolean;
  configured: boolean;
  icon: string;
  version: string;
}

const mockPlugins: Plugin[] = [
  {
    id: "1",
    name: "PostgreSQL Database",
    description: "Connect to PostgreSQL database with automatic CRUD operations",
    category: "database",
    rating: 4.8,
    downloads: 15420,
    enabled: true,
    configured: true,
    icon: "🐘",
    version: "2.1.0"
  },
  {
    id: "2",
    name: "JWT Authentication",
    description: "Secure your API with JWT token-based authentication",
    category: "authentication",
    rating: 4.9,
    downloads: 23150,
    enabled: true,
    configured: false,
    icon: "🔐",
    version: "1.4.2"
  },
  {
    id: "3",
    name: "Email Notifications",
    description: "Send automated emails using various providers",
    category: "processing",
    rating: 4.6,
    downloads: 8920,
    enabled: false,
    configured: false,
    icon: "📧",
    version: "1.2.1"
  },
  {
    id: "4",
    name: "Image Upload & Resize",
    description: "Handle image uploads with automatic resizing and optimization",
    category: "processing",
    rating: 4.7,
    downloads: 12340,
    enabled: false,
    configured: false,
    icon: "🖼️",
    version: "2.0.3"
  },
  {
    id: "5",
    name: "Rate Limiting",
    description: "Protect your API from abuse with configurable rate limits",
    category: "security",
    rating: 4.5,
    downloads: 9876,
    enabled: true,
    configured: true,
    icon: "⚡",
    version: "1.1.0"
  },
  {
    id: "6",
    name: "Stripe Payments",
    description: "Accept payments with Stripe integration",
    category: "processing",
    rating: 4.8,
    downloads: 6543,
    enabled: false,
    configured: false,
    icon: "💳",
    version: "3.2.1"
  }
];

const categories = [
  { id: "all", name: "All Plugins", count: mockPlugins.length },
  { id: "database", name: "Database", count: mockPlugins.filter(p => p.category === "database").length },
  { id: "authentication", name: "Authentication", count: mockPlugins.filter(p => p.category === "authentication").length },
  { id: "processing", name: "Processing", count: mockPlugins.filter(p => p.category === "processing").length },
  { id: "security", name: "Security", count: mockPlugins.filter(p => p.category === "security").length },
];

interface PluginMarketplaceProps {
  project: any;
}

export function PluginMarketplace({ project }: PluginMarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [plugins, setPlugins] = useState(mockPlugins);

  const enabledPlugins = plugins.filter(p => p.enabled);
  const availablePlugins = plugins.filter(p => !p.enabled);

  const togglePlugin = (pluginId: string) => {
    setPlugins(plugins.map(p => 
      p.id === pluginId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const filteredPlugins = (pluginList: Plugin[]) => {
    return pluginList.filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Plugin Marketplace
          </h1>
          <p className="text-gray-600 mt-2">Extend your API with powerful plugins</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Plugin Tabs */}
      <Tabs defaultValue="enabled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enabled">Enabled Plugins ({enabledPlugins.length})</TabsTrigger>
          <TabsTrigger value="available">Available Plugins ({availablePlugins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="enabled" className="mt-6">
          {enabledPlugins.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Power className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No plugins enabled</h3>
                <p className="text-gray-600">Enable plugins from the available plugins tab to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlugins(enabledPlugins).map((plugin) => (
                <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{plugin.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{plugin.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            v{plugin.version}
                          </Badge>
                        </div>
                      </div>
                      <Switch checked={true} onCheckedChange={() => togglePlugin(plugin.id)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{plugin.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{plugin.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{plugin.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant={plugin.configured ? "default" : "destructive"} className="text-xs">
                        {plugin.configured ? "Configured" : "Needs Configuration"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins(availablePlugins).map((plugin) => (
              <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{plugin.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {plugin.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{plugin.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{plugin.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{plugin.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => togglePlugin(plugin.id)}
                  >
                    Enable Plugin
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
