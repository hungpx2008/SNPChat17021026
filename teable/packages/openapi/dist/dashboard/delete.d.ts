import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_DASHBOARD = "/base/{baseId}/dashboard/{id}";
export declare const DeleteDashboardRoute: RouteConfig;
export declare const deleteDashboard: (baseId: string, id: string) => Promise<import("axios").AxiosResponse<any, any>>;
