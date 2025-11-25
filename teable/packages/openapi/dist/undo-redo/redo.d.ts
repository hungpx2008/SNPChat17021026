import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const OPERATION_REDO = "/table/{tableId}/undo-redo/redo";
export declare const redoVoSchema: z.ZodObject<{
    status: z.ZodEnum<["fulfilled", "failed", "empty"]>;
    errorMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "fulfilled" | "failed" | "empty";
    errorMessage?: string | undefined;
}, {
    status: "fulfilled" | "failed" | "empty";
    errorMessage?: string | undefined;
}>;
export type IRedoVo = z.infer<typeof redoVoSchema>;
export declare const RedoRoute: RouteConfig;
export declare function redo(tableId: string): Promise<AxiosResponse<IRedoVo>>;
