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

export function EvaluationDashboard({ onClose }: EvaluationDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('24'); // hours

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/evaluation/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
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

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load API monitoring dashboard. Please check the server connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const methodColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Response Time Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dashboardData.charts.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Response Time']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="averageResponseTime" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Request Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Request Volume (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dashboardData.charts.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number) => [`${value.toFixed(1)}`, 'Requests/Min']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="requestsPerMinute" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  SLA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target: {dashboardData.sla.sloTarget}%</span>
                    <span className={getStatusColor(dashboardData.sla.actualUptime, { warning: 99, critical: 95 })}>
                      {dashboardData.sla.actualUptime.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={dashboardData.sla.actualUptime} />
                  <p className="text-xs text-gray-600">
                    {dashboardData.sla.breachCount} breaches
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  HTTP Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.charts.requestsByMethod.slice(0, 4).map((method, index) => (
                    <div key={method.method} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{method.method}</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: methodColors[index % methodColors.length] }}
                        />
                        <span className="text-sm">{method.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
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
                        <td className="p-3 text-right">{endpoint.totalRequests.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={getStatusColor(endpoint.successRate, { warning: 98, critical: 95 })}>
                            {endpoint.successRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={getStatusColor(endpoint.averageResponseTime, { warning: 1000, critical: 2000 })}>
                            {endpoint.averageResponseTime.toFixed(0)}ms
                          </span>
                        </td>
                        <td className="p-3 text-right">{endpoint.p95ResponseTime.toFixed(0)}ms</td>
                        <td className="p-3 text-right">{endpoint.p99ResponseTime.toFixed(0)}ms</td>
                        <td className="p-3 text-right">{endpoint.requestsPerMinute}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slowest Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>Slowest Endpoints</CardTitle>
                <CardDescription>Endpoints with highest average response time</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.charts.slowestEndpoints.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.charts.slowestEndpoints} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="endpoint" width={100} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Avg Response Time']} />
                      <Bar dataKey="averageResponseTime" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No performance issues detected</p>
                )}
              </CardContent>
            </Card>

            {/* Error Rate by Endpoint */}
            <Card>
              <CardHeader>
                <CardTitle>Errors by Endpoint</CardTitle>
                <CardDescription>Endpoints with the highest error rates</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.charts.errorsByEndpoint.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.charts.errorsByEndpoint.slice(0, 8).map((endpoint, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <div>
                          <span className="font-mono text-sm">{endpoint.endpoint}</span>
                          <p className="text-xs text-gray-600">{endpoint.errorCount} errors</p>
                        </div>
                        <Badge variant="destructive">
                          {endpoint.errorRate.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No errors detected</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Error Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Error Rate Trend (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dashboardData.charts.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Error Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="errorRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{dashboardData.overview.memoryUsage.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={dashboardData.overview.memoryUsage.percentage} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(dashboardData.overview.memoryUsage.used)} / {formatBytes(dashboardData.overview.memoryUsage.total)}
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.overview.requestsPerMinute}</p>
                      <p className="text-xs text-gray-600">Requests/Min</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{formatUptime(dashboardData.overview.uptime)}</p>
                      <p className="text-xs text-gray-600">Uptime</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  SLA Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Availability Target</span>
                    <span>{dashboardData.sla.sloTarget}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Actual Availability</span>
                    <span className={getStatusColor(dashboardData.sla.actualUptime, { warning: 99, critical: 95 })}>
                      {dashboardData.sla.actualUptime.toFixed(3)}%
                    </span>
                  </div>
                  <Progress value={dashboardData.sla.actualUptime} className="mt-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-red-600">{dashboardData.sla.breachCount}</p>
                      <p className="text-xs text-gray-600">SLA Breaches</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-orange-600">{(dashboardData.sla.mtbf / (1000 * 60 * 60)).toFixed(1)}h</p>
                      <p className="text-xs text-gray-600">MTBF</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HTTP Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>HTTP Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dashboardData.charts.requestsByMethod}
                      dataKey="count"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ method, percentage }) => `${method} (${percentage.toFixed(1)}%)`}
                    >
                      {dashboardData.charts.requestsByMethod.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={methodColors[index % methodColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name) => [`${value.toLocaleString()}`, 'Requests']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
                  {dashboardData.recentCalls.slice(0, 10).map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={call.success ? "default" : "destructive"}>
                          {call.method}
                        </Badge>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
