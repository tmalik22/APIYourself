import { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
declare function createRateLimit(windowMs?: number, max?: number): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export default router;
export { createRateLimit };
//# sourceMappingURL=rate-limiter.d.ts.map