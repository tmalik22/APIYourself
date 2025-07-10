
import { useState } from "react";
import { Cloud, Download, Settings, Globe, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  popular?: boolean;
  requirements: string[];
}

const deploymentOptions: DeploymentOption[] = [
  {
    id: "local",
    name: "Local Download",
    description: "Download and run locally on your machine",
    icon: "💻",
    requirements: ["Node.js 16+", "PostgreSQL (optional)"]
  },
  {
    id: "docker",
    name: "Docker Container",
    description: "Containerized deployment with Docker",
    icon: "🐳",
    requirements: ["Docker", "Docker Compose"]
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy to Vercel with automatic scaling",
    icon: "▲",
    popular: true,
    requirements: ["Vercel account", "Git repository"]
  },
  {
    id: "railway",
    name: "Railway",
    description: "Deploy to Railway with database included",
    icon: "🚂",
    popular: true,
    requirements: ["Railway account"]
  },
  {
    id: "render",
    name: "Render",
    description: "Deploy to Render with free tier available",
    icon: "🎨",
    requirements: ["Render account", "Git repository"]
  },
  {
    id: "aws",
    name: "AWS Lambda",
    description: "Serverless deployment on AWS",
    icon: "☁️",
    requirements: ["AWS account", "AWS CLI configured"]
  }
];

interface DeploymentInterfaceProps {
  project: any;
}

export function DeploymentInterface({ project }: DeploymentInterfaceProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "error">("idle");
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const { toast } = useToast();

  const handleDeploy = async (platformId: string) => {
    setSelectedPlatform(platformId);
    setIsDeploying(true);
    setDeploymentStatus("deploying");
    setDeploymentProgress(0);

    try {
      // Start progress animation
      const interval = setInterval(() => {
        setDeploymentProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Stop at 90% until we get real response
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Make real API call to deployment service
      const response = await fetch(`http://localhost:3000/api/projects/${project.id}/deploy/${platformId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environment: 'production',
          subdomain: project.name.toLowerCase().replace(/\s+/g, '-')
        })
      });

      const result = await response.json();
      
      clearInterval(interval);
      setDeploymentProgress(100);
      setIsDeploying(false);

      if (response.ok && result.status === 'success') {
        setDeploymentStatus("success");
        setDeploymentUrl(result.deploymentUrl);
        toast({
          title: "Deployment successful!",
          description: `Your API is now live at ${result.deploymentUrl}`,
        });
      } else {
        setDeploymentStatus("error");
        toast({
          title: "Deployment failed",
          description: result.message || "An error occurred during deployment",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setIsDeploying(false);
      setDeploymentStatus("error");
      toast({
        title: "Deployment failed",
        description: error.message || "Network error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your project files are being prepared for download",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deploying":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Deploy Your API
          </h1>
          <p className="text-gray-600 mt-2">Choose your deployment platform and go live</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(deploymentStatus)}
          <span className="text-sm font-medium">
            {deploymentStatus === "idle" && "Ready to deploy"}
            {deploymentStatus === "deploying" && "Deploying..."}
            {deploymentStatus === "success" && "Live"}
            {deploymentStatus === "error" && "Error"}
          </span>
        </div>
      </div>

      {/* Deployment Status */}
      {deploymentStatus === "success" && deploymentUrl && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-green-800">Deployment Successful!</h3>
                  <p className="text-green-600 text-sm">Your API is now live and accessible</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 mb-1">Live URL:</p>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono text-sm underline"
                >
                  {deploymentUrl}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Progress */}
      {isDeploying && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Deploying to {deploymentOptions.find(d => d.id === selectedPlatform)?.name}</h3>
                <span className="text-sm text-gray-600">{Math.round(deploymentProgress)}%</span>
              </div>
              <Progress value={deploymentProgress} className="h-2" />
              <div className="text-sm text-gray-600">
                {deploymentProgress < 25 && "Building project..."}
                {deploymentProgress >= 25 && deploymentProgress < 50 && "Installing dependencies..."}
                {deploymentProgress >= 50 && deploymentProgress < 75 && "Configuring environment..."}
                {deploymentProgress >= 75 && deploymentProgress < 100 && "Finalizing deployment..."}
                {deploymentProgress >= 100 && "Deployment complete!"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deploymentOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{option.icon}</div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {option.name}
                    </CardTitle>
                    {option.popular && (
                      <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{option.description}</p>
              
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                <div className="space-y-1">
                  {option.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                variant={option.popular ? "default" : "outline"}
                onClick={() => option.id === "local" ? handleDownload() : handleDeploy(option.id)}
                disabled={isDeploying}
              >
                {option.id === "local" ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4 mr-2" />
                    Deploy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environment Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Environment Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="database-url">Database URL</Label>
              <Input
                id="database-url"
                placeholder="postgresql://user:password@host:port/database"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="jwt-secret">JWT Secret</Label>
              <Input
                id="jwt-secret"
                placeholder="your-super-secret-jwt-key"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="node-env">Environment</Label>
              <Select defaultValue="production">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input id="port" placeholder="3000" defaultValue="3000" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
