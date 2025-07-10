import { useState, useEffect } from "react";
import { Plus, Upload, Copy, Trash2, Globe, FileText, AlertTriangle, HelpCircle, BookOpen, MessageSquare, Layers, Code, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIBuilderWalkthrough } from "./APIBuilderWalkthrough";
import { SimpleDataModelWizard } from "./SimpleDataModelWizard";
import { SimplifiedConversationalBuilder } from "./SimplifiedConversationalBuilder";
import { LLMSetup } from "./LLMSetup";
import { ProductionWizard, ProductionRequirements } from "./ProductionWizard";
import { ProductionRequirementsEngine, ProductionCodeConfig } from "./ProductionRequirementsEngine";
import { CodeViewer } from "./CodeViewer";
import { toast } from "sonner";

interface UseCase {
  icon: string;
  title: string;
  description: string;
}

const useCases: UseCase[] = [
  {
    icon: "📱",
    title: "Build a Mobile App Backend",
    description: "Power your social media, e-commerce, or productivity app with a scalable and secure API. Manage users, data, and interactions with ease."
  },
  {
    icon: "🤖",
    title: "Create an AI-Powered Service",
    description: "Connect to large language models (LLMs) and other AI tools to build intelligent applications for data analysis, content generation, or automation."
  },
  {
    icon: "📊",
    title: "Automate Business Workflows",
    description: "Integrate with tools like Google Sheets, Airtable, and Shopify to automate data entry, generate reports, and streamline your business processes."
  },
  {
    icon: "🎮",
    title: "Launch a Gaming API",
    description: "Manage player data, leaderboards, and in-game events for your next hit game. Connect to services like The Odds API for real-time data."
  },
  {
    icon: "🔬",
    title: "Power Research & Data Science",
    description: "Aggregate data from multiple sources, connect to academic APIs like Google Scholar, and build powerful tools for analysis and visualization."
  },
  {
    icon: "🚀",
    title: "Prototype and Launch a Startup",
    description: "Quickly build a minimum viable product (MVP) and iterate on your ideas without getting bogged down in complex backend infrastructure."
  }
];

interface Project {
  id: string;
  name: string;
  models: number;
  status: "online" | "draft";
  lastModified: string;
  template: string;
  createdAt: string;
  description?: string;
  modelDefinitions?: any[];
  endpointDefinitions?: any[];
  productionRequirements?: ProductionRequirements;
  productionCode?: ProductionCodeConfig;
}

const getInitialProjects = (): Project[] => {
  try {
    const savedProjects = localStorage.getItem('api-builder-projects');
    if (savedProjects) {
      return JSON.parse(savedProjects);
    }
  } catch (error) {
    console.warn('Failed to load projects from localStorage:', error);
  }
  
  // Return default projects only if nothing saved
  return [
    { 
      id: "1", 
      name: "Blog API", 
      models: 3, 
      status: "online", 
      lastModified: "2 hours ago", 
      template: "Blog",
      createdAt: "2024-01-15",
      description: "A complete blog system with posts, comments, and user management"
    },
    { 
      id: "2", 
      name: "E-commerce Store", 
      models: 8, 
      status: "draft", 
      lastModified: "1 day ago", 
      template: "E-commerce",
      createdAt: "2024-01-10",
      description: "Full-featured e-commerce platform with products, orders, and payments"
    },
    { 
      id: "3", 
      name: "CRM System", 
      models: 12, 
      status: "online", 
      lastModified: "3 days ago", 
      template: "CRM",
      createdAt: "2024-01-05",
      description: "Customer relationship management with contacts, deals, and pipeline"
    },
  ];
};

const templates = [
  { 
    id: "blog", 
    name: "Blog API", 
    description: "Articles, comments, and user management", 
    models: ["Post", "Comment", "User", "Category"],
    icon: "📝",
    modelDefinitions: [
      {
        id: "post",
        name: "Post",
        fields: [
          { id: "id", name: "id", type: "number", required: true },
          { id: "title", name: "title", type: "text", required: true },
          { id: "content", name: "content", type: "text", required: true },
          { id: "author", name: "author", type: "relation", required: true },
          { id: "published", name: "published", type: "boolean", required: false },
          { id: "createdAt", name: "createdAt", type: "date", required: true }
        ],
        position: { x: 100, y: 100 }
      },
      {
        id: "user",
        name: "User",
        fields: [
          { id: "id", name: "id", type: "number", required: true },
          { id: "email", name: "email", type: "email", required: true },
          { id: "name", name: "name", type: "text", required: true },
          { id: "role", name: "role", type: "text", required: false }
        ],
        position: { x: 400, y: 100 }
      }
    ]
  },
  { 
    id: "ecommerce", 
    name: "E-commerce", 
    description: "Products, orders, and customer management", 
    models: ["Product", "Order", "Customer", "Cart", "Payment"],
    icon: "🛒",
    modelDefinitions: [
      {
        id: "product",
        name: "Product",
        fields: [
          { id: "id", name: "id", type: "number", required: true },
          { id: "name", name: "name", type: "text", required: true },
          { id: "price", name: "price", type: "number", required: true },
          { id: "description", name: "description", type: "text", required: false },
          { id: "stock", name: "stock", type: "number", required: true }
        ],
        position: { x: 100, y: 100 }
      },
      {
        id: "order",
        name: "Order",
        fields: [
          { id: "id", name: "id", type: "number", required: true },
          { id: "customer", name: "customer", type: "relation", required: true },
          { id: "total", name: "total", type: "number", required: true },
          { id: "status", name: "status", type: "text", required: true },
          { id: "createdAt", name: "createdAt", type: "date", required: true }
        ],
        position: { x: 400, y: 100 }
      }
    ]
  },
  { 
    id: "crm", 
    name: "CRM System", 
    description: "Contacts, deals, and pipeline management", 
    models: ["Contact", "Deal", "Company", "Activity"],
    icon: "👥"
  },
  { 
    id: "social", 
    name: "Social Media", 
    description: "Users, posts, likes, and social interactions", 
    models: ["User", "Post", "Like", "Follow", "Comment"],
    icon: "📱"
  },
  { 
    id: "finance", 
    name: "Finance Tracker", 
    description: "Accounts, transactions, and budget management", 
    models: ["Account", "Transaction", "Budget", "Category"],
    icon: "💰"
  },
  { 
    id: "blank", 
    name: "Blank Project", 
    description: "Start from scratch with no predefined models", 
    models: [],
    icon: "📋"
  },
];

interface ProjectDashboardProps {
  onProjectSelect: (project: Project) => void;
  onNewProject: (project: Project) => void;
  templateToImport?: any;
  onTemplateImported?: () => void;
}

export function ProjectDashboardFunctional({ onProjectSelect, onNewProject, templateToImport, onTemplateImported }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSimpleWizard, setShowSimpleWizard] = useState(false);
  const [showProductionWizard, setShowProductionWizard] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [selectedProjectForCode, setSelectedProjectForCode] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("ai");
  const [llmConfig, setLlmConfig] = useState<any>(null);
  const [showLLMSetup, setShowLLMSetup] = useState(false);

  // Check for existing LLM config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('llm-config');
    if (savedConfig) {
      try {
        setLlmConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Invalid LLM config in localStorage:', error);
      }
    }
  }, []);

  // Auto-show walkthrough for first-time users
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('api-builder-walkthrough-seen');
    if (!hasSeenWalkthrough) {
      // Show walkthrough after a brief delay to let the page load
      const timer = setTimeout(() => {
        setShowWalkthrough(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Mark walkthrough as seen when user closes it
  const handleWalkthroughClose = () => {
    setShowWalkthrough(false);
    localStorage.setItem('api-builder-walkthrough-seen', 'true');
  };

  // Handle simple wizard completion
  const handleSimpleWizardComplete = (models: any[]) => {
    // Create a project with the simple models
    const projectId = `project-${Date.now()}`;
    const newProject: Project = {
      id: projectId,
      name: `My API Project`,
      description: `API with ${models.map(m => m.name).join(', ')} models`,
      createdAt: new Date().toISOString(),
      models: models.length,
      status: "draft",
      lastModified: "Just now",
      template: "Simple Wizard",
      modelDefinitions: models.map(model => ({
        id: `${model.name.toLowerCase()}-${Date.now()}`,
        name: model.name,
        fields: model.fields.map((field: any, index: number) => ({
          id: `field-${index}`,
          name: field.name,
          type: field.type,
          required: true
        })),
        position: { x: 100 + models.indexOf(model) * 300, y: 100 }
      })),
      endpointDefinitions: models.flatMap(model => [
        {
          id: `get-${model.name.toLowerCase()}s`,
          path: `/${model.name.toLowerCase()}s`,
          method: 'GET',
          name: `List ${model.name}s`,
          description: `Get all ${model.name.toLowerCase()}s`,
          entity: model.name.toLowerCase()
        },
        {
          id: `post-${model.name.toLowerCase()}`,
          path: `/${model.name.toLowerCase()}s`,
          method: 'POST',
          name: `Create ${model.name}`,
          description: `Create a new ${model.name.toLowerCase()}`,
          entity: model.name.toLowerCase()
        }
      ])
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    toast.success(`Project created with ${models.length} model${models.length !== 1 ? 's' : ''}!`);
    
    // Navigate to the new project
    if (onProjectSelect) {
      onProjectSelect(newProject);
    }
    
    setShowSimpleWizard(false);
  };

  // Handle production wizard completion
  const handleProductionWizardComplete = (requirements: ProductionRequirements, template: any) => {
    // Generate production-ready code and configuration
    const productionCode = ProductionRequirementsEngine.generateProductionCode(requirements, template);
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: template.name === 'blank' ? 'My Production API' : `My ${template.name}`,
      models: template.models?.length || 0,
      status: "draft",
      lastModified: "Just now",
      template: template.name,
      createdAt: new Date().toISOString().split('T')[0],
      description: `Production-ready ${template.description || 'API'} with ${getRequirementsDescription(requirements)}`,
      modelDefinitions: template.modelDefinitions || [],
      endpointDefinitions: template.endpointDefinitions || [],
      productionRequirements: requirements,
      productionCode: productionCode
    };

    setProjects([newProject, ...projects]);
    setShowProductionWizard(false);
    setSelectedTemplate(null);
    
    toast.success(`Production-ready project "${newProject.name}" created successfully!`);
    
    // Auto-navigate to the new project
    onNewProject(newProject);
  };

  // Helper function to describe requirements
  const getRequirementsDescription = (requirements: ProductionRequirements) => {
    const features = [];
    if (requirements.authentication !== 'none') features.push(requirements.authentication.toUpperCase());
    if (requirements.compliance.length > 0) features.push(requirements.compliance.join('/').toUpperCase());
    if (requirements.unitTests || requirements.integrationTests) features.push('Testing');
    if (requirements.cicd !== 'none') features.push('CI/CD');
    return features.length > 0 ? features.join(', ') : 'standard features';
  };

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem('api-builder-projects', JSON.stringify(projects));
    } catch (error) {
      console.warn('Failed to save projects to localStorage:', error);
    }
  }, [projects]);

  // Handle template import from Plugin Marketplace
  useEffect(() => {
    if (templateToImport) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: `My ${templateToImport.name}`,
        models: templateToImport.models?.length || 0,
        status: "draft",
        lastModified: "Just now",
        template: templateToImport.name,
        createdAt: new Date().toISOString().split('T')[0],
        description: templateToImport.description,
        modelDefinitions: templateToImport.modelDefinitions || [],
        endpointDefinitions: []
      };

      setProjects([newProject, ...projects]);
      toast.success(`Template "${templateToImport.name}" imported successfully!`);
      
      if (onTemplateImported) {
        onTemplateImported();
      }
      
      // Auto-navigate to the new project
      onNewProject(newProject);
    }
  }, [templateToImport, projects, onNewProject, onTemplateImported]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setNewProjectName(`My ${template.name}`);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !selectedTemplate) {
      toast.error("Please enter a project name and select a template");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      models: selectedTemplate.models.length,
      status: "draft",
      lastModified: "Just now",
      template: selectedTemplate.name,
      createdAt: new Date().toISOString().split('T')[0],
      description: selectedTemplate.description,
      modelDefinitions: selectedTemplate.modelDefinitions || [],
      endpointDefinitions: []
    };

    setProjects([newProject, ...projects]);
    setShowTemplateDialog(false);
    setNewProjectName("");
    setSelectedTemplate(null);
    toast.success(`Project "${newProjectName}" created successfully!`);
    
    // Auto-navigate to the new project
    onNewProject(newProject);
  };

  const handleDuplicateProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const duplicatedProject: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      status: "draft",
      lastModified: "Just now",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects([duplicatedProject, ...projects]);
    toast.success(`Project "${project.name}" duplicated successfully!`);
  };

  const handleDeleteProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setProjects(projects.filter(p => p.id !== project.id));
    toast.success(`Project "${project.name}" deleted successfully!`);
  };

  const handleImportProject = () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    // Simulate import process
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        const importedProject: Project = {
          id: Date.now().toString(),
          name: importedData.name || "Imported Project",
          models: importedData.models?.length || 0,
          status: "draft",
          lastModified: "Just now",
          template: "Imported",
          createdAt: new Date().toISOString().split('T')[0],
          description: importedData.description || "Imported from file"
        };

        setProjects([importedProject, ...projects]);
        setShowImportDialog(false);
        setImportFile(null);
        toast.success(`Project "${importedProject.name}" imported successfully!`);
      } catch (error) {
        toast.error("Invalid project file. Please check the format.");
      }
    };
    reader.readAsText(importFile);
  };

  const handleExportProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const exportData = {
      name: project.name,
      description: project.description,
      template: project.template,
      models: [], // This would be populated with actual model data
      endpoints: [], // This would be populated with actual endpoint data
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${project.name.replace(/\s+/g, '_')}_export.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success(`Project "${project.name}" exported successfully!`);
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      online: projects.filter(p => p.status === 'online').length,
      draft: projects.filter(p => p.status === 'draft').length,
      totalModels: projects.reduce((sum, p) => sum + p.models, 0)
    };
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear all data? This will delete all projects and cannot be undone.')) {
      localStorage.clear();
      setProjects(getInitialProjects());
      toast.success('All data cleared successfully!');
    }
  };

  const stats = getProjectStats();

  // Create project from template data
  const createProjectFromTemplate = (templateData: any): Project => {
    return {
      id: Date.now().toString(),
      name: templateData.name + " Project",
      models: templateData.models?.length || 0,
      status: "draft",
      lastModified: "Just now",
      template: templateData.name,
      createdAt: new Date().toISOString().split('T')[0],
      description: templateData.description,
      modelDefinitions: templateData.modelDefinitions || [],
      endpointDefinitions: templateData.endpointDefinitions || []
    };
  };

  // Handle template selection from walkthrough
  const handleStartProject = (template: string) => {
    setShowWalkthrough(false);
    if (template === 'blank') {
      setShowTemplateDialog(true);
    } else {
      // Create project with template
      const templateData = templates.find(t => t.id === template);
      if (templateData) {
        const newProject = createProjectFromTemplate(templateData);
        setProjects([...projects, newProject]);
        toast.success(`Created "${newProject.name}" project from ${template} template!`);
        onProjectSelect?.(newProject);
      }
    }
  };
  const isFirstTimeUser = projects.length === 0 || projects.every(p => p.id === "1" || p.id === "2" || p.id === "3"); // Only has default projects

  // Handle project creation from conversational API builder
  const handleConversationalProjectCreate = (projectData: { name: string; description: string; models: any[]; endpoints: any[] }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      models: projectData.models.length,
      status: "draft",
      lastModified: "Just now",
      template: "Conversational",
      createdAt: new Date().toISOString().split('T')[0],
      description: projectData.description,
      modelDefinitions: projectData.models,
      endpointDefinitions: projectData.endpoints
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveTab("projects"); // Switch back to projects tab
    toast.success(`Project "${projectData.name}" created successfully!`);
    
    if (onNewProject) {
      onNewProject(newProject);
    }
  };

  const handleLLMSetupComplete = (config: any) => {
    setLlmConfig(config);
    setShowLLMSetup(false);
    toast.success('AI Assistant configured successfully!');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          Welcome to APIYourself
        </h1>
        <p className="text-lg text-gray-600">Your personal canvas for creating powerful, custom APIs with ease.</p>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-16 px-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-purple-200">
          <Sparkles className="mx-auto h-16 w-16 text-purple-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Ready to build your first app?</h2>
          <p className="text-gray-600 mt-2 mb-6">Just describe your idea in plain English - I'll handle all the technical stuff!</p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => setActiveTab("ai")} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Bot className="mr-2 h-5 w-5" /> {llmConfig ? 'Try AI Builder' : 'Set Up AI Builder'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowWalkthrough(true)}>
              <HelpCircle className="mr-2 h-5 w-5" /> Show Me How
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid md:grid-cols-4 mb-6">
            <TabsTrigger value="ai">🤖 AI Builder</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <Card className="p-0 overflow-hidden">
              {!llmConfig ? (
                <LLMSetup onSetupComplete={handleLLMSetupComplete} />
              ) : (
                <SimplifiedConversationalBuilder onProjectCreate={handleConversationalProjectCreate} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center flex-col min-h-[280px]">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("ai")} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Bot className="mr-2 h-4 w-4" /> {llmConfig ? 'Try AI Builder' : 'Set Up AI Builder'}
                  </Button>
                </CardContent>
              </Card>
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
                      <Badge variant={project.status === 'online' ? 'default' : 'secondary'} className={project.status === 'online' ? 'bg-green-500 text-white' : ''}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 pt-1">{project.description || `Template: ${project.template}`}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-center">
                        <Layers className="mr-2 h-4 w-4" />
                        <span>{project.models} Models</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button onClick={() => onProjectSelect(project)}>Open Project</Button>
                      {project.productionCode && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedProjectForCode(project);
                            setShowCodeViewer(true);
                          }}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          View Code
                        </Button>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project "{project.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => handleDeleteProject(project, e)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleTemplateSelect(template)}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{template.icon}</div>
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {template.models.map(model => (
                        <Badge key={model} variant="secondary">{model}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="help">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setShowWalkthrough(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center"><HelpCircle className="mr-2" /> Interactive Walkthrough</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get a step-by-step guide on how to create your first API from scratch.</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center"><BookOpen className="mr-2" /> Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Read our comprehensive documentation to learn about all the features.</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center"><MessageSquare className="mr-2" /> Community & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Join our community to ask questions and get help from other developers.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Use Case Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-2">What Can You Build with APIYourself?</h2>
        <p className="text-lg text-gray-600 text-center mb-10">From simple automations to complex applications, the possibilities are endless.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map(useCase => (
            <Card key={useCase.title} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="flex items-center space-x-4 p-6">
                <div className="text-4xl">{useCase.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-800">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-gray-600">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dialog for creating a new project from a template */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          
          {!selectedTemplate ? (
            <div>
              <p className="text-gray-600 mb-4">Choose a template to get started quickly, or start with a blank project.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105" 
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{template.icon}</div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3 text-center">{template.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {template.models.slice(0, 4).map((model) => (
                          <Badge key={model} variant="secondary" className="text-xs">{model}</Badge>
                        ))}
                        {template.models.length > 4 && (
                          <Badge variant="secondary" className="text-xs">+{template.models.length - 4}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">{selectedTemplate.icon}</span>
                <div>
                  <h3 className="font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              
              {selectedTemplate.models.length > 0 && (
                <div>
                  <Label>Included Models ({selectedTemplate.models.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.models.map((model: string) => (
                      <Badge key={model} variant="outline">{model}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Back to Templates
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>
                    Create Basic Project
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowTemplateDialog(false);
                      setShowProductionWizard(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    🚀 Production Ready
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Walkthrough Dialog */}
      {showWalkthrough && (
        <APIBuilderWalkthrough
          isOpen={showWalkthrough}
          onClose={handleWalkthroughClose}
          onStartProject={() => setShowTemplateDialog(true)}
          onStartSimpleBuilder={() => setShowSimpleWizard(true)}
        />
      )}

      {/* Simple Data Model Wizard */}
      {showSimpleWizard && (
        <SimpleDataModelWizard
          isOpen={showSimpleWizard}
          onClose={() => setShowSimpleWizard(false)}
          onComplete={handleSimpleWizardComplete}
        />
      )}

      {/* Production Wizard */}
      {showProductionWizard && (
        <ProductionWizard
          isOpen={showProductionWizard}
          onClose={() => setShowProductionWizard(false)}
          onComplete={handleProductionWizardComplete}
          selectedTemplate={selectedTemplate}
        />
      )}

      {/* Code Viewer */}
      {showCodeViewer && selectedProjectForCode?.productionCode && (
        <CodeViewer
          isOpen={showCodeViewer}
          onClose={() => {
            setShowCodeViewer(false);
            setSelectedProjectForCode(null);
          }}
          productionCode={selectedProjectForCode.productionCode}
          projectName={selectedProjectForCode.name}
        />
      )}

      {/* LLM Setup Dialog */}
      {showLLMSetup && (
        <LLMSetup
          isOpen={showLLMSetup}
          onClose={() => setShowLLMSetup(false)}
          onSave={(config) => {
            setLlmConfig(config);
            localStorage.setItem('llm-config', JSON.stringify(config));
            toast.success('LLM configuration saved successfully!');
          }}
          llmConfig={llmConfig}
        />
      )}
    </div>
  );
}
