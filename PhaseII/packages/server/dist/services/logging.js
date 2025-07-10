"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.performanceTracker = exports.PerformanceTracker = void 0;
exports.trackOperation = trackOperation;
const winston_1 = __importDefault(require("winston"));
const uuid_1 = require("uuid");
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
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => {
    const { timestamp, level, message, traceId, userId, operation, duration, ...extra } = info;
    let logMessage = `${timestamp} [${level}]`;
    if (traceId)
        logMessage += ` [${traceId}]`;
    if (userId)
        logMessage += ` [user:${userId}]`;
    if (operation)
        logMessage += ` [${operation}]`;
    if (duration)
        logMessage += ` [${duration}ms]`;
    logMessage += `: ${message}`;
    if (Object.keys(extra).length > 0) {
        logMessage += ` ${JSON.stringify(extra)}`;
    }
    return logMessage;
}));
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});
exports.logger = logger;
// Performance tracker
class PerformanceTracker {
    constructor() {
        this.metrics = new Map();
    }
    startOperation(operation, userId, metadata) {
        const traceId = (0, uuid_1.v4)();
        const metrics = {
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
    endOperation(traceId, success, error, additionalMetadata) {
        const metrics = this.metrics.get(traceId);
        if (!metrics) {
            logger.warn(`No metrics found for traceId: ${traceId}`);
            return null;
        }
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        metrics.success = success;
        if (error)
            metrics.error = error;
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
        }
        else {
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
    getActiveOperations() {
        return Array.from(this.metrics.values());
    }
    getMetrics(traceId) {
        return this.metrics.get(traceId);
    }
}
exports.PerformanceTracker = PerformanceTracker;
// Export singleton instances
exports.performanceTracker = new PerformanceTracker();
// Helper function for async operation tracking
async function trackOperation(operation, fn, userId, metadata) {
    const traceId = exports.performanceTracker.startOperation(operation, userId, metadata);
    try {
        const result = await fn(traceId);
        exports.performanceTracker.endOperation(traceId, true);
        return result;
    }
    catch (error) {
        exports.performanceTracker.endOperation(traceId, false, error);
        throw error;
    }
}
//# sourceMappingURL=logging.js.map