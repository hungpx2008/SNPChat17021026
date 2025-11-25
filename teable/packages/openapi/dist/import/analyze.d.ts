import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IAnalyzeRo } from './types';
export declare const ANALYZE_FILE = "/import/analyze";
export declare const AnalyzeTableRoute: RouteConfig;
export declare const analyzeFile: (analyzeRo: IAnalyzeRo) => Promise<import("axios").AxiosResponse<{
    worksheets: Record<string, {
        name: string;
        columns: {
            name: string;
            type: import("@teable/core").FieldType;
        }[];
    }>;
}, any>>;
