import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_DASHBOARD_LIST = "/base/{baseId}/dashboard";
export declare const getDashboardListVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>, "many">;
export type IGetDashboardListVo = z.infer<typeof getDashboardListVoSchema>;
export declare const GetDashboardListRoute: RouteConfig;
export declare const getDashboardList: (baseId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}[], any>>;
