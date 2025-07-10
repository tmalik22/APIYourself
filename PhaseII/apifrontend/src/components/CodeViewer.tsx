import { useState } from "react";
import { Download, Copy, Eye, EyeOff, FileText, Folder, Package, Settings, Database, Shield, TestTube, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProductionCodeConfig } from "./ProductionRequirementsEngine";
import { useToast } from "@/hooks/use-toast";

interface CodeViewerProps {
  productionCode: ProductionCodeConfig;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CodeViewer({ productionCode, projectName, isOpen, onClose }: CodeViewerProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileName);
      toast({
        title: "Copied!",
        description: `${fileName} copied to clipboard!`,
      });
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${fileName} downloaded!`,
    });
  };

  const downloadAllFiles = () => {
    // Create a list of all files to download
    const allFiles = [
      ...productionCode.files.map(f => ({ name: f.path, content: f.content })),
      { 
        name: 'package.json', 
        content: JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description: `Production-ready API for ${projectName}`,
          main: 'dist/server.js',
          scripts: productionCode.scripts,
          dependencies: productionCode.dependencies,
          devDependencies: productionCode.devDependencies
        }, null, 2) 
      },
    ];

    // Add Docker files if present
    if (productionCode.dockerFile) {
      allFiles.push({
        name: 'Dockerfile',
        content: productionCode.dockerFile
      });
    }

    // Add CI/CD files if present
    if (productionCode.cicd?.config) {
      const fileName = productionCode.cicd.platform === 'github' ? '.github/workflows/ci.yml' : 'ci-config.yml';
      allFiles.push({
        name: fileName,
        content: productionCode.cicd.config
      });
    }

    // Add environment file
    const envContent = Object.entries(productionCode.environment)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    allFiles.push({
      name: '.env.example',
      content: envContent
    });

    // Download each file individually (staggered to avoid browser limits)
    allFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file.content, file.name);
      }, index * 100);
    });

    toast({
      title: "Download Started",
      description: `Downloading ${allFiles.length} files for ${projectName}...`,
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('package.json')) return <Package className="h-4 w-4" />;
    if (fileName.includes('README')) return <FileText className="h-4 w-4" />;
    if (fileName.includes('docker') || fileName.includes('Docker')) return <Database className="h-4 w-4" />;
    if (fileName.includes('test') || fileName.includes('spec')) return <TestTube className="h-4 w-4" />;
    if (fileName.includes('config') || fileName.includes('yml') || fileName.includes('yaml')) return <Settings className="h-4 w-4" />;
    if (fileName.includes('auth') || fileName.includes('security')) return <Shield className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Production Code</h2>
              <p className="text-gray-600 mt-1">Generated code and configuration for "{projectName}"</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={downloadAllFiles} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Source Files</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="cicd">CI/CD</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Source Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{productionCode.files.length}</div>
                    <p className="text-xs text-gray-500">Generated files</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Dependencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.keys(productionCode.dependencies || {}).length}
                    </div>
                    <p className="text-xs text-gray-500">NPM packages</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Docker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {productionCode.dockerFile ? '✓' : '○'}
                    </div>
                    <p className="text-xs text-gray-500">Containerized</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      CI/CD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {productionCode.cicd?.config ? '✓' : '○'}
                    </div>
                    <p className="text-xs text-gray-500">Automated</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This production-ready code includes security middleware, environment configuration, 
                  testing setup, and deployment configurations based on your requirements.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-semibold">Features Included:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="secondary">Express.js Server</Badge>
                  <Badge variant="secondary">Security Middleware</Badge>
                  <Badge variant="secondary">Error Handling</Badge>
                  <Badge variant="secondary">Environment Config</Badge>
                  <Badge variant="secondary">Docker Support</Badge>
                  <Badge variant="secondary">API Documentation</Badge>
                  {productionCode.cicd?.config && <Badge variant="secondary">CI/CD Pipeline</Badge>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="space-y-2">
                {productionCode.files.map((file, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-gray-50">
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.path)}
                              <span className="font-mono text-sm">{file.path}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(file.content, file.path);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(file.content, file.path);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {expandedSections.has(file.path) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="mt-2">
                        <CardContent className="p-4">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                            <code>{file.content}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span className="font-mono text-sm">package.json</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const packageJson = {
                                name: projectName.toLowerCase().replace(/\s+/g, '-'),
                                version: '1.0.0',
                                description: `Production-ready API for ${projectName}`,
                                main: 'dist/server.js',
                                scripts: productionCode.scripts,
                                dependencies: productionCode.dependencies,
                                devDependencies: productionCode.devDependencies
                              };
                              copyToClipboard(JSON.stringify(packageJson, null, 2), 'package.json');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const packageJson = {
                                name: projectName.toLowerCase().replace(/\s+/g, '-'),
                                version: '1.0.0',
                                description: `Production-ready API for ${projectName}`,
                                main: 'dist/server.js',
                                scripts: productionCode.scripts,
                                dependencies: productionCode.dependencies,
                                devDependencies: productionCode.devDependencies
                              };
                              downloadFile(JSON.stringify(packageJson, null, 2), 'package.json');
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {expandedSections.has('package.json') ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{JSON.stringify({
                          name: projectName.toLowerCase().replace(/\s+/g, '-'),
                          version: '1.0.0',
                          description: `Production-ready API for ${projectName}`,
                          main: 'dist/server.js',
                          scripts: productionCode.scripts,
                          dependencies: productionCode.dependencies,
                          devDependencies: productionCode.devDependencies
                        }, null, 2)}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span className="font-mono text-sm">.env.example</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const envContent = Object.entries(productionCode.environment)
                                .map(([key, value]) => `${key}=${value}`)
                                .join('\n');
                              copyToClipboard(envContent, '.env.example');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const envContent = Object.entries(productionCode.environment)
                                .map(([key, value]) => `${key}=${value}`)
                                .join('\n');
                              downloadFile(envContent, '.env.example');
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Eye className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{Object.entries(productionCode.environment)
                          .map(([key, value]) => `${key}=${value}`)
                          .join('\n')}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>            <TabsContent value="docker" className="space-y-4">
              {productionCode.dockerFile ? (
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-gray-50">
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Database className="h-4 w-4" />
                              <span className="font-mono text-sm">Dockerfile</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(productionCode.dockerFile!, 'Dockerfile');
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(productionCode.dockerFile!, 'Dockerfile');
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Eye className="h-4 w-4" />
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="mt-2">
                        <CardContent className="p-4">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                            <code>{productionCode.dockerFile}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Check if docker-compose.yml exists in files */}
                  {productionCode.files.find(f => f.path.includes('docker-compose')) && (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:bg-gray-50">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Database className="h-4 w-4" />
                                <span className="font-mono text-sm">docker-compose.yml</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const composeFile = productionCode.files.find(f => f.path.includes('docker-compose'));
                                    if (composeFile) {
                                      copyToClipboard(composeFile.content, 'docker-compose.yml');
                                    }
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const composeFile = productionCode.files.find(f => f.path.includes('docker-compose'));
                                    if (composeFile) {
                                      downloadFile(composeFile.content, 'docker-compose.yml');
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Eye className="h-4 w-4" />
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="mt-2">
                          <CardContent className="p-4">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                              <code>{productionCode.files.find(f => f.path.includes('docker-compose'))?.content}</code>
                            </pre>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No Docker configuration was generated. This can be added by selecting Docker deployment in the Production Wizard.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>            <TabsContent value="cicd" className="space-y-4">
              {productionCode.cicd?.config ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gray-50">
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span className="font-mono text-sm">
                              {productionCode.cicd.platform === 'github' ? '.github/workflows/ci.yml' : 'ci-config.yml'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(productionCode.cicd!.config, 'ci.yml');
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(productionCode.cicd!.config, 'ci.yml');
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Eye className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{productionCode.cicd.config}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Alert>
                  <AlertDescription>
                    No CI/CD configuration was generated. This can be added by selecting CI/CD options in the Production Wizard.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
