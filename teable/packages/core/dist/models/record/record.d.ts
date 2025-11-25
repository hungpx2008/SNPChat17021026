import { z } from 'zod';
import type { FieldCore } from '../field/field';
export declare enum FieldKeyType {
    Id = "id",
    Name = "name",
    DbFieldName = "dbFieldName"
}
export declare enum CellFormat {
    Json = "json",
    Text = "text"
}
export declare class RecordCore {
    protected fieldMap: {
        [fieldId: string]: FieldCore;
    };
    constructor(fieldMap: {
        [fieldId: string]: FieldCore;
    });
    name?: string;
    commentCount: number;
    createdTime: Date;
    id: string;
    isDeleted: boolean;
    fields: Record<string, unknown>;
    permissions?: Record<'read' | 'update', Record<string, boolean>>;
    undeletable?: boolean;
    getCellValue(fieldId: string): unknown;
    getCellValueAsString(fieldId: string): string;
}
export declare const recordSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    autoNumber: z.ZodOptional<z.ZodNumber>;
    createdTime: z.ZodOptional<z.ZodString>;
    lastModifiedTime: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodOptional<z.ZodString>;
    lastModifiedBy: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
    undeletable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string | undefined;
    lastModifiedTime?: string | undefined;
    createdBy?: string | undefined;
    lastModifiedBy?: string | undefined;
    autoNumber?: number | undefined;
    name?: string | undefined;
    permissions?: Record<string, Record<string, boolean>> | undefined;
    undeletable?: boolean | undefined;
}, {
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string | undefined;
    lastModifiedTime?: string | undefined;
    createdBy?: string | undefined;
    lastModifiedBy?: string | undefined;
    autoNumber?: number | undefined;
    name?: string | undefined;
    permissions?: Record<string, Record<string, boolean>> | undefined;
    undeletable?: boolean | undefined;
}>;
export type IRecord = z.infer<typeof recordSchema>;
