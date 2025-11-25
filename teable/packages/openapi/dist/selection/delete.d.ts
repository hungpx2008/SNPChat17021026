import { z } from '../zod';
import type { IRangesRo } from './range';
export declare const DELETE_URL = "/table/{tableId}/selection/delete";
export declare const deleteVoSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    ids: string[];
}, {
    ids: string[];
}>;
export type IDeleteVo = z.infer<typeof deleteVoSchema>;
export declare const DeleteRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const deleteSelection: (tableId: string, deleteRo: IRangesRo) => Promise<import("axios").AxiosResponse<{
    ids: string[];
}, any>>;
