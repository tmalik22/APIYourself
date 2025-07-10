import { useState, useEffect } from 'react';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  enabled: boolean;
  config?: any;
  hooks?: {
    onDataModelChange?: (model: any) => void;
    onEndpointCreate?: (endpoint: any) => void;
    onProjectGenerate?: (project: any) => void;
  };
}

export function usePluginSystem() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);

  // Load plugins from localStorage
  useEffect(() => {
    try {
      const savedPlugins = localStorage.getItem('api-builder-plugins');
      if (savedPlugins) {
        const parsed = JSON.parse(savedPlugins);
        setPlugins(parsed);
        setEnabledPlugins(parsed.filter((p: Plugin) => p.enabled));
      } else {
        // Initialize with default plugins
        const defaultPlugins: Plugin[] = [
          {
            id: 'auth-jwt',
            name: 'JWT Authentication',
            description: 'Add JWT-based authentication to your API endpoints',
            version: '2.1.0',
            author: 'AuthTeam',
            category: 'Authentication',
            enabled: true,
            hooks: {
              onEndpointCreate: (endpoint) => {
                console.log('JWT Auth: Adding auth middleware to endpoint', endpoint);
              }
            }
          },
          {
            id: 'rate-limiter',
            name: 'Rate Limiter',
            description: 'Prevent API abuse with configurable rate limiting',
            version: '1.5.2',
            author: 'SecurityTeam',
            category: 'Security',
            enabled: false,
            hooks: {
              onEndpointCreate: (endpoint) => {
                console.log('Rate Limiter: Adding rate limiting to endpoint', endpoint);
              }
            }
          },
          {
            id: 'data-validator',
            name: 'Data Validator',
            description: 'Validate incoming data with custom rules and schemas',
            version: '1.8.1',
            author: 'ValidationTeam',
            category: 'Data Processing',
            enabled: true,
            hooks: {
              onDataModelChange: (model) => {
                console.log('Data Validator: Updating validation rules for model', model);
              }
            }
          },
          {
            id: 'cache-redis',
            name: 'Redis Cache',
            description: 'Add Redis caching to improve API performance',
            version: '3.0.0',
            author: 'PerformanceTeam',
            category: 'Performance',
            enabled: false,
            hooks: {
              onEndpointCreate: (endpoint) => {
                console.log('Redis Cache: Adding caching to endpoint', endpoint);
              }
            }
          }
        ];
        setPlugins(defaultPlugins);
        setEnabledPlugins(defaultPlugins.filter(p => p.enabled));
      }
    } catch (error) {
      console.warn('Failed to load plugins:', error);
    }
  }, []);

  // Save plugins when they change
  useEffect(() => {
    try {
      localStorage.setItem('api-builder-plugins', JSON.stringify(plugins));
      setEnabledPlugins(plugins.filter(p => p.enabled));
    } catch (error) {
      console.warn('Failed to save plugins:', error);
    }
  }, [plugins]);

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, enabled: !plugin.enabled }
        : plugin
    ));
  };

  const installPlugin = (newPlugin: Plugin) => {
    setPlugins(prev => [...prev, newPlugin]);
  };

  const uninstallPlugin = (pluginId: string) => {
    setPlugins(prev => prev.filter(p => p.id !== pluginId));
  };

  const executeHook = (hookName: keyof NonNullable<Plugin['hooks']>, data: any) => {
    enabledPlugins.forEach(plugin => {
      if (plugin.hooks?.[hookName]) {
        try {
          plugin.hooks[hookName]!(data);
        } catch (error) {
          console.error(`Error executing ${hookName} hook for plugin ${plugin.name}:`, error);
        }
      }
    });
  };

  return {
    plugins,
    enabledPlugins,
    togglePlugin,
    installPlugin,
    uninstallPlugin,
    executeHook
  };
}
