import React from 'react';
import { SecurityViolation } from './LLMSecurityGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SecurityMonitorProps {
  violations: SecurityViolation[];
}

export function SecurityMonitor({ violations }: SecurityMonitorProps) {
  if (!violations || violations.length === 0) return null;

  const criticalViolations = violations.filter(v => v.severity === 'CRITICAL');
  const otherViolations = violations.filter(v => v.severity !== 'CRITICAL');

  return (
    <div className="space-y-2">
      {criticalViolations.length > 0 && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            Critical Security Violation Detected
          </AlertDescription>
        </Alert>
      )}

      {otherViolations.map((violation, index) => (
        <Alert key={index} variant="destructive" className="border-orange-400 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{violation.type}:</strong> {violation.message}
          </AlertDescription>
        </Alert>
      ))}

      <Alert className="border-blue-400 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <strong>Please note:</strong> This system is designed for API creation only. 
          Requests should focus on endpoint design, data models, code generation, 
          documentation, and testing related to API development.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Rate limit warning component
interface RateLimitWarningProps {
  resetTime: number;
}

export function RateLimitWarning({ resetTime }: RateLimitWarningProps) {
  const resetTimeString = new Date(resetTime).toLocaleTimeString();
  
  return (
    <Alert variant="destructive" className="border-yellow-400 bg-yellow-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-yellow-800">
        <strong>Rate Limit Exceeded:</strong> Too many requests. 
        Please try again after {resetTimeString}.
      </AlertDescription>
    </Alert>
  );
}
