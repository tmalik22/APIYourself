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

interface EvaluationDashboardProps {
  onClose?: () => void;
}

// Clean interface definitions
interface APIAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: string;
  message: string;
  endpoint?: string;
  value?: number;
  threshold?: number;
  timestamp: string;
  resolved: boolean;
}

interface EndpointHealth {
  endpoint: string;
  method: string;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  lastError?: string;
  lastErrorTime?: string;
  p95ResponseTime?: number;
  p99ResponseTime?: number;
  requestsPerMinute?: number;
}

interface APICall {
  id: string;
  method: string;
  url: string;
  statusCode?: number;
  duration: number;
  timestamp: string;
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
}

export function EvaluationDashboard({ onClose }: EvaluationDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('24'); // hours

  const fetchDashboardData = async () => {
    try {
      setError(null);
      console.log('Fetching dashboard data from: http://localhost:3002/api/evaluation/dashboard');
      
      const response = await fetch('http://localhost:3002/api/evaluation/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received successfully, endpoints:', data.endpoints?.length || 0);
        setDashboardData(data);
      } else {
        const errorText = await response.text();
        const errorMessage = `Server responded with ${response.status}: ${errorText || response.statusText}`;
        console.error('Failed to fetch dashboard data:', errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = `Connection failed: ${error.message}. Please ensure the backend server is running on port 3002.`;
      console.error('Failed to fetch dashboard data:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/evaluation/alerts/${alertId}/resolve`, {
        method: 'POST',
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
    return `${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3">Loading API monitoring dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-semibold">Failed to load API monitoring dashboard</p>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-3 space-y-1 text-xs">
                <p><strong>Troubleshooting steps:</strong></p>
                <p>1. Make sure the backend server is running: <code>npm start</code></p>
                <p>2. Check if the server is accessible at: <a href="http://localhost:3002/api/health" target="_blank" rel="noopener noreferrer" className="underline">http://localhost:3002/api/health</a></p>
                <p>3. Check the browser console for detailed error messages</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchDashboardData();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No dashboard data available. The server may be starting up.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const methodColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  console.log('EvaluationDashboard rendering with data:', !!dashboardData, 'loading:', loading, 'error:', error);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            API Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time API performance, uptime, and health monitoring</p>
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
            <RefreshCw className="w-4 h-4 mr-2" />
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
            <CardTitle className="text-sm font-medium">API Uptime</CardTitle>
            <Server className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatUptime(dashboardData.overview.uptime)}
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.overview.successRate.toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.requestsPerMinute}</div>
            <p className="text-xs text-gray-600">
              {dashboardData.overview.totalRequests.toLocaleString()} total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Timer className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(dashboardData.overview.averageResponseTime, { warning: 1000, critical: 2000 })}`}>
              {dashboardData.overview.averageResponseTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-gray-600">
              Response latency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            {getStatusIcon(dashboardData.overview.errorRate, { warning: 2, critical: 5 })}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(dashboardData.overview.errorRate, { warning: 2, critical: 5 })}`}>
              {dashboardData.overview.errorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600">
              API error rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {dashboardData.alerts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({dashboardData.alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {dashboardData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="text-sm font-medium">{alert.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used: {formatBytes(dashboardData.overview.memoryUsage.used)}</span>
                    <span>{dashboardData.overview.memoryUsage.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={dashboardData.overview.memoryUsage.percentage} />
                  <p className="text-xs text-gray-600">
                    Total: {formatBytes(dashboardData.overview.memoryUsage.total)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Health Summary</CardTitle>
              <CardDescription>Performance metrics for each API endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Endpoint</th>
                      <th className="text-left p-3">Method</th>
                      <th className="text-right p-3">Requests</th>
                      <th className="text-right p-3">Success Rate</th>
                      <th className="text-right p-3">Avg Response</th>
                      <th className="text-right p-3">P95</th>
                      <th className="text-right p-3">P99</th>
                      <th className="text-right p-3">RPM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.endpoints.map((endpoint, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">{endpoint.endpoint}</td>
                        <td className="p-3">
                          <Badge variant="outline">{endpoint.method}</Badge>
                        </td>
                        <td className="p-3 text-right">{endpoint.totalRequests !== undefined ? endpoint.totalRequests.toLocaleString() : '-'}</td>
                        <td className="p-3 text-right">
                          <span className={getStatusColor(endpoint.successRate, { warning: 98, critical: 95 })}>
                            {endpoint.successRate !== undefined ? endpoint.successRate.toFixed(1) : '-'}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={getStatusColor(endpoint.averageResponseTime, { warning: 1000, critical: 2000 })}>
                            {endpoint.averageResponseTime !== undefined ? endpoint.averageResponseTime.toFixed(0) : '-'}ms
                          </span>
                        </td>
                        <td className="p-3 text-right">{endpoint.p95ResponseTime !== undefined ? endpoint.p95ResponseTime.toFixed(0) : '-'}ms</td>
                        <td className="p-3 text-right">{endpoint.p99ResponseTime !== undefined ? endpoint.p99ResponseTime.toFixed(0) : '-'}ms</td>
                        <td className="p-3 text-right">{endpoint.requestsPerMinute !== undefined ? endpoint.requestsPerMinute : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent API Calls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recent API Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dashboardData.recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={call.success ? "default" : "destructive"}>{call.method}</Badge>
                    <span className="font-mono text-xs">{call.url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{call.statusCode}</span>
                    <span>{call.duration.toFixed(0)}ms</span>
                    <span>{new Date(call.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
