import { Request, Response, NextFunction } from 'express';
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
}
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
export declare class APIMonitoringService {
    private calls;
    private readonly maxStoredCalls;
    private systemMetrics;
    private readonly maxStoredMetrics;
    constructor();
    /**
     * Express middleware for monitoring API calls
     */
    middleware(): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Track an API call
     */
    private trackAPICall;
    /**
     * Get API call statistics
     */
    getAPIStats(timeRange?: {
        start: Date;
        end: Date;
    }): {
        totalCalls: number;
        successRate: number;
        averageResponseTime: number;
        callsPerMinute: number;
        errorRate: number;
        byEndpoint: Record<string, any>;
        byStatusCode: Record<string, number>;
        recentErrors: {
            timestamp: Date;
            method: string;
            url: string;
            statusCode: number | undefined;
            error: string | undefined;
            duration: number;
        }[];
    };
    /**
     * Collect system metrics
     */
    private collectSystemMetrics;
    /**
     * Get system metrics
     */
    getSystemMetrics(timeRange?: {
        start: Date;
        end: Date;
    }): SystemMetrics[];
    /**
     * Get the latest system health
     */
    getCurrentHealth(): SystemMetrics | null;
    /**
     * Get slow endpoints (above threshold)
     */
    getSlowEndpoints(thresholdMs?: number): Array<{
        endpoint: string;
        averageResponseTime: number;
        callCount: number;
        slowCallPercentage: number;
    }>;
    /**
     * Get error analysis
     */
    getErrorAnalysis(): Array<{
        error: string;
        count: number;
        percentage: number;
        endpoints: string[];
    }>;
}
export declare const apiMonitoringService: APIMonitoringService;
//# sourceMappingURL=api-monitoring.d.ts.map