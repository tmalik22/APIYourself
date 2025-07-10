"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiMonitoringService = exports.APIMonitoringService = void 0;
const logging_1 = require("./logging");
const uuid_1 = require("uuid");
class APIMonitoringService {
    constructor() {
        this.calls = [];
        this.maxStoredCalls = 10000; // Keep last 10k calls
        this.systemMetrics = [];
        this.maxStoredMetrics = 1440; // Keep 24 hours of minute-by-minute metrics
        // Start collecting system metrics every minute
        setInterval(() => {
            this.collectSystemMetrics();
        }, 60000); // Every minute
    }
    /**
     * Express middleware for monitoring API calls
     */
    middleware() {
        const self = this;
        return (req, res, next) => {
            const startTime = Date.now();
            const callId = (0, uuid_1.v4)();
            const traceId = logging_1.performanceTracker.startOperation(`api_${req.method}_${req.path}`, req.headers['user-id'], {
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'],
                ip: req.ip
            });
            // Add trace ID to request for downstream use
            req.headers['x-trace-id'] = traceId;
            // Listen for the response finish event
            res.on('finish', () => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const apiCall = {
                    id: callId,
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    duration,
                    timestamp: new Date(startTime),
                    userId: req.headers['user-id'],
                    userAgentInfo: req.headers['user-agent'],
                    ipAddress: req.ip,
                    success: res.statusCode < 400,
                    error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
                    endpoint: req.route?.path || req.path,
                    operation: `${req.method} ${req.path}`
                };
                // Store the call
                self.trackAPICall(apiCall);
                // End the performance tracking
                logging_1.performanceTracker.endOperation(traceId, apiCall.success, apiCall.error ? new Error(apiCall.error) : undefined);
            });
            next();
        };
    }
    /**
     * Track an API call
     */
    trackAPICall(call) {
        this.calls.push(call);
        // Rotate stored calls
        if (this.calls.length > this.maxStoredCalls) {
            this.calls = this.calls.slice(-this.maxStoredCalls);
        }
        // Log based on success/failure
        if (call.success) {
            logging_1.logger.info(`API call completed`, {
                method: call.method,
                url: call.url,
                statusCode: call.statusCode,
                duration: call.duration,
                userId: call.userId,
                traceId: call.id
            });
        }
        else {
            logging_1.logger.error(`API call failed`, {
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
     * Get API call statistics
     */
    getAPIStats(timeRange) {
        let filteredCalls = this.calls;
        if (timeRange) {
            filteredCalls = this.calls.filter(call => call.timestamp >= timeRange.start && call.timestamp <= timeRange.end);
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
            if (!call.success)
                groups[endpoint].errorRate++;
            return groups;
        }, {});
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
        }, {});
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
    collectSystemMetrics() {
        const memUsage = process.memoryUsage();
        const now = new Date();
        // Calculate calls in the last minute
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const recentCalls = this.calls.filter(call => call.timestamp >= oneMinuteAgo);
        const failedCalls = recentCalls.filter(call => !call.success);
        const avgResponseTime = recentCalls.length > 0 ?
            recentCalls.reduce((sum, call) => sum + call.duration, 0) / recentCalls.length : 0;
        const metrics = {
            timestamp: now,
            memoryUsage: {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
                percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
            },
            apiCallsPerMinute: recentCalls.length,
            errorRate: recentCalls.length > 0 ? (failedCalls.length / recentCalls.length) * 100 : 0,
            averageResponseTime: avgResponseTime,
            activeOperations: logging_1.performanceTracker.getActiveOperations().length
        };
        this.systemMetrics.push(metrics);
        // Rotate stored metrics
        if (this.systemMetrics.length > this.maxStoredMetrics) {
            this.systemMetrics = this.systemMetrics.slice(-this.maxStoredMetrics);
        }
        // Log system health periodically
        if (now.getMinutes() % 15 === 0) { // Every 15 minutes
            logging_1.logger.info('System health check', {
                memoryUsage: `${metrics.memoryUsage.percentage.toFixed(1)}%`,
                apiCallsPerMinute: metrics.apiCallsPerMinute,
                errorRate: `${metrics.errorRate.toFixed(1)}%`,
                averageResponseTime: `${metrics.averageResponseTime.toFixed(0)}ms`,
                activeOperations: metrics.activeOperations
            });
        }
    }
    /**
     * Get system metrics
     */
    getSystemMetrics(timeRange) {
        if (timeRange) {
            return this.systemMetrics.filter(metric => metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end);
        }
        return this.systemMetrics;
    }
    /**
     * Get the latest system health
     */
    getCurrentHealth() {
        return this.systemMetrics.length > 0 ? this.systemMetrics[this.systemMetrics.length - 1] : null;
    }
    /**
     * Get slow endpoints (above threshold)
     */
    getSlowEndpoints(thresholdMs = 1000) {
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
        }, {});
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
    getErrorAnalysis() {
        const failedCalls = this.calls.filter(call => !call.success);
        if (failedCalls.length === 0)
            return [];
        const errorGroups = failedCalls.reduce((groups, call) => {
            const error = call.error || 'Unknown error';
            if (!groups[error]) {
                groups[error] = { count: 0, endpoints: new Set() };
            }
            groups[error].count++;
            groups[error].endpoints.add(call.endpoint || 'unknown');
            return groups;
        }, {});
        return Object.entries(errorGroups)
            .map(([error, stats]) => ({
            error,
            count: stats.count,
            percentage: (stats.count / failedCalls.length) * 100,
            endpoints: Array.from(stats.endpoints)
        }))
            .sort((a, b) => b.count - a.count);
    }
}
exports.APIMonitoringService = APIMonitoringService;
// Export singleton instance
exports.apiMonitoringService = new APIMonitoringService();
//# sourceMappingURL=api-monitoring.js.map