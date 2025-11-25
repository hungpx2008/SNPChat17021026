/// <reference types="react" />
import type { ITablePermissionVo } from '@teable/openapi';
type ITablePermissionContext = ITablePermissionVo;
export declare const TablePermissionContextDefaultValue: ITablePermissionContext;
export declare const TablePermissionContext: import("react").Context<{
    record: Partial<Record<"record|create" | "record|delete" | "record|read" | "record|update" | "record|comment" | "record|copy", boolean>>;
    view: Partial<Record<"view|create" | "view|delete" | "view|read" | "view|update" | "view|share", boolean>>;
    field: Partial<Record<"field|create" | "field|delete" | "field|read" | "field|update", boolean>>;
    table: Partial<Record<"table|create" | "table|delete" | "table|read" | "table|update" | "table|import" | "table|export" | "table|trash_read" | "table|trash_update" | "table|trash_reset", boolean>>;
}>;
export {};
