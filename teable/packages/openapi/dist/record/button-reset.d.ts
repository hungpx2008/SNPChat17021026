import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord } from '@teable/core';
import type { AxiosResponse } from 'axios';
export declare const BUTTON_RESET = "/table/{tableId}/record/{recordId}/{fieldId}/button-reset";
export declare const ButtonResetRoute: RouteConfig;
export declare function buttonReset(tableId: string, recordId: string, fieldId: string): Promise<AxiosResponse<IRecord>>;
