import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const OPERATION_UNDO = "/table/{tableId}/undo-redo/undo";
export declare const undoVoSchema: z.ZodObject<{
    status: z.ZodEnum<["fulfilled", "failed", "empty"]>;
    errorMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "fulfilled" | "failed" | "empty";
    errorMessage?: string | undefined;
}, {
    status: "fulfilled" | "failed" | "empty";
    errorMessage?: string | undefined;
}>;
export type IUndoVo = z.infer<typeof undoVoSchema>;
export declare const UndoRoute: RouteConfig;
export declare function undo(tableId: string): Promise<AxiosResponse<IUndoVo>>;
