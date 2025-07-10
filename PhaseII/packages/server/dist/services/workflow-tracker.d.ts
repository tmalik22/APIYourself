export interface WorkflowStep {
    id: string;
    traceId: string;
    name: string;
    operation: string;
    phase: 'api-generation' | 'code-generation' | 'plugin-execution' | 'validation' | 'deployment';
    startTime: Date;
    endTime?: Date;
    duration?: number;
    success?: boolean;
    error?: string;
    metadata?: Record<string, any>;
    parentStepId?: string;
    childSteps?: WorkflowStep[];
    userId?: string;
    projectId?: string;
}
export interface WorkflowContext {
    traceId: string;
    userId?: string;
    projectId?: string;
    operation: string;
    metadata?: Record<string, any>;
}
export declare class WorkflowTracker {
    private activeSteps;
    private completedSteps;
    private readonly maxStoredSteps;
    /**
     * Start tracking a workflow step
     */
    startStep(name: string, operation: string, phase: WorkflowStep['phase'], context: WorkflowContext, parentStepId?: string): string;
    /**
     * Complete a workflow step successfully
     */
    completeStep(stepId: string, result?: any): void;
    /**
     * Fail a workflow step
     */
    failStep(stepId: string, error: string | Error): void;
    /**
     * Add nested step tracking
     */
    addChildStep(parentStepId: string, childStep: WorkflowStep): void;
    /**
     * Get workflow steps by trace ID
     */
    getStepsByTraceId(traceId: string): WorkflowStep[];
    /**
     * Get workflow steps by operation type
     */
    getStepsByOperation(operation: string, limit?: number): WorkflowStep[];
    /**
     * Get workflow analysis for broken step detection
     */
    getWorkflowAnalysis(): {
        operationStats: Record<string, {
            total: number;
            successful: number;
            failed: number;
            successRate: number;
            averageDuration: number;
            commonErrors: string[];
        }>;
        phaseStats: Record<string, {
            total: number;
            successful: number;
            failed: number;
            successRate: number;
        }>;
        brokenSteps: Array<{
            operation: string;
            phase: string;
            failureRate: number;
            commonErrors: string[];
            affectedTraces: string[];
            recommendations: string[];
        }>;
    };
    /**
     * Create a new workflow context
     */
    createContext(operation: string, userId?: string, projectId?: string, metadata?: Record<string, any>): WorkflowContext;
    /**
     * Get active steps count
     */
    getActiveStepsCount(): number;
    /**
     * Get all completed steps (for dashboard)
     */
    getCompletedSteps(limit?: number): WorkflowStep[];
    private addCompletedStep;
    private getCommonErrors;
    private generateRecommendations;
}
export declare const workflowTracker: WorkflowTracker;
//# sourceMappingURL=workflow-tracker.d.ts.map