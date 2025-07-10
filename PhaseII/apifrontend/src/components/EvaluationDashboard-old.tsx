import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  BarChart3,
  Eye,
  RefreshCw,
  Timer,
  Cpu,
  HardDrive,
  Network,
  Users,
  Shield,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface EvaluationDashboardProps {
  onClose?: () => void;
}

// Updated interfaces for API monitoring
interface APIAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: string;
  message: string;
  endpoint?: string;
  value?: number;
  threshold?: number;
  timestamp: Date;
  resolved: boolean;
}

interface EndpointHealth {
  endpoint: string;
  method: string;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerMinute: number;
}

interface APICall {
  id: string;
  method: string;
  url: string;
  statusCode?: number;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

interface DashboardData {
  overview: {
    uptime: number;
    totalRequests: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    successRate: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  endpoints: EndpointHealth[];
  recentCalls: APICall[];
  alerts: APIAlert[];
  charts: {
    timeSeries: Array<{
      timestamp: string;
      requestsPerMinute: number;
      averageResponseTime: number;
      errorRate: number;
    }>;
    slowestEndpoints: Array<{
      endpoint: string;
      method: string;
      averageResponseTime: number;
      totalRequests: number;
    }>;
    errorsByEndpoint: Array<{
      endpoint: string;
      errorCount: number;
      errorRate: number;
    }>;
    requestsByMethod: Array<{
      method: string;
      count: number;
      percentage: number;
    }>;
  };
  sla: {
    sloTarget: number;
    actualUptime: number;
    breachCount: number;
    mttr: number;
    mtbf: number;
  };
}
  llmPerformance: {
    totalCalls: number;
    successRate: number;
    averageLatency: number;
    totalCost: number;
    totalTokens: number;
    costByModel: Record<string, number>;
  };
  promptEvaluations: {
    totalEvaluations: number;
    averageAccuracy: number;
  };
  brokenSteps: Array<{
    operation: string;
    failureRate: number;
    commonErrors: string[];
    recommendations: string[];
  }>;
  alerts: Array<{
    severity: 'info' | 'warning' | 'error' | 'critical';
    type: string;
    message: string;
    timestamp: Date;
  }>;
}

export function EvaluationDashboard({ onClose }: EvaluationDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/evaluation/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch dashboard data:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/evaluation/alerts/${alertId}/resolve`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h ${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getHealthStatus = (data: DashboardData) => {
    if (!data) return 'unknown';
    
    const { errorRate, averageResponseTime, memoryUsage } = data.overview;
    
    if (errorRate > 10 || averageResponseTime > 3000 || memoryUsage.percentage > 90) {
      return 'critical';
    } else if (errorRate > 5 || averageResponseTime > 1000 || memoryUsage.percentage > 80) {
      return 'warning';
    }
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'critical': return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3">Loading API monitoring dashboard...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please check your API connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const healthStatus = getHealthStatus(dashboardData);
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load evaluation dashboard. Please check the server connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const costData = Object.entries(dashboardData.llmPerformance.costByModel).map(([model, cost]) => ({
    name: model,
    cost: cost
  }));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Evaluation Dashboard
          </h1>
          <p className="text-gray-600 mt-1">System performance, LLM usage, and debugging insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            Refresh Now
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {getStatusIcon(dashboardData.systemHealth.status)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(dashboardData.systemHealth.status)}`}>
              {dashboardData.systemHealth.status.charAt(0).toUpperCase() + dashboardData.systemHealth.status.slice(1)}
            </div>
            <p className="text-xs text-gray-600">
              Uptime: {formatUptime(dashboardData.systemHealth.uptime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Success Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.apiPerformance.successRate.toFixed(1)}%</div>
            <Progress value={dashboardData.apiPerformance.successRate} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {dashboardData.apiPerformance.totalCalls} total calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Costs</CardTitle>
            <DollarSign className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.llmPerformance.totalCost.toFixed(2)}</div>
            <p className="text-xs text-gray-600">
              {dashboardData.llmPerformance.totalTokens.toLocaleString()} tokens used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.apiPerformance.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-gray-600">
              {dashboardData.systemHealth.metrics?.apiCallsPerMinute || 0} calls/min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="llm">LLM Analysis</TabsTrigger>
          <TabsTrigger value="broken">Broken Steps</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.systemHealth.metrics && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{dashboardData.systemHealth.metrics.memoryUsage.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={dashboardData.systemHealth.metrics.memoryUsage.percentage} className="mt-1" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Error Rate</span>
                        <span>{dashboardData.systemHealth.metrics.errorRate.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={dashboardData.systemHealth.metrics.errorRate} 
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        Response Time: {dashboardData.systemHealth.metrics.averageResponseTime.toFixed(0)}ms
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* LLM Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  LLM Cost by Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                {costData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toFixed(3)}`, 'Cost']} />
                      <Bar dataKey="cost" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No LLM usage data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.llmPerformance.totalCalls}</div>
                  <div className="text-sm text-gray-600">LLM Calls</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.llmPerformance.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">LLM Success</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dashboardData.promptEvaluations.totalEvaluations}</div>
                  <div className="text-sm text-gray-600">Evaluations</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{dashboardData.brokenSteps.length}</div>
                  <div className="text-sm text-gray-600">Broken Steps</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Slow Endpoints</CardTitle>
                <CardDescription>Endpoints with response times above 1000ms</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.apiPerformance.slowEndpoints.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.apiPerformance.slowEndpoints.map((endpoint, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-mono text-sm">{endpoint.endpoint}</span>
                        <Badge variant="destructive">
                          {endpoint.averageResponseTime.toFixed(0)}ms
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No slow endpoints detected</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold">{dashboardData.apiPerformance.totalCalls}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-red-600">{dashboardData.apiPerformance.errorRate.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <Progress value={dashboardData.apiPerformance.successRate} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">{dashboardData.apiPerformance.successRate.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LLM Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold">{dashboardData.llmPerformance.totalCalls}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <Progress value={dashboardData.llmPerformance.successRate} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">{dashboardData.llmPerformance.successRate.toFixed(1)}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Avg Latency</p>
                  <p className="text-lg font-semibold">{dashboardData.llmPerformance.averageLatency.toFixed(0)}ms</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-yellow-600">${dashboardData.llmPerformance.totalCost.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Total Tokens</p>
                  <p className="text-lg font-semibold">{dashboardData.llmPerformance.totalTokens.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Avg Cost per Call</p>
                  <p className="text-lg font-semibold">
                    ${dashboardData.llmPerformance.totalCalls > 0 ? 
                      (dashboardData.llmPerformance.totalCost / dashboardData.llmPerformance.totalCalls).toFixed(4) : 
                      '0.0000'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Evaluations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Evaluations</p>
                  <p className="text-2xl font-bold">{dashboardData.promptEvaluations.totalEvaluations}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                  <Progress value={dashboardData.promptEvaluations.averageAccuracy * 100} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">{(dashboardData.promptEvaluations.averageAccuracy * 100).toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="broken" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Broken Workflow Steps
              </CardTitle>
              <CardDescription>
                Operations with high failure rates that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.brokenSteps.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.brokenSteps.map((step, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{step.operation}</h4>
                          <Badge variant="destructive">
                            {step.failureRate.toFixed(1)}% failure rate
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Common Errors:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {step.commonErrors.slice(0, 3).map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {step.recommendations.slice(0, 2).map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-500">No broken steps detected! All workflows are running smoothly.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.alerts.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.alerts.slice(0, 10).map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()} • {alert.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-500">No recent alerts. System is running smoothly!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
