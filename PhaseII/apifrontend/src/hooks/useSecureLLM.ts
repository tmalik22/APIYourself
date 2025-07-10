import { useState, useCallback } from 'react';
import { LLMSecurityGuard, LLMRateLimiter, LLMInteractionContext, SecurityViolation } from '../components/LLMSecurityGuard';

export interface SecureLLMConfig {
  apiEndpoint?: string;
  ollamaEndpoint?: string;
  model: string;
  provider: 'ollama' | 'api' | 'openai';
}

export interface SecureLLMResponse {
  success: boolean;
  content?: string;
  violations?: SecurityViolation[];
  rateLimited?: boolean;
  error?: string;
}

export function useSecureLLM(userId: string, sessionId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<SecureLLMResponse | null>(null);

  const secureLLMCall = useCallback(async (
    input: string,
    taskType: 'API_CREATION' | 'CODE_GENERATION' | 'DOCUMENTATION' | 'TESTING',
    config: SecureLLMConfig
  ): Promise<SecureLLMResponse> => {
    setIsLoading(true);
    
    try {
      // Check rate limits first
      const rateLimitCheck = LLMRateLimiter.checkRateLimit(userId);
      if (!rateLimitCheck.allowed) {
        const response: SecureLLMResponse = {
          success: false,
          rateLimited: true,
          error: `Rate limit exceeded. Try again after ${new Date(rateLimitCheck.resetTime!).toLocaleTimeString()}`
        };
        setLastResponse(response);
        return response;
      }

      // Create secure context
      const context: LLMInteractionContext = {
        userId,
        sessionId,
        taskType,
        allowedOperations: getOperationsForTask(taskType)
      };

      // Use the security guard to make a safe LLM call
      const result = await LLMSecurityGuard.secureLLMCall(
        input,
        context,
        (securePrompt) => callLLMProvider(securePrompt, config)
      );

      const response: SecureLLMResponse = {
        success: result.success,
        content: result.output,
        violations: result.violations
      };

      setLastResponse(response);
      return response;

    } catch (error) {
      const response: SecureLLMResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      setLastResponse(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [userId, sessionId]);

  return {
    secureLLMCall,
    isLoading,
    lastResponse
  };
}

// Helper function to get allowed operations for each task type
function getOperationsForTask(taskType: string): string[] {
  switch (taskType) {
    case 'API_CREATION':
      return [
        'create_endpoint',
        'define_route',
        'set_http_method',
        'create_model',
        'add_validation',
        'configure_middleware'
      ];
    case 'CODE_GENERATION':
      return [
        'generate_controller',
        'create_service',
        'generate_middleware',
        'create_utility',
        'generate_types',
        'create_config'
      ];
    case 'DOCUMENTATION':
      return [
        'generate_api_docs',
        'create_readme',
        'document_endpoint',
        'create_examples',
        'generate_openapi'
      ];
    case 'TESTING':
      return [
        'create_unit_test',
        'generate_integration_test',
        'create_mock_data',
        'generate_test_cases'
      ];
    default:
      return [];
  }
}

// LLM Provider interface - handles different LLM sources securely
async function callLLMProvider(prompt: string, config: SecureLLMConfig): Promise<string> {
  switch (config.provider) {
    case 'ollama':
      return await callOllama(prompt, config);
    case 'api':
      return await callAPIProvider(prompt, config);
    case 'openai':
      return await callOpenAI(prompt, config);
    default:
      throw new Error('Invalid LLM provider specified');
  }
}

// Ollama integration with security constraints
async function callOllama(prompt: string, config: SecureLLMConfig): Promise<string> {
  if (!config.ollamaEndpoint) {
    throw new Error('Ollama endpoint not configured');
  }

  // Validate Ollama endpoint is localhost only for security
  const url = new URL(config.ollamaEndpoint);
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error('Ollama endpoint must be localhost for security');
  }

  const response = await fetch(`${config.ollamaEndpoint}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000, // Limit output length for security
        stop: ['</end>', '<|endoftext|>', 'SYSTEM:'] // Prevent prompt leakage
      }
    }),
    // Security: timeout to prevent hanging
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response || '';
}

// API provider with strict security (works with DeepSeek, OpenAI, etc.)
async function callAPIProvider(prompt: string, config: SecureLLMConfig): Promise<string> {
  const apiEndpoint = config.apiEndpoint || process.env.VITE_LLM_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions';
  
  if (!apiEndpoint) {
    throw new Error('API endpoint not configured');
  }

  // Get API key from environment or config
  const apiKey = process.env.VITE_LLM_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please set VITE_LLM_API_KEY or VITE_OPENAI_API_KEY in your environment.');
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a secure API creation assistant. Follow all security constraints strictly. Only help with API design, data models, and code generation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API provider error: ${response.status} ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// OpenAI integration (if enabled)
async function callOpenAI(prompt: string, config: SecureLLMConfig): Promise<string> {
  // Only allow if explicitly enabled and properly configured
  if (!process.env.VITE_OPENAI_ENABLED) {
    throw new Error('OpenAI integration not enabled');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a secure API creation assistant. Follow all security constraints strictly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
