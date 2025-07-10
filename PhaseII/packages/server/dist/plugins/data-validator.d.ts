import { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
declare function createValidator(schemaName: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default router;
export { createValidator };
//# sourceMappingURL=data-validator.d.ts.map