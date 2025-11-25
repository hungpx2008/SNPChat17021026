import { z } from '../zod';
export declare const GET_TABLE_PERMISSION = "/base/{baseId}/table/{tableId}/permission";
export declare const tablePermissionVoSchema: z.ZodObject<{
    table: z.ZodRecord<z.ZodType<"table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset", z.ZodTypeDef, "table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset">, z.ZodBoolean>;
    view: z.ZodRecord<z.ZodType<"view|create" | "view|delete" | "view|read" | "view|update" | "view|share", z.ZodTypeDef, "view|create" | "view|delete" | "view|read" | "view|update" | "view|share">, z.ZodBoolean>;
    record: z.ZodRecord<z.ZodType<"record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy", z.ZodTypeDef, "record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy">, z.ZodBoolean>;
    field: z.ZodRecord<z.ZodType<"field|create" | "field|delete" | "field|read" | "field|update", z.ZodTypeDef, "field|create" | "field|delete" | "field|read" | "field|update">, z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    record: Partial<Record<"record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy", boolean>>;
    view: Partial<Record<"view|create" | "view|delete" | "view|read" | "view|update" | "view|share", boolean>>;
    field: Partial<Record<"field|create" | "field|delete" | "field|read" | "field|update", boolean>>;
    table: Partial<Record<"table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset", boolean>>;
}, {
    record: Partial<Record<"record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy", boolean>>;
    view: Partial<Record<"view|create" | "view|delete" | "view|read" | "view|update" | "view|share", boolean>>;
    field: Partial<Record<"field|create" | "field|delete" | "field|read" | "field|update", boolean>>;
    table: Partial<Record<"table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset", boolean>>;
}>;
export type ITablePermissionVo = z.infer<typeof tablePermissionVoSchema>;
export declare const GetTablePermissionRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const getTablePermission: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<{
    record: Partial<Record<"record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy", boolean>>;
    view: Partial<Record<"view|create" | "view|delete" | "view|read" | "view|update" | "view|share", boolean>>;
    field: Partial<Record<"field|create" | "field|delete" | "field|read" | "field|update", boolean>>;
    table: Partial<Record<"table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset", boolean>>;
}, any>>;
