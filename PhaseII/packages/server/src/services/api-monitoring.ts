import { Request, Response, NextFunction } from 'express';
import { logger, performanceTracker } from './logging';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// API call tracking interface
export interface APICall {
  id: string;
  method: string;
  url: string;
  statusCode?: number;
  duration: number;
  timestamp: Date;
  userId?: string;
  userAgentInfo?: string;
  ipAddress?: string;
  requestSize?: number;
  responseSize?: number;
  success: boolean;
  error?: string;
  endpoint?: string;
  operation?: string;
  // Enhanced timing breakdown
  timings?: {
    dns?: number;
    connect?: number;
    tls?: number;
    ttfb: number; // Time to First Byte
    download: number;
    total: number;
  };
}

// API Alert interface for proactive monitoring
export interface APIAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: 'uptime' | 'latency' | 'error_rate' | 'ssl_expiry' | 'rate_limit' | 'memory' | 'cpu';
  message: string;
  endpoint?: string;
  value?: number;
  threshold?: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

// Endpoint health tracking
export interface EndpointHealth {
  endpoint: string;
  method: string;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  lastError?: string;
  lastErrorTime?: Date;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerMinute: number;
}

// SLA/SLO monitoring
export interface SLAMetrics {
  sloTarget: number; // e.g., 99.9% uptime
  actualUptime: number;
  breachCount: number;
  mttr: number; // Mean Time To Recovery
  mtbf: number; // Mean Time Between Failures
}

// System health metrics
export interface SystemMetrics {
  timestamp: Date;
  cpuUsage?: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  apiCallsPerMinute: number;
  errorRate: number;
  averageResponseTime: number;
  activeOperations: number;
}

export class APIMonitoringService {
  private calls: APICall[] = [];
  private readonly maxStoredCalls = 10000; // Keep last 10k calls
  private systemMetrics: SystemMetrics[] = [];
  private readonly maxStoredMetrics = 1440; // Keep 24 hours of minute-by-minute metrics
  private alerts: APIAlert[] = [];
  private endpointHealth: Map<string, EndpointHealth> = new Map();
  private readonly dataFile = path.join(process.cwd(), 'data', 'api-monitoring.json');
  private startTime = Date.now();
  
  // Configurable thresholds for alerting
  private thresholds = {
    errorRate: 5, // 5% error rate threshold
    latency: 2000, // 2 second latency threshold
    uptimeAlert: 99, // Alert if uptime drops below 99%
    memoryUsage: 85, // Alert if memory usage exceeds 85% (more reasonable)
    responseTime95: 1000, // 95th percentile response time threshold
  };
  
  constructor() {
    // Start collecting system metrics every minute
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000); // Every minute
    
    // Load existing data
    this.loadStoredData();
    
    // Auto-save data every 5 minutes
    setInterval(() => {
      this.saveData();
    }, 5 * 60 * 1000);
    
    // Wait 30 seconds before starting memory monitoring to let the app stabilize
    setTimeout(() => {
      this.startMemoryMonitoring = true;
    }, 30000);
  }
  
  private startMemoryMonitoring = false;
  
  /**
   * Express middleware for monitoring API calls
   */
  middleware() {
    const self = this;
    
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const callId = uuidv4();
      const traceId = performanceTracker.startOperation(
        `api_${req.method}_${req.path}`,
        req.headers['user-id'] as string,
        {
          method: req.method,
          url: req.url,
          userAgent: req.headers['user-agent'],
          ip: req.ip
        }
      );
      
      // Add trace ID to request for downstream use
      req.headers['x-trace-id'] = traceId;
      
      // Capture request size
      const requestSize = req.get('content-length') ? parseInt(req.get('content-length')!) : 0;
      
      // Override res.send to capture response data
      const originalSend = res.send;
      let responseSize = 0;
      
      res.send = function(data) {
        responseSize = Buffer.byteLength(data || '', 'utf8');
        return originalSend.call(this, data);
      };
      
      // Listen for the response finish event
      res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const apiCall: APICall = {
          id: callId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          timestamp: new Date(startTime),
          userId: req.headers['user-id'] as string,
          userAgentInfo: req.headers['user-agent'] as string,
          ipAddress: req.ip,
          requestSize,
          responseSize,
          success: res.statusCode < 400,
          error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
          endpoint: req.route?.path || req.path,
          operation: `${req.method} ${req.path}`,
          timings: {
            ttfb: duration * 0.8, // Approximate TTFB as 80% of total time
            download: duration * 0.2,
            total: duration,
          }
        };
        
        // Store the call
        self.trackAPICall(apiCall);
        
        // End the performance tracking
        performanceTracker.endOperation(traceId, apiCall.success, 
          apiCall.error ? new Error(apiCall.error) : undefined);
      });
      
      next();
    };
  }
  
  /**
   * Track an API call
   */
  private trackAPICall(call: APICall): void {
    this.calls.push(call);
    
    // Rotate stored calls
    if (this.calls.length > this.maxStoredCalls) {
      this.calls = this.calls.slice(-this.maxStoredCalls);
    }
    
    // Update endpoint health
    this.updateEndpointHealth(call);
    
    // Check for alerts
    this.checkAlerts(call);
    
    // Log based on success/failure
    if (call.success) {
      logger.info(`API call completed`, {
        method: call.method,
        url: call.url,
        statusCode: call.statusCode,
        duration: call.duration,
        userId: call.userId,
        traceId: call.id
      });
    } else {
      logger.error(`API call failed`, {
        method: call.method,
        url: call.url,
        statusCode: call.statusCode,
        duration: call.duration,
        error: call.error,
        userId: call.userId,
        traceId: call.id
      });
    }
  }
  
  /**
   * Update endpoint health metrics
   */
  private updateEndpointHealth(call: APICall): void {
    const key = `${call.method}:${call.endpoint}`;
    const existing = this.endpointHealth.get(key);
    
    if (existing) {
      existing.totalRequests++;
      existing.successRate = this.calculateSuccessRate(key);
      existing.averageResponseTime = this.calculateAverageResponseTime(key);
      existing.errorRate = this.calculateErrorRate(key);
      existing.p95ResponseTime = this.calculatePercentile(key, 95);
      existing.p99ResponseTime = this.calculatePercentile(key, 99);
      existing.requestsPerMinute = this.calculateRequestsPerMinute(key);
      
      if (!call.success) {
        existing.lastError = call.error;
        existing.lastErrorTime = call.timestamp;
      }
    } else {
      this.endpointHealth.set(key, {
        endpoint: call.endpoint || 'unknown',
        method: call.method,
        totalRequests: 1,
        successRate: call.success ? 100 : 0,
        averageResponseTime: call.duration,
        errorRate: call.success ? 0 : 100,
        lastError: call.error,
        lastErrorTime: call.success ? undefined : call.timestamp,
        p95ResponseTime: call.duration,
        p99ResponseTime: call.duration,
        requestsPerMinute: 1,
      });
    }
  }
  
  /**
   * Check for alerting conditions
   */
  private checkAlerts(call: APICall): void {
    const key = `${call.method}:${call.endpoint}`;
    const health = this.endpointHealth.get(key);
    
    if (!health) return;

    // Check error rate threshold
    if (health.errorRate > this.thresholds.errorRate && health.totalRequests > 10) {
      this.createAlert({
        severity: 'error',
        type: 'error_rate',
        message: `High error rate detected for ${call.endpoint}: ${health.errorRate.toFixed(1)}%`,
        endpoint: call.endpoint,
        value: health.errorRate,
        threshold: this.thresholds.errorRate,
      });
    }

    // Check latency threshold
    if (call.duration > this.thresholds.latency) {
      this.createAlert({
        severity: 'warning',
        type: 'latency',
        message: `High response time detected for ${call.endpoint}: ${call.duration.toFixed(0)}ms`,
        endpoint: call.endpoint,
        value: call.duration,
        threshold: this.thresholds.latency,
      });
    }
    
    // Check 95th percentile response time
    if (health.p95ResponseTime > this.thresholds.responseTime95 && health.totalRequests > 20) {
      this.createAlert({
        severity: 'warning',
        type: 'latency',
        message: `95th percentile response time high for ${call.endpoint}: ${health.p95ResponseTime.toFixed(0)}ms`,
        endpoint: call.endpoint,
        value: health.p95ResponseTime,
        threshold: this.thresholds.responseTime95,
      });
    }
  }
  
  /**
   * Create an alert
   */
  private createAlert(alertData: Omit<APIAlert, 'id' | 'timestamp' | 'resolved'>): void {
    // Check if similar alert already exists and is unresolved
    const existingAlert = this.alerts.find(alert => 
      !alert.resolved && 
      alert.type === alertData.type && 
      alert.endpoint === alertData.endpoint
    );

    if (existingAlert) return; // Don't create duplicate alerts

    const alert: APIAlert = {
      id: uuidv4(),
      timestamp: new Date(),
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);
    console.warn(`API Alert: ${alert.message}`);
  }
  
  /**
   * Get API call statistics
   */
  getAPIStats(timeRange?: { start: Date; end: Date }) {
    let filteredCalls = this.calls;
    
    if (timeRange) {
      filteredCalls = this.calls.filter(call => 
        call.timestamp >= timeRange.start && call.timestamp <= timeRange.end
      );
    }
    
    if (filteredCalls.length === 0) {
      return {
        totalCalls: 0,
        successRate: 0,
        averageResponseTime: 0,
        callsPerMinute: 0,
        errorRate: 0,
        byEndpoint: {},
        byStatusCode: {},
        recentErrors: []
      };
    }
    
    const successfulCalls = filteredCalls.filter(call => call.success);
    const totalDuration = filteredCalls.reduce((sum, call) => sum + call.duration, 0);
    
    // Group by endpoint
    const byEndpoint = filteredCalls.reduce((groups, call) => {
      const endpoint = call.endpoint || 'unknown';
      if (!groups[endpoint]) {
        groups[endpoint] = { calls: 0, avgResponseTime: 0, errorRate: 0, totalDuration: 0 };
      }
      groups[endpoint].calls++;
      groups[endpoint].totalDuration += call.duration;
      if (!call.success) groups[endpoint].errorRate++;
      return groups;
    }, {} as Record<string, any>);
    
    // Calculate averages for endpoints
    Object.keys(byEndpoint).forEach(endpoint => {
      const stats = byEndpoint[endpoint];
      stats.avgResponseTime = stats.totalDuration / stats.calls;
      stats.errorRate = (stats.errorRate / stats.calls) * 100;
      delete stats.totalDuration;
    });
    
    // Group by status code
    const byStatusCode = filteredCalls.reduce((groups, call) => {
      const code = call.statusCode?.toString() || 'unknown';
      groups[code] = (groups[code] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
    
    // Get recent errors
    const recentErrors = filteredCalls
      .filter(call => !call.success)
      .slice(-10)
      .map(call => ({
        timestamp: call.timestamp,
        method: call.method,
        url: call.url,
        statusCode: call.statusCode,
        error: call.error,
        duration: call.duration
      }));
    
    const timeRangeMinutes = timeRange ? 
      (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60) : 
      60; // Default to 1 hour if no range specified
    
    return {
      totalCalls: filteredCalls.length,
      successRate: (successfulCalls.length / filteredCalls.length) * 100,
      averageResponseTime: totalDuration / filteredCalls.length,
      callsPerMinute: filteredCalls.length / timeRangeMinutes,
      errorRate: ((filteredCalls.length - successfulCalls.length) / filteredCalls.length) * 100,
      byEndpoint,
      byStatusCode,
      recentErrors
    };
  }
  
  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    const memUsage = process.memoryUsage();
    const now = new Date();
    
    // Calculate calls in the last minute
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const recentCalls = this.calls.filter(call => call.timestamp >= oneMinuteAgo);
    const failedCalls = recentCalls.filter(call => !call.success);
    const avgResponseTime = recentCalls.length > 0 ? 
      recentCalls.reduce((sum, call) => sum + call.duration, 0) / recentCalls.length : 0;
    
    const memoryPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    const metrics: SystemMetrics = {
      timestamp: now,
      memoryUsage: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: memoryPercentage
      },
      apiCallsPerMinute: recentCalls.length,
      errorRate: recentCalls.length > 0 ? (failedCalls.length / recentCalls.length) * 100 : 0,
      averageResponseTime: avgResponseTime,
      activeOperations: performanceTracker.getActiveOperations().length
    };
    
    this.systemMetrics.push(metrics);
    
    // Check for system-level alerts (only after startup stabilization)
    if (this.startMemoryMonitoring && memoryPercentage > this.thresholds.memoryUsage) {
      this.createAlert({
        severity: 'warning',
        type: 'memory',
        message: `High memory usage detected: ${memoryPercentage.toFixed(1)}%`,
        value: memoryPercentage,
        threshold: this.thresholds.memoryUsage,
      });
    }
    
    // Rotate stored metrics
    if (this.systemMetrics.length > this.maxStoredMetrics) {
      this.systemMetrics = this.systemMetrics.slice(-this.maxStoredMetrics);
    }
    
    // Auto-resolve alerts
    this.autoResolveAlerts();
    
    // Log system health periodically
    if (now.getMinutes() % 15 === 0) { // Every 15 minutes
      logger.info('System health check', {
        memoryUsage: `${metrics.memoryUsage.percentage.toFixed(1)}%`,
        apiCallsPerMinute: metrics.apiCallsPerMinute,
        errorRate: `${metrics.errorRate.toFixed(1)}%`,
        averageResponseTime: `${metrics.averageResponseTime.toFixed(0)}ms`,
        activeOperations: metrics.activeOperations
      });
    }
  }
  
  /**
   * Auto-resolve alerts when conditions improve
   */
  private autoResolveAlerts(): void {
    const unresolvedAlerts = this.alerts.filter(alert => !alert.resolved);
    
    unresolvedAlerts.forEach(alert => {
      let shouldResolve = false;
      
      if (alert.type === 'error_rate' && alert.endpoint) {
        const key = `GET:${alert.endpoint}`; // Could be improved to track method
        const health = this.endpointHealth.get(key);
        if (health && health.errorRate <= this.thresholds.errorRate) {
          shouldResolve = true;
        }
      } else if (alert.type === 'memory') {
        const latestMetrics = this.getCurrentHealth();
        if (latestMetrics && latestMetrics.memoryUsage.percentage <= this.thresholds.memoryUsage) {
          shouldResolve = true;
        }
      }
      
      if (shouldResolve) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
        console.log(`Auto-resolved alert: ${alert.message}`);
      }
    });
  }
  
  /**
   * Get system metrics
   */
  getSystemMetrics(timeRange?: { start: Date; end: Date }): SystemMetrics[] {
    if (timeRange) {
      return this.systemMetrics.filter(metric => 
        metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
      );
    }
    return this.systemMetrics;
  }
  
  /**
   * Get the latest system health
   */
  getCurrentHealth(): SystemMetrics | null {
    return this.systemMetrics.length > 0 ? this.systemMetrics[this.systemMetrics.length - 1] : null;
  }
  
  /**
   * Get slow endpoints (above threshold)
   */
  getSlowEndpoints(thresholdMs: number = 1000): Array<{
    endpoint: string;
    averageResponseTime: number;
    callCount: number;
    slowCallPercentage: number;
  }> {
    const endpointStats = this.calls.reduce((stats, call) => {
      const endpoint = call.endpoint || 'unknown';
      if (!stats[endpoint]) {
        stats[endpoint] = { totalTime: 0, calls: 0, slowCalls: 0 };
      }
      stats[endpoint].totalTime += call.duration;
      stats[endpoint].calls++;
      if (call.duration > thresholdMs) {
        stats[endpoint].slowCalls++;
      }
      return stats;
    }, {} as Record<string, { totalTime: number; calls: number; slowCalls: number }>);
    
    return Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        averageResponseTime: stats.totalTime / stats.calls,
        callCount: stats.calls,
        slowCallPercentage: (stats.slowCalls / stats.calls) * 100
      }))
      .filter(stat => stat.averageResponseTime > thresholdMs)
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime);
  }
  
  /**
   * Get error analysis
   */
  getErrorAnalysis(): Array<{
    error: string;
    count: number;
    percentage: number;
    endpoints: string[];
  }> {
    const failedCalls = this.calls.filter(call => !call.success);
    
    if (failedCalls.length === 0) return [];
    
    const errorGroups = failedCalls.reduce((groups, call) => {
      const error = call.error || 'Unknown error';
      if (!groups[error]) {
        groups[error] = { count: 0, endpoints: new Set<string>() };
      }
      groups[error].count++;
      groups[error].endpoints.add(call.endpoint || 'unknown');
      return groups;
    }, {} as Record<string, { count: number; endpoints: Set<string> }>);
    
    return Object.entries(errorGroups)
      .map(([error, stats]) => ({
        error,
        count: stats.count,
        percentage: (stats.count / failedCalls.length) * 100,
        endpoints: Array.from(stats.endpoints)
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Calculate success rate for an endpoint
   */
  private calculateSuccessRate(endpointKey: string): number {
    const calls = this.getCallsForEndpoint(endpointKey);
    if (calls.length === 0) return 100;
    
    const successfulCalls = calls.filter(call => call.success).length;
    return (successfulCalls / calls.length) * 100;
  }

  /**
   * Calculate error rate for an endpoint
   */
  private calculateErrorRate(endpointKey: string): number {
    return 100 - this.calculateSuccessRate(endpointKey);
  }

  /**
   * Calculate average response time for an endpoint
   */
  private calculateAverageResponseTime(endpointKey: string): number {
    const calls = this.getCallsForEndpoint(endpointKey);
    if (calls.length === 0) return 0;
    
    const totalTime = calls.reduce((sum, call) => sum + call.duration, 0);
    return totalTime / calls.length;
  }

  /**
   * Calculate percentile response time for an endpoint
   */
  private calculatePercentile(endpointKey: string, percentile: number): number {
    const calls = this.getCallsForEndpoint(endpointKey);
    if (calls.length === 0) return 0;
    
    const responseTimes = calls.map(call => call.duration).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * responseTimes.length) - 1;
    return responseTimes[index] || 0;
  }

  /**
   * Calculate requests per minute for an endpoint
   */
  private calculateRequestsPerMinute(endpointKey: string): number {
    const oneMinuteAgo = Date.now() - 60000;
    const calls = this.getCallsForEndpoint(endpointKey);
    const recentCalls = calls.filter(call => call.timestamp.getTime() > oneMinuteAgo);
    return recentCalls.length;
  }

  /**
   * Get calls for a specific endpoint
   */
  private getCallsForEndpoint(endpointKey: string): APICall[] {
    const [method, endpoint] = endpointKey.split(':');
    return this.calls.filter(call => call.method === method && call.endpoint === endpoint);
  }

  /**
   * Get API monitoring dashboard data
   */
  public getDashboardData() {
    const overallMetrics = this.getOverallMetrics();
    const endpointHealth = this.getEndpointHealthSummary();
    const recentCalls = this.getRecentCalls(50);
    const activeAlerts = this.getActiveAlerts();
    const timeSeriesData = this.getTimeSeriesData(24);
    const slowestEndpoints = this.getSlowestEndpoints(10);
    
    return {
      overview: {
        uptime: Date.now() - this.startTime,
        totalRequests: this.calls.length,
        requestsPerMinute: overallMetrics.apiCallsPerMinute,
        averageResponseTime: overallMetrics.averageResponseTime,
        errorRate: overallMetrics.errorRate,
        successRate: 100 - overallMetrics.errorRate,
        memoryUsage: overallMetrics.memoryUsage,
      },
      endpoints: endpointHealth,
      recentCalls,
      alerts: activeAlerts,
      charts: {
        timeSeries: timeSeriesData,
        slowestEndpoints,
        errorsByEndpoint: this.getErrorsByEndpoint(),
        requestsByMethod: this.getRequestsByMethod(),
      },
      sla: this.getSLAMetrics(),
    };
  }

  /**
   * Get overall API metrics
   */
  private getOverallMetrics() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentCalls = this.calls.filter(call => call.timestamp.getTime() > oneMinuteAgo);
    
    const totalCalls = this.calls.length;
    const successfulCalls = this.calls.filter(call => call.success).length;
    const avgResponseTime = totalCalls > 0 ? 
      this.calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls : 0;

    return {
      apiCallsPerMinute: recentCalls.length,
      averageResponseTime: avgResponseTime,
      errorRate: totalCalls > 0 ? ((totalCalls - successfulCalls) / totalCalls) * 100 : 0,
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Get endpoint health summary
   */
  public getEndpointHealthSummary(): EndpointHealth[] {
    return Array.from(this.endpointHealth.values())
      .sort((a, b) => b.totalRequests - a.totalRequests);
  }

  /**
   * Get recent API calls
   */
  public getRecentCalls(limit = 100): APICall[] {
    return this.calls
      .slice(-limit)
      .reverse(); // Most recent first
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): APIAlert[] {
    return this.alerts
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get all alerts
   */
  public getAllAlerts(): APIAlert[] {
    return this.alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Resolve an alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      this.saveData();
      return true;
    }
    return false;
  }

  /**
   * Get time series data for charts
   */
  public getTimeSeriesData(hours = 24): Array<{
    timestamp: string;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
  }> {
    const now = Date.now();
    const hoursAgo = now - (hours * 60 * 60 * 1000);
    const relevantCalls = this.calls.filter(call => call.timestamp.getTime() > hoursAgo);
    
    // Group by 5-minute intervals for better visualization
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const intervals: { [key: string]: APICall[] } = {};
    
    relevantCalls.forEach(call => {
      const intervalStart = Math.floor(call.timestamp.getTime() / intervalMs) * intervalMs;
      const key = new Date(intervalStart).toISOString();
      
      if (!intervals[key]) {
        intervals[key] = [];
      }
      intervals[key].push(call);
    });

    return Object.entries(intervals)
      .map(([timestamp, calls]) => ({
        timestamp,
        requestsPerMinute: (calls.length / 5), // Normalize to per-minute
        averageResponseTime: calls.reduce((sum, call) => sum + call.duration, 0) / calls.length,
        errorRate: (calls.filter(call => !call.success).length / calls.length) * 100,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Get slowest endpoints
   */
  public getSlowestEndpoints(limit = 10): Array<{
    endpoint: string;
    method: string;
    averageResponseTime: number;
    totalRequests: number;
  }> {
    return Array.from(this.endpointHealth.values())
      .filter(health => health.totalRequests > 5) // Only include endpoints with meaningful traffic
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime)
      .slice(0, limit)
      .map(health => ({
        endpoint: health.endpoint,
        method: health.method,
        averageResponseTime: health.averageResponseTime,
        totalRequests: health.totalRequests,
      }));
  }

  /**
   * Get errors by endpoint
   */
  public getErrorsByEndpoint(): Array<{
    endpoint: string;
    errorCount: number;
    errorRate: number;
  }> {
    const endpointErrors: { [key: string]: { total: number; errors: number } } = {};
    
    this.calls.forEach(call => {
      const endpoint = call.endpoint || 'unknown';
      if (!endpointErrors[endpoint]) {
        endpointErrors[endpoint] = { total: 0, errors: 0 };
      }
      endpointErrors[endpoint].total++;
      if (!call.success) {
        endpointErrors[endpoint].errors++;
      }
    });

    return Object.entries(endpointErrors)
      .map(([endpoint, stats]) => ({
        endpoint,
        errorCount: stats.errors,
        errorRate: (stats.errors / stats.total) * 100,
      }))
      .filter(stat => stat.errorCount > 0)
      .sort((a, b) => b.errorCount - a.errorCount);
  }

  /**
   * Get requests by HTTP method
   */
  public getRequestsByMethod(): Array<{
    method: string;
    count: number;
    percentage: number;
  }> {
    const methodCounts: { [key: string]: number } = {};
    
    this.calls.forEach(call => {
      methodCounts[call.method] = (methodCounts[call.method] || 0) + 1;
    });

    const total = this.calls.length;
    return Object.entries(methodCounts)
      .map(([method, count]) => ({
        method,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get SLA metrics
   */
  public getSLAMetrics(): SLAMetrics {
    const uptime = Date.now() - this.startTime;
    const totalRequests = this.calls.length;
    const failedRequests = this.calls.filter(call => !call.success).length;
    const actualUptime = totalRequests > 0 ? ((totalRequests - failedRequests) / totalRequests) * 100 : 100;
    
    // Count breaches (simplified - could be more sophisticated)
    const breaches = this.alerts.filter(alert => 
      alert.type === 'error_rate' || alert.type === 'latency'
    ).length;
    
    return {
      sloTarget: 99.9,
      actualUptime,
      breachCount: breaches,
      mttr: 0, // Would need to calculate based on alert resolution times
      mtbf: uptime / Math.max(breaches, 1), // Mean time between failures
    };
  }

  /**
   * Save monitoring data to disk
   */
  private async saveData(): Promise<void> {
    try {
      const data = {
        calls: this.calls.slice(-1000), // Keep last 1000 calls
        alerts: this.alerts,
        endpointHealth: Array.from(this.endpointHealth.entries()),
        systemMetrics: this.systemMetrics.slice(-100), // Keep last 100 metrics
        startTime: this.startTime,
      };
      
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save API monitoring data:', error);
    }
  }

  /**
   * Load monitoring data from disk
   */
  private async loadStoredData(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const parsed = JSON.parse(data);
      
      this.calls = parsed.calls?.map((call: any) => ({
        ...call,
        timestamp: new Date(call.timestamp),
      })) || [];
      
      this.alerts = parsed.alerts?.map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp),
        resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined,
      })) || [];
      
      this.endpointHealth = new Map(parsed.endpointHealth || []);
      
      this.systemMetrics = parsed.systemMetrics?.map((metric: any) => ({
        ...metric,
        timestamp: new Date(metric.timestamp),
      })) || [];
      
      this.startTime = parsed.startTime || Date.now();
      
    } catch (error) {
      // File doesn't exist or is corrupted, start fresh
      console.log('Starting with fresh API monitoring data');
    }
  }
}

// Export singleton instance
export const apiMonitoringService = new APIMonitoringService();
