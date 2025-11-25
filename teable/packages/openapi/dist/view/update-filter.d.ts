import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IFilterRo } from '@teable/core';
export declare const VIEW_FILTER = "/table/{tableId}/view/{viewId}/filter";
export declare const UpdateViewFilterRoute: RouteConfig;
export declare const updateViewFilter: (tableId: string, viewId: string, filterRo: IFilterRo) => Promise<import("axios").AxiosResponse<void, any>>;
