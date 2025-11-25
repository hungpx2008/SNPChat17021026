import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
export declare const STOP_FILL_FIELD = "/table/{tableId}/field/{fieldId}/stop-fill";
export declare const StopFillFieldRoute: RouteConfig;
export declare function stopFillField(tableId: string, fieldId: string): Promise<AxiosResponse<null>>;
