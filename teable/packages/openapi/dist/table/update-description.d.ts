import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const TABLE_DESCRIPTION = "/base/{baseId}/table/{tableId}/description";
export declare const tableDescriptionRoSchema: z.ZodObject<{
    description: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string | null;
}, {
    description: string | null;
}>;
export type ITableDescriptionRo = z.infer<typeof tableDescriptionRoSchema>;
export declare const updateTableDescriptionRoute: RouteConfig;
export declare const updateTableDescription: (baseId: string, tableId: string, data: ITableDescriptionRo) => Promise<import("axios").AxiosResponse<void, any>>;
