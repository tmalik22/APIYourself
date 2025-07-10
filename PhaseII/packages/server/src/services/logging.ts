import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Enhanced logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, traceId, userId, operation, duration, ...extra } = info;
    
    let logMessage = `${timestamp} [${level}]`;
    
    if (traceId) logMessage += ` [${traceId}]`;
    if (userId) logMessage += ` [user:${userId}]`;
    if (operation) logMessage += ` [${operation}]`;
    if (duration) logMessage += ` [${duration}ms]`;
    
    logMessage += `: ${message}`;
    
    if (Object.keys(extra).length > 0) {
      logMessage += ` ${JSON.stringify(extra)}`;
    }
    
    return logMessage;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Evaluation metrics interface
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

// Performance tracker
export class PerformanceTracker {
  private metrics: Map<string, EvaluationMetrics> = new Map();
  
  startOperation(operation: string, userId?: string, metadata?: Record<string, any>): string {
    const traceId = uuidv4();
    const metrics: EvaluationMetrics = {
      operation,
      startTime: Date.now(),
      success: false,
      userId,
      traceId,
      metadata
    };
    
    this.metrics.set(traceId, metrics);
    
    logger.info(`Started operation: ${operation}`, {
      traceId,
      userId,
      operation,
      ...metadata
    });
    
    return traceId;
  }
  
  endOperation(traceId: string, success: boolean, error?: Error, additionalMetadata?: Record<string, any>): EvaluationMetrics | null {
    const metrics = this.metrics.get(traceId);
    if (!metrics) {
      logger.warn(`No metrics found for traceId: ${traceId}`);
      return null;
    }
    
    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    metrics.success = success;
    if (error) metrics.error = error;
    if (additionalMetadata) {
      metrics.metadata = { ...metrics.metadata, ...additionalMetadata };
    }
    
    // Log the completion
    if (success) {
      logger.info(`Completed operation: ${metrics.operation}`, {
        traceId,
        userId: metrics.userId,
        operation: metrics.operation,
        duration: metrics.duration,
        ...metrics.metadata
      });
    } else {
      logger.error(`Failed operation: ${metrics.operation}`, {
        traceId,
        userId: metrics.userId,
        operation: metrics.operation,
        duration: metrics.duration,
        error: error?.message,
        stack: error?.stack,
        ...metrics.metadata
      });
    }
    
    // Clean up from memory after logging
    this.metrics.delete(traceId);
    
    return metrics;
  }
  
  getActiveOperations(): EvaluationMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  getMetrics(traceId: string): EvaluationMetrics | undefined {
    return this.metrics.get(traceId);
  }
}

// Export singleton instances
export const performanceTracker = new PerformanceTracker();
export { logger };

// Helper function for async operation tracking
export async function trackOperation<T>(
  operation: string,
  fn: (traceId: string) => Promise<T>,
  userId?: string,
  metadata?: Record<string, any>
): Promise<T> {
  const traceId = performanceTracker.startOperation(operation, userId, metadata);
  
  try {
    const result = await fn(traceId);
    performanceTracker.endOperation(traceId, true);
    return result;
  } catch (error) {
    performanceTracker.endOperation(traceId, false, error as Error);
    throw error;
  }
}
