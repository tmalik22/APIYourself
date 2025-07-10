declare const router: import("express-serve-static-core").Router;
declare class SimpleDB {
    private tables;
    createTable(name: string, schema: any): void;
    dropTable(name: string): boolean;
    getTables(): string[];
    getSchema(tableName: string): any;
    insert(tableName: string, data: any): any;
    select(tableName: string, where?: any, limit?: number, offset?: number): any[];
    update(tableName: string, id: number, data: any): any;
    delete(tableName: string, id: number): boolean;
    count(tableName: string, where?: any): number;
}
declare const db: SimpleDB;
export default router;
export { db };
//# sourceMappingURL=postgresql-db.d.ts.map