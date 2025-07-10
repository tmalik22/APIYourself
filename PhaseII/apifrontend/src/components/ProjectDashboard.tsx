
import { useState } from "react";
import { Plus, Upload, Copy, Trash2, Globe, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  models: number;
  status: "online" | "draft";
  lastModified: string;
  template: string;
  createdAt: string;
  description?: string;
}

const initialProjects: Project[] = [
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

const templates = [
  { 
    id: "blog", 
    name: "Blog API", 
    description: "Articles, comments, and user management", 
    models: ["Post", "Comment", "User", "Category"],
    icon: "📝"
  },
  { 
    id: "ecommerce", 
    name: "E-commerce", 
    description: "Products, orders, and customer management", 
    models: ["Product", "Order", "Customer", "Cart", "Payment"],
    icon: "🛒"
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
}

export function ProjectDashboard({ onProjectSelect, onNewProject }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

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
      description: selectedTemplate.description
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

  const stats = getProjectStats();

export function ProjectDashboard({ onProjectSelect, onNewProject }: ProjectDashboardProps) {
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const handleTemplateSelect = (template: any) => {
    console.log("Selected template:", template);
    setShowTemplateDialog(false);
    onNewProject();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your API Projects
          </h1>
          <p className="text-gray-600 mt-2">Build, deploy, and manage your APIs without code</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </Button>
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(template)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.models.slice(0, 3).map((model) => (
                          <Badge key={model} variant="secondary" className="text-xs">{model}</Badge>
                        ))}
                        {template.models.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{template.models.length - 3} more</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Projects</p>
                <p className="text-3xl font-bold">{mockProjects.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Live APIs</p>
                <p className="text-3xl font-bold">{mockProjects.filter(p => p.status === 'online').length}</p>
              </div>
              <Globe className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Models</p>
                <p className="text-3xl font-bold">{mockProjects.reduce((sum, p) => sum + p.models, 0)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-400 rounded flex items-center justify-center">
                <span className="text-sm font-bold">DB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => onProjectSelect(project)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                  <Badge variant={project.status === 'online' ? 'default' : 'secondary'} className={project.status === 'online' ? 'bg-green-500' : ''}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">{project.models} data models</p>
                  <p className="text-gray-500 text-xs">Last modified {project.lastModified}</p>
                  <Badge variant="outline" className="text-xs">{project.template}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); }}>
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
