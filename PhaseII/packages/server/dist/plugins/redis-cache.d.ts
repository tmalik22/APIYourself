import { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
declare class SimpleCache {
    private cache;
    set(key: string, value: any, ttlSeconds?: number): void;
    get(key: string): any;
    delete(key: string): boolean;
    clear(): void;
    keys(): string[];
    size(): number;
    exists(key: string): boolean;
}
declare const cache: SimpleCache;
declare function createCacheMiddleware(ttlSeconds?: number): (req: Request & {
    cache?: any;
}, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default router;
export { createCacheMiddleware, cache };
//# sourceMappingURL=redis-cache.d.ts.map