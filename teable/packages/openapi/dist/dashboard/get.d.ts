import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_DASHBOARD = "/base/{baseId}/dashboard/{id}";
export declare const getDashboardVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    layout: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pluginInstallId: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }>, "many">>;
    pluginMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        pluginInstallId: z.ZodString;
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        pluginInstallId: string;
        url?: string | undefined;
    }, {
        name: string;
        id: string;
        pluginInstallId: string;
        url?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        url?: string | undefined;
    }> | undefined;
}, {
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        url?: string | undefined;
    }> | undefined;
}>;
export type IGetDashboardVo = z.infer<typeof getDashboardVoSchema>;
export declare const GetDashboardRoute: RouteConfig;
export declare const getDashboard: (baseId: string, id: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        url?: string | undefined;
    }> | undefined;
}, any>>;
