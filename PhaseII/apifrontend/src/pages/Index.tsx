import { useState, useEffect } from "react";
import { ProjectDashboardFunctional } from "@/components/ProjectDashboardFunctional";
import { DataModelBuilder } from "@/components/DataModelBuilder";
import PluginMarketplace from "@/components/PluginMarketplaceFunctional";
import { EndpointBuilder } from "@/components/EndpointBuilder";
import { CodePreview } from "@/components/CodePreview";
import { DeploymentInterface } from "@/components/DeploymentInterface";
import { ModelManager } from "@/components/ModelManager";
import { EvaluationDashboard } from "@/components/EvaluationDashboard";
import { Sidebar } from "@/components/Sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [currentProject, setCurrentProject] = useState(null);
  const [templateToImport, setTemplateToImport] = useState(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project);
    setActiveView("models"); // Navigate to models view when selecting a project
  };

  const handleNewProject = (project: any) => {
    setCurrentProject(project);
    setActiveView("models"); // Navigate to models view for new project
  };

  const handleBackToDashboard = () => {
    setActiveView("dashboard");
    setCurrentProject(null);
  };

  const handleImportTemplate = (template: any) => {
    // Store template and go back to dashboard
    setTemplateToImport(template);
    setActiveView("dashboard");
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <ProjectDashboardFunctional 
            onProjectSelect={handleProjectSelect} 
            onNewProject={handleNewProject}
            templateToImport={templateToImport}
            onTemplateImported={() => setTemplateToImport(null)}
          />
        );
      case "models":
        return <DataModelBuilder project={currentProject} onBackToDashboard={handleBackToDashboard} />;
      case "plugins":
        return (
          <PluginMarketplace 
            project={currentProject} 
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case "endpoints":
        return <EndpointBuilder project={currentProject} onBackToDashboard={handleBackToDashboard} />;
      case "ai-models":
        return <ModelManager />;
      case "evaluation":
        return <EvaluationDashboard />;
      case "code":
        return <CodePreview project={currentProject} />;
      case "deploy":
        return <DeploymentInterface project={currentProject} />;
      default:
        return (
          <ProjectDashboardFunctional 
            onProjectSelect={handleProjectSelect} 
            onNewProject={handleNewProject}
            templateToImport={templateToImport}
            onTemplateImported={() => setTemplateToImport(null)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        currentProject={currentProject}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
