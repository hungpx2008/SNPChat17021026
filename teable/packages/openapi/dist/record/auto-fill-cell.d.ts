import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
export declare const AUTO_FILL_CELL = "/table/{tableId}/record/{recordId}/{fieldId}/auto-fill";
export declare const autoFillCellVoSchema: z.ZodObject<{
    taskId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    taskId: string;
}, {
    taskId: string;
}>;
export type IAutoFillCellVo = z.infer<typeof autoFillCellVoSchema>;
export declare const AutoFillCellRoute: RouteConfig;
export declare function autoFillCell(tableId: string, recordId: string, fieldId: string): Promise<AxiosResponse<IAutoFillCellVo>>;
