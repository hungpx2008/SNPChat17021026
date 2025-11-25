import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_VIEW = "/table/{tableId}/view/{viewId}";
export declare const DeleteViewRoute: RouteConfig;
export declare const deleteView: (tableId: string, viewId: string) => Promise<import("axios").AxiosResponse<null, any>>;
