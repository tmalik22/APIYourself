interface DeploymentResult {
    success: boolean;
    deploymentUrl?: string;
    deploymentId?: string;
    error?: string;
}
export declare class DeploymentService {
    private vercelToken;
    constructor();
    deployToVercel(project: any): Promise<DeploymentResult>;
    generateProjectFiles(project: any): Promise<Record<string, string>>;
    private generateServerCode;
    private createDeploymentPackage;
    private deployToVercelAPI;
    deployToRailway(project: any): Promise<DeploymentResult>;
    deployToRender(project: any): Promise<DeploymentResult>;
}
export {};
//# sourceMappingURL=deploymentService.d.ts.map