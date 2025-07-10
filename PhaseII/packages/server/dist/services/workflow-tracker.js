"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowTracker = exports.WorkflowTracker = void 0;
const uuid_1 = require("uuid");
const logging_js_1 = require("./logging.js");
class WorkflowTracker {
    constructor() {
        this.activeSteps = new Map();
        this.completedSteps = [];
        this.maxStoredSteps = 10000;
    }
    /**
     * Start tracking a workflow step
     */
    startStep(name, operation, phase, context, parentStepId) {
        const stepId = (0, uuid_1.v4)();
        const step = {
            id: stepId,
            traceId: context.traceId,
            name,
            operation,
            phase,
            startTime: new Date(),
            userId: context.userId,
            projectId: context.projectId,
            parentStepId,
            metadata: context.metadata,
        };
        this.activeSteps.set(stepId, step);
        logging_js_1.logger.info('Workflow step started', {
            stepId,
            traceId: context.traceId,
            name,
            operation,
            phase,
            parentStepId,
        });
        return stepId;
    }
    /**
     * Complete a workflow step successfully
     */
    completeStep(stepId, result) {
        const step = this.activeSteps.get(stepId);
        if (!step) {
            logging_js_1.logger.warn('Attempted to complete non-existent step', { stepId });
            return;
        }
        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        step.success = true;
        if (result) {
            step.metadata = { ...step.metadata, result };
        }
        this.activeSteps.delete(stepId);
        this.addCompletedStep(step);
        logging_js_1.logger.info('Workflow step completed', {
            stepId,
            traceId: step.traceId,
            name: step.name,
            duration: step.duration,
            success: true,
        });
        // Log performance metrics
        logging_js_1.logger.info('Workflow step performance', {
            operation: step.operation,
            duration: step.duration,
            traceId: step.traceId,
        });
    }
    /**
     * Fail a workflow step
     */
    failStep(stepId, error) {
        const step = this.activeSteps.get(stepId);
        if (!step) {
            logging_js_1.logger.warn('Attempted to fail non-existent step', { stepId });
            return;
        }
        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        step.success = false;
        step.error = error instanceof Error ? error.message : error;
        this.activeSteps.delete(stepId);
        this.addCompletedStep(step);
        logging_js_1.logger.error('Workflow step failed', {
            stepId,
            traceId: step.traceId,
            name: step.name,
            duration: step.duration,
            error: step.error,
        });
        // Log performance metrics for failed operations
        logging_js_1.logger.error('Workflow step failed performance', {
            operation: `${step.operation}_failed`,
            duration: step.duration,
            traceId: step.traceId,
            error: step.error,
        });
    }
    /**
     * Add nested step tracking
     */
    addChildStep(parentStepId, childStep) {
        const parentStep = this.activeSteps.get(parentStepId) ||
            this.completedSteps.find(s => s.id === parentStepId);
        if (parentStep) {
            if (!parentStep.childSteps) {
                parentStep.childSteps = [];
            }
            parentStep.childSteps.push(childStep);
            childStep.parentStepId = parentStepId;
        }
    }
    /**
     * Get workflow steps by trace ID
     */
    getStepsByTraceId(traceId) {
        const active = Array.from(this.activeSteps.values()).filter(s => s.traceId === traceId);
        const completed = this.completedSteps.filter(s => s.traceId === traceId);
        return [...active, ...completed].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
    /**
     * Get workflow steps by operation type
     */
    getStepsByOperation(operation, limit = 100) {
        return this.completedSteps
            .filter(s => s.operation === operation)
            .slice(-limit)
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }
    /**
     * Get workflow analysis for broken step detection
     */
    getWorkflowAnalysis() {
        const operationStats = {};
        const phaseStats = {};
        // Analyze completed steps
        for (const step of this.completedSteps) {
            // Operation stats
            if (!operationStats[step.operation]) {
                operationStats[step.operation] = {
                    total: 0,
                    successful: 0,
                    failed: 0,
                    durations: [],
                    errors: [],
                };
            }
            const opStat = operationStats[step.operation];
            opStat.total++;
            if (step.success) {
                opStat.successful++;
            }
            else {
                opStat.failed++;
                if (step.error) {
                    opStat.errors.push(step.error);
                }
            }
            if (step.duration) {
                opStat.durations.push(step.duration);
            }
            // Phase stats
            if (!phaseStats[step.phase]) {
                phaseStats[step.phase] = {
                    total: 0,
                    successful: 0,
                    failed: 0,
                };
            }
            const phaseStat = phaseStats[step.phase];
            phaseStat.total++;
            if (step.success) {
                phaseStat.successful++;
            }
            else {
                phaseStat.failed++;
            }
        }
        // Calculate derived metrics
        for (const [operation, stats] of Object.entries(operationStats)) {
            const typedStats = stats;
            typedStats.successRate = typedStats.total > 0 ? typedStats.successful / typedStats.total : 0;
            typedStats.averageDuration = typedStats.durations.length > 0
                ? typedStats.durations.reduce((a, b) => a + b, 0) / typedStats.durations.length
                : 0;
            typedStats.commonErrors = this.getCommonErrors(typedStats.errors);
            delete typedStats.durations;
            delete typedStats.errors;
        }
        for (const [phase, stats] of Object.entries(phaseStats)) {
            const typedStats = stats;
            typedStats.successRate = typedStats.total > 0 ? typedStats.successful / typedStats.total : 0;
        }
        // Identify broken steps (failure rate > 20%)
        const brokenSteps = [];
        for (const [operation, stats] of Object.entries(operationStats)) {
            const typedStats = stats;
            if (typedStats.successRate < 0.8 && typedStats.total >= 5) {
                const affectedTraces = this.completedSteps
                    .filter(s => s.operation === operation && !s.success)
                    .map(s => s.traceId)
                    .slice(0, 10);
                brokenSteps.push({
                    operation,
                    phase: this.completedSteps.find(s => s.operation === operation)?.phase || 'unknown',
                    failureRate: 1 - typedStats.successRate,
                    commonErrors: typedStats.commonErrors,
                    affectedTraces,
                    recommendations: this.generateRecommendations(operation, typedStats),
                });
            }
        }
        return {
            operationStats,
            phaseStats,
            brokenSteps,
        };
    }
    /**
     * Create a new workflow context
     */
    createContext(operation, userId, projectId, metadata) {
        return {
            traceId: (0, uuid_1.v4)(),
            operation,
            userId,
            projectId,
            metadata,
        };
    }
    /**
     * Get active steps count
     */
    getActiveStepsCount() {
        return this.activeSteps.size;
    }
    /**
     * Get all completed steps (for dashboard)
     */
    getCompletedSteps(limit = 1000) {
        return this.completedSteps.slice(-limit);
    }
    addCompletedStep(step) {
        this.completedSteps.push(step);
        // Keep only the most recent steps
        if (this.completedSteps.length > this.maxStoredSteps) {
            this.completedSteps.splice(0, this.completedSteps.length - this.maxStoredSteps);
        }
    }
    getCommonErrors(errors) {
        const errorCounts = errors.reduce((acc, error) => {
            acc[error] = (acc[error] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(errorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([error]) => error);
    }
    generateRecommendations(operation, stats) {
        const recommendations = [];
        if (stats.averageDuration > 5000) {
            recommendations.push('Consider optimizing performance - average duration exceeds 5 seconds');
        }
        if (stats.commonErrors.some((error) => error.includes('timeout'))) {
            recommendations.push('Increase timeout limits or optimize external API calls');
        }
        if (stats.commonErrors.some((error) => error.includes('API key') || error.includes('authentication'))) {
            recommendations.push('Check API key configuration and authentication setup');
        }
        if (stats.commonErrors.some((error) => error.includes('rate limit'))) {
            recommendations.push('Implement rate limiting and retry logic');
        }
        if (operation.includes('generation') && stats.failureRate > 0.5) {
            recommendations.push('Review prompt templates and model configuration');
        }
        if (recommendations.length === 0) {
            recommendations.push('Review error logs and implement specific error handling for this operation');
        }
        return recommendations;
    }
}
exports.WorkflowTracker = WorkflowTracker;
// Global workflow tracker instance
exports.workflowTracker = new WorkflowTracker();
//# sourceMappingURL=workflow-tracker.js.map