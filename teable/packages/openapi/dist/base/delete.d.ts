import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_BASE = "/base/{baseId}";
export declare const DeleteBaseRoute: RouteConfig;
export declare const deleteBase: (baseId: string) => Promise<import("axios").AxiosResponse<null, any>>;
