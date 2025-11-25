import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PERMANENT_DELETE_BASE = "/base/{baseId}/permanent";
export declare const PermanentDeleteBaseRoute: RouteConfig;
export declare const permanentDeleteBase: (baseId: string) => Promise<import("axios").AxiosResponse<null, any>>;
