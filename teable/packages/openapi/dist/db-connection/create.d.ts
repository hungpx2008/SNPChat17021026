import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_DB_CONNECTION = "/base/{baseId}/connection";
export declare const createDbConnectionRoSchema: z.ZodObject<{
    baseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseId: string;
}, {
    baseId: string;
}>;
export declare const dbConnectionVoSchema: z.ZodObject<{
    dsn: z.ZodObject<{
        driver: z.ZodString;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        db: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
        pass: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    }, "strip", z.ZodTypeAny, {
        host: string;
        driver: string;
        params?: Record<string, string | number | boolean> | undefined;
        user?: string | undefined;
        port?: number | undefined;
        pass?: string | undefined;
        db?: string | undefined;
    }, {
        host: string;
        driver: string;
        params?: Record<string, string | number | boolean> | undefined;
        user?: string | undefined;
        port?: number | undefined;
        pass?: string | undefined;
        db?: string | undefined;
    }>;
    connection: z.ZodObject<{
        max: z.ZodNumber;
        current: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        max: number;
        current: number;
    }, {
        max: number;
        current: number;
    }>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type IDbConnectionVo = z.infer<typeof dbConnectionVoSchema>;
export declare const CreateDbConnectionRoute: RouteConfig;
export declare const createDbConnection: (baseId: string) => Promise<import("axios").AxiosResponse<{
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
}, any>>;
