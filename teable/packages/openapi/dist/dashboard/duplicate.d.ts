import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DUPLICATE_DASHBOARD = "/base/{baseId}/dashboard/{id}/duplicate";
export declare const duplicateDashboardRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type IDuplicateDashboardRo = z.infer<typeof duplicateDashboardRoSchema>;
export declare const duplicateDashboardRoute: RouteConfig;
export declare const duplicateDashboard: (baseId: string, id: string, duplicateDashboardRo: IDuplicateDashboardRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    name: string;
}, any>>;
