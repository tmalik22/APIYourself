export interface CodeGenConfig {
    framework: string;
    database: string;
    authentication: string;
    deployment: string;
    features: string[];
    security: {
        rateLimiting: boolean;
        inputValidation: boolean;
        outputSanitization: boolean;
        cors: string[];
    };
    performance: {
        caching: boolean;
        compression: boolean;
        monitoring: boolean;
    };
}
export interface RequirementsData {
    projectName: string;
    description: string;
    endpoints: any[];
    models: any[];
    security: any;
    deployment: any;
    performance: any;
}
export declare class RequirementsEngine {
    private logger;
    static mapRequirementsToConfig(requirements: any): CodeGenConfig;
    static generateProductionCode(requirements: RequirementsData, config: CodeGenConfig): Promise<{
        success: boolean;
        code: string;
        config: any;
        deployment: any;
        message?: string;
    }>;
    static generateDeploymentScripts(requirements: RequirementsData, config: CodeGenConfig): Promise<{
        success: boolean;
        scripts: Record<string, string>;
        message?: string;
    }>;
    static generateCICDConfigs(requirements: RequirementsData, config: CodeGenConfig): Promise<{
        success: boolean;
        configs: Record<string, string>;
        message?: string;
    }>;
    generateProductionCode(requirements: RequirementsData, config: CodeGenConfig): Promise<{
        success: boolean;
        code: string;
        config: any;
        deployment: any;
        message?: string;
    }>;
    private generateFrameworkCode;
    private generateDeploymentConfig;
    validateRequirements(requirements: RequirementsData): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
export declare const requirementsEngine: RequirementsEngine;
//# sourceMappingURL=production-code-generator.d.ts.map