import { Database, Layout, Puzzle, Code, Globe, Settings, BookOpen, ChevronDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentProject?: any;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Layout },
  { 
    id: "models", 
    label: "Data Models", 
    icon: Database,
    children: [
      { id: "endpoints", label: "Endpoints", icon: Code },
    ] 
  },
  { id: "plugins", label: "Plugins", icon: Puzzle },
  { id: "code", label: "Code Preview", icon: BookOpen },
  { id: "evaluation", label: "Evaluation", icon: BarChart3 },
  { id: "deploy", label: "Deployment", icon: Globe },
];

export function Sidebar({ activeView, onViewChange, currentProject }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    models: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              APIYourself
            </h1>
            <p className="text-xs text-gray-500">No-code API platform</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isParentActive = activeView === item.id || (item.children && item.children.some(child => child.id === activeView));

            if (item.children) {
              return (
                <div key={item.id}>
                  <div className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                    isParentActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}>
                    <button onClick={() => onViewChange(item.id)} className="flex items-center space-x-3 flex-grow">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                    <button onClick={() => toggleSection(item.id)} className="p-1">
                      <ChevronDown className={cn("w-5 h-5 transition-transform", openSections[item.id] ? "rotate-180" : "")} />
                    </button>
                  </div>
                  {openSections[item.id] && (
                    <div className="pl-6 pt-2 space-y-2">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.id}
                            onClick={() => onViewChange(child.id)}
                            className={cn(
                              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm",
                              activeView === child.id
                                ? "bg-gray-200 text-gray-900 font-semibold"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span className="font-medium">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  activeView === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {currentProject && (
          <div className="mt-8 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Current Project</h3>
            <p className="text-sm text-gray-600 font-medium">{currentProject.name}</p>
            <p className="text-xs text-gray-500">{currentProject.models} models</p>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
