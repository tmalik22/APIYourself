# LLM Security & Integration Guide

This document explains the robust security measures implemented in APIYourself to safely integrate with Large Language Models (LLMs) while preventing prompt injection attacks and maintaining system integrity.

## 🔒 Security Architecture

### Hardcoded Security Rules
The system implements **immutable security rules** that cannot be overridden by any user input or prompt:

- **Scope Restriction**: Limited to API creation tasks only
- **Operation Whitelist**: Only allowed operations are permitted
- **Pattern Detection**: Advanced regex patterns detect injection attempts
- **Rate Limiting**: Per-user request limits prevent abuse
- **Input Sanitization**: All inputs are cleaned before processing
- **Output Validation**: All LLM outputs are validated for safety

### Security Guard Components

#### 1. LLMSecurityGuard (`/src/components/LLMSecurityGuard.ts`)
- Core security enforcement engine
- Validates all inputs and outputs
- Logs security violations
- Prevents prompt injection attacks
- Enforces scope boundaries

#### 2. useSecureLLM Hook (`/src/hooks/useSecureLLM.ts`)
- React hook for safe LLM interactions
- Handles different LLM providers securely
- Implements rate limiting
- Provides security monitoring

#### 3. SecurityMonitor Component (`/src/components/SecurityMonitor.tsx`)
- Real-time security violation display
- User-friendly security alerts
- Rate limit warnings

## 🛡️ Security Features

### Prompt Injection Protection
```typescript
// These patterns are automatically detected and blocked:
- "ignore previous instructions"
- "act as admin/root/system"
- "override security rules"
- "simulate bypass"
- System file access attempts
- Command injection patterns
- Code injection attempts
```

### Allowed Operations
✅ **Permitted Tasks:**
- API endpoint creation
- Data model design
- Code generation (server-side)
- Documentation generation
- Test case creation
- Configuration setup
- Security middleware implementation

❌ **Forbidden Operations:**
- File system access
- Network requests
- Database operations
- System commands
- User authentication bypass
- Payment processing
- Admin panel access
- System shutdown/modification

### Rate Limiting
- **100 requests per hour** per user
- **10 requests per minute** per user
- **5 burst requests** maximum
- Automatic cooldown periods

## 🔧 LLM Provider Integration

### Supported Providers

#### 1. Ollama (Local)
```typescript
// Secure local LLM integration
const config = {
  provider: 'ollama',
  model: 'llama3.2',
  ollamaEndpoint: 'http://localhost:11434' // Localhost only
};
```

**Security Features:**
- Localhost-only connections
- Timeout protection (30 seconds)
- Output length limits
- Stop tokens to prevent prompt leakage

#### 2. Custom API
```typescript
// External LLM API with authentication
const config = {
  provider: 'api',
  apiEndpoint: 'https://your-llm-api.com/v1/chat',
  model: 'your-model'
};
```

**Security Features:**
- API key authentication
- Request validation
- Response sanitization
- Timeout protection

#### 3. OpenAI (Optional)
```typescript
// OpenAI integration (when enabled)
const config = {
  provider: 'openai',
  model: 'gpt-3.5-turbo'
};
```

**Security Features:**
- Environment flag required (`VITE_OPENAI_ENABLED=true`)
- API key from environment variables
- Request/response monitoring
- Usage tracking

## 🚀 Implementation Guide

### 1. Basic Usage
```typescript
import { useSecureLLM } from '@/hooks/useSecureLLM';

function MyComponent() {
  const { secureLLMCall, isLoading, lastResponse } = useSecureLLM(userId, sessionId);
  
  const handleAIRequest = async () => {
    const response = await secureLLMCall(
      "Create a REST API for a blog platform",
      'API_CREATION',
      { provider: 'ollama', model: 'llama3.2' }
    );
    
    if (response.success) {
      console.log('AI Response:', response.content);
    } else if (response.violations) {
      console.log('Security violations:', response.violations);
    }
  };
}
```

### 2. Security Monitoring
```typescript
import { SecurityMonitor } from '@/components/SecurityMonitor';

function ChatInterface() {
  const { lastResponse } = useSecureLLM(userId, sessionId);
  
  return (
    <div>
      {/* Your chat UI */}
      
      {/* Security violations display */}
      {lastResponse?.violations && (
        <SecurityMonitor violations={lastResponse.violations} />
      )}
      
      {/* Rate limit warnings */}
      {lastResponse?.rateLimited && (
        <RateLimitWarning resetTime={Date.now() + 3600000} />
      )}
    </div>
  );
}
```

### 3. Configuration
```typescript
// Environment variables (.env.local)
VITE_OPENAI_ENABLED=false
VITE_LLM_API_KEY=your_api_key
VITE_DEFAULT_OLLAMA_ENDPOINT=http://localhost:11434
VITE_SECURITY_LOGGING=true
```

## 🔍 Security Monitoring

### Violation Types
1. **PROMPT_INJECTION**: Detected injection attempts
2. **SCOPE_VIOLATION**: Requests outside allowed scope
3. **DANGEROUS_COMMAND**: Dangerous code/commands detected
4. **UNAUTHORIZED_ACCESS**: Attempts to access restricted resources

### Severity Levels
- **LOW**: Minor violations, logged but allowed
- **MEDIUM**: Moderate violations, request denied
- **HIGH**: Serious violations, request denied + warning
- **CRITICAL**: Severe violations, request denied + admin alert

### Logging & Monitoring
```typescript
// All security events are logged
{
  timestamp: "2024-01-15T10:30:00Z",
  userId: "user_123",
  sessionId: "session_456",
  violation: {
    type: "PROMPT_INJECTION",
    message: "Dangerous command pattern detected",
    severity: "CRITICAL"
  }
}
```

## ⚙️ Advanced Configuration

### Custom Security Rules
```typescript
// Extend security patterns (advanced users)
const customPatterns = [
  /your-custom-dangerous-pattern/i,
  /another-security-pattern/gi
];

// Add to LLMSecurityGuard configuration
```

### Rate Limit Customization
```typescript
// Adjust rate limits per user type
const premiumLimits = {
  REQUESTS_PER_HOUR: 500,
  REQUESTS_PER_MINUTE: 50,
  BURST_LIMIT: 20
};
```

### Provider-Specific Security
```typescript
// Ollama-specific security
const ollamaConfig = {
  // Only allow localhost
  allowedHosts: ['localhost', '127.0.0.1'],
  maxTokens: 2000,
  timeout: 30000
};

// API provider security
const apiConfig = {
  requiredHeaders: ['Authorization'],
  allowedDomains: ['trusted-llm-provider.com'],
  validateSSL: true
};
```

## 🚨 Incident Response

### Security Violation Response
1. **Immediate**: Request blocked, user notified
2. **Logging**: Violation logged with full context
3. **Monitoring**: Admin dashboard updated
4. **Escalation**: Critical violations trigger alerts

### Rate Limit Response
1. **Soft Limit**: Warning displayed to user
2. **Hard Limit**: Requests blocked temporarily
3. **Cooldown**: Automatic reset after time period
4. **Premium Override**: Optional paid rate limit increases

## 📊 Metrics & Analytics

### Security Metrics
- Violation frequency by type
- User behavior patterns
- Attack attempt trends
- System performance impact

### Usage Metrics
- LLM provider response times
- Success/failure rates
- User satisfaction scores
- Cost optimization opportunities

## 🔮 Future Enhancements

### Planned Security Features
- [ ] ML-based anomaly detection
- [ ] Dynamic rate limiting based on behavior
- [ ] Advanced prompt injection detection
- [ ] Blockchain-based audit trails
- [ ] Zero-trust architecture implementation

### LLM Integration Roadmap
- [ ] Support for more LLM providers
- [ ] Fine-tuned models for API creation
- [ ] Federated learning capabilities
- [ ] Edge LLM deployment options

---

**Remember**: Security is a continuous process. Regularly review logs, update patterns, and stay informed about new prompt injection techniques. The system is designed to be secure by default, but proper configuration and monitoring are essential for production use.
