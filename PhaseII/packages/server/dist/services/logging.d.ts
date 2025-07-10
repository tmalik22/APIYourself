import winston from 'winston';
declare const logger: winston.Logger;
export interface EvaluationMetrics {
    operation: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    success: boolean;
    userId?: string;
    traceId: string;
    metadata?: Record<string, any>;
    error?: Error;
}
export declare class PerformanceTracker {
    private metrics;
    startOperation(operation: string, userId?: string, metadata?: Record<string, any>): string;
    endOperation(traceId: string, success: boolean, error?: Error, additionalMetadata?: Record<string, any>): EvaluationMetrics | null;
    getActiveOperations(): EvaluationMetrics[];
    getMetrics(traceId: string): EvaluationMetrics | undefined;
}
export declare const performanceTracker: PerformanceTracker;
export { logger };
export declare function trackOperation<T>(operation: string, fn: (traceId: string) => Promise<T>, userId?: string, metadata?: Record<string, any>): Promise<T>;
//# sourceMappingURL=logging.d.ts.map