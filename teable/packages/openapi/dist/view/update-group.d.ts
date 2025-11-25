import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IViewGroupRo } from '@teable/core';
export declare const VIEW_GROUP = "/table/{tableId}/view/{viewId}/group";
export declare const UpdateViewGroupRoute: RouteConfig;
export declare const updateViewGroup: (tableId: string, viewId: string, groupViewRo: IViewGroupRo) => Promise<import("axios").AxiosResponse<void, any>>;
