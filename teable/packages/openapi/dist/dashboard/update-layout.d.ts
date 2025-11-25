import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const UPDATE_LAYOUT_DASHBOARD = "/base/{baseId}/dashboard/{id}/layout";
export declare const updateLayoutDashboardRoSchema: z.ZodObject<{
    layout: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, {
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}>;
export type IUpdateLayoutDashboardRo = z.infer<typeof updateLayoutDashboardRoSchema>;
export declare const updateLayoutDashboardVoSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, {
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}>;
export type IUpdateLayoutDashboardVo = z.infer<typeof updateLayoutDashboardVoSchema>;
export declare const UpdateLayoutDashboardRoute: RouteConfig;
export declare const updateLayoutDashboard: (baseId: string, id: string, layout: IUpdateLayoutDashboardRo['layout']) => Promise<import("axios").AxiosResponse<{
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, any>>;
