export declare class PerformanceView {
    '_403': number;
    '_404': number;
    '_500': number;
    '_504': number;
    'startDatetime'?: string;
    'responseTimeMs': number;
    '_95th': number;
    'totalRequests': number;
    'cacheHitRate': number;
    '_99th': number;
    'totalRequestTime'?: number;
    '_100x': number;
    '_50th': number;
    'cacheHits': number;
    '_20x': number;
    '_30x': number;
    '_40x': number;
    'endTimestamp': number;
    '_50x': number;
    'startTimestamp': number;
    'endDatetime'?: string;
    'avgOriginResponseTime': number;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
