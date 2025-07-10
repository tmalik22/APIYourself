// Minimal LLM evaluation service - not used for API monitoring
// This is kept for compatibility but not actively used

export interface LLMCall {
  id: string;
  model: string;
  provider: string;
  prompt: string;
  response: string;
  tokensUsed: number;
  cost: number;
  latency: number;
  timestamp: Date;
  userId?: string;
  operation: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PromptEvaluation {
  promptId: string;
  version: string;
  inputs: Record<string, any>;
  expectedOutput?: string;
  actualOutput: string;
  evaluationMetrics: {
    accuracy?: number;
    relevance?: number;
    coherence?: number;
    completeness?: number;
    customMetrics?: Record<string, number>;
  };
  feedback?: string;
  timestamp: Date;
}

export class LLMEvaluationService {
  private calls: LLMCall[] = [];
  private evaluations: PromptEvaluation[] = [];
  private readonly maxStoredCalls = 1000;
  
  constructor() {
    console.log('LLM Evaluation Service initialized (placeholder)');
  }
  
  trackLLMCall(call: LLMCall): void {
    this.calls.push(call);
    if (this.calls.length > this.maxStoredCalls) {
      this.calls.shift();
    }
  }
  
  getStats() {
    return {
      totalCalls: this.calls.length,
      successRate: this.calls.length > 0 ? 
        (this.calls.filter(c => c.success).length / this.calls.length) * 100 : 100,
      averageLatency: this.calls.length > 0 ? 
        this.calls.reduce((sum, c) => sum + c.latency, 0) / this.calls.length : 0,
      totalCost: this.calls.reduce((sum, c) => sum + c.cost, 0),
      totalTokens: this.calls.reduce((sum, c) => sum + c.tokensUsed, 0),
    };
  }
}

export const llmEvaluationService = new LLMEvaluationService();