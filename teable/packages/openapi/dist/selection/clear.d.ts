import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRangesRo } from './range';
export declare const CLEAR_URL = "/table/{tableId}/selection/clear";
export declare const ClearRoute: RouteConfig;
export declare const clear: (tableId: string, clearRo: IRangesRo) => Promise<import("axios").AxiosResponse<null, any>>;
