import fetch from 'node-fetch';
import { Request } from './Request';
export declare class HttpClient {
    static send(request: Request): Promise<fetch.Response>;
}
