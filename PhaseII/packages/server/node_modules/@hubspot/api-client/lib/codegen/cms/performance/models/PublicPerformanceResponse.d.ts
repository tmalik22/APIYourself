import { PerformanceView } from '../models/PerformanceView';
export declare class PublicPerformanceResponse {
    'path'?: string;
    'period'?: PublicPerformanceResponsePeriodEnum;
    'startInterval': number;
    'data': Array<PerformanceView>;
    'domain'?: string;
    'interval': PublicPerformanceResponseIntervalEnum;
    'endInterval': number;
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
export declare enum PublicPerformanceResponsePeriodEnum {
    OneMinute = "ONE_MINUTE",
    FiveMinutes = "FIVE_MINUTES",
    TenMinutes = "TEN_MINUTES",
    FifteenMinutes = "FIFTEEN_MINUTES",
    ThirtyMinutes = "THIRTY_MINUTES",
    OneHour = "ONE_HOUR",
    FourHours = "FOUR_HOURS",
    TwelveHours = "TWELVE_HOURS",
    OneDay = "ONE_DAY",
    OneWeek = "ONE_WEEK"
}
export declare enum PublicPerformanceResponseIntervalEnum {
    OneMinute = "ONE_MINUTE",
    FiveMinutes = "FIVE_MINUTES",
    TenMinutes = "TEN_MINUTES",
    FifteenMinutes = "FIFTEEN_MINUTES",
    ThirtyMinutes = "THIRTY_MINUTES",
    OneHour = "ONE_HOUR",
    FourHours = "FOUR_HOURS",
    TwelveHours = "TWELVE_HOURS",
    OneDay = "ONE_DAY",
    OneWeek = "ONE_WEEK"
}
