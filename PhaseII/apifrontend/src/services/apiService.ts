// API service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:3002/api';

export interface BackendProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  dataModel: any;
  endpoints: any[];
  settings: any;
}

export interface BackendPlugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  metadata: any;
}

class ApiService {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.fetch('/health');
  }

  // Projects
  async getProjects(): Promise<BackendProject[]> {
    return this.fetch('/projects');
  }

  async createProject(project: { id: string; name: string; description?: string }) {
    return this.fetch('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProject(id: string): Promise<BackendProject> {
    return this.fetch(`/projects/${id}`);
  }

  async deleteProject(id: string) {
    return this.fetch(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Models
  async addModel(projectId: string, model: { name: string; fields: any[] }) {
    return this.fetch(`/projects/${projectId}/models`, {
      method: 'POST',
      body: JSON.stringify(model),
    });
  }

  // Endpoints
  async addEndpoint(projectId: string, endpoint: { 
    path: string; 
    method: string; 
    model: string;
    name?: string;
    description?: string;
  }) {
    return this.fetch(`/projects/${projectId}/endpoints`, {
      method: 'POST',
      body: JSON.stringify(endpoint),
    });
  }

  // Code generation
  async generateCode(projectId: string) {
    return this.fetch(`/projects/${projectId}/generate`, {
      method: 'POST',
    });
  }

  // Plugins
  async getPlugins(): Promise<BackendPlugin[]> {
    return this.fetch('/plugins');
  }

  async enablePlugin(pluginId: string, config: any = {}) {
    return this.fetch(`/plugins/${pluginId}/enable`, {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
  }

  async disablePlugin(pluginId: string) {
    return this.fetch(`/plugins/${pluginId}/disable`, {
      method: 'POST',
    });
  }

  // Chat and API Generation
  async sendChatMessage(message: string, context?: any): Promise<{ response: string; shouldBuild?: boolean }> {
    return this.fetch('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async generateAPI(requirements: string): Promise<{ projectId: string; progress: any }> {
    return this.fetch('/generate-api', {
      method: 'POST',
      body: JSON.stringify({ requirements }),
    });
  }

  async getGenerationProgress(projectId: string): Promise<{ status: string; progress: number; stage: string }> {
    return this.fetch(`/generate-api/${projectId}/progress`);
  }

  async finalizeAPIGeneration(projectId: string): Promise<BackendProject> {
    return this.fetch(`/generate-api/${projectId}/finalize`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();

// Hook for backend connection status
export function useBackendConnection() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiService.healthCheck();
        setIsConnected(true);
      } catch (error) {
        console.warn('Backend not available, using local storage mode');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isConnected, isLoading };
}

import React from 'react';
