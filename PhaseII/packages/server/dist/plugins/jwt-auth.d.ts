import { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
declare function requireAuth(req: Request & {
    user?: any;
}, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export default router;
export { requireAuth };
//# sourceMappingURL=jwt-auth.d.ts.map