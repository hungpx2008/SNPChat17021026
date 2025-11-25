import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_DB_CONNECTION = "/base/{baseId}/connection";
export declare const GetDbConnectionRoute: RouteConfig;
export declare const getDbConnection: (baseId: string) => Promise<import("axios").AxiosResponse<{
    url: string;
    dsn: {
        host: string;
        driver: string;
        params?: Record<string, string | number | boolean> | undefined;
        user?: string | undefined;
        port?: number | undefined;
        pass?: string | undefined;
        db?: string | undefined;
    };
    connection: {
        max: number;
        current: number;
    };
} | null, any>>;
