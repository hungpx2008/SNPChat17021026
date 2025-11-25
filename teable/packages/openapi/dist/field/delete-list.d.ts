import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DELETE_FIELD_LIST = "/table/{tableId}/field";
export declare const deleteFieldsQuerySchema: z.ZodObject<{
    fieldIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    fieldIds: string[];
}, {
    fieldIds: string[];
}>;
export type IDeleteFieldsQuery = z.infer<typeof deleteFieldsQuerySchema>;
export declare const DeleteFieldListRoute: RouteConfig;
export declare const deleteFields: (tableId: string, fieldIds: string[]) => Promise<import("axios").AxiosResponse<null, any>>;
