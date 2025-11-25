import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord } from '@teable/core';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const updateRecordRoSchema: z.ZodObject<{
    fieldKeyType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof import("@teable/core").FieldKeyType>>, import("@teable/core").FieldKeyType, import("@teable/core").FieldKeyType | undefined>>;
    typecast: z.ZodOptional<z.ZodBoolean>;
    record: z.ZodObject<{
        fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        fields: Record<string, unknown>;
    }, {
        fields: Record<string, unknown>;
    }>;
    order: z.ZodOptional<z.ZodObject<{
        viewId: z.ZodString;
        anchorId: z.ZodString;
        position: z.ZodEnum<["before", "after"]>;
    }, "strip", z.ZodTypeAny, {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    }, {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    }>>;
}, "strip", z.ZodTypeAny, {
    record: {
        fields: Record<string, unknown>;
    };
    fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
    typecast?: boolean | undefined;
    order?: {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    } | undefined;
}, {
    record: {
        fields: Record<string, unknown>;
    };
    fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
    typecast?: boolean | undefined;
    order?: {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    } | undefined;
}>;
export type IUpdateRecordRo = z.infer<typeof updateRecordRoSchema>;
export declare const updateRecordsRoSchema: z.ZodObject<{
    fieldKeyType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof import("@teable/core").FieldKeyType>>, import("@teable/core").FieldKeyType, import("@teable/core").FieldKeyType | undefined>>;
    typecast: z.ZodOptional<z.ZodBoolean>;
    records: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        fields: Record<string, unknown>;
    }, {
        id: string;
        fields: Record<string, unknown>;
    }>, "many">;
    order: z.ZodOptional<z.ZodObject<{
        viewId: z.ZodString;
        anchorId: z.ZodString;
        position: z.ZodEnum<["before", "after"]>;
    }, "strip", z.ZodTypeAny, {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    }, {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    }>>;
}, "strip", z.ZodTypeAny, {
    records: {
        id: string;
        fields: Record<string, unknown>;
    }[];
    fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
    typecast?: boolean | undefined;
    order?: {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    } | undefined;
}, {
    records: {
        id: string;
        fields: Record<string, unknown>;
    }[];
    fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
    typecast?: boolean | undefined;
    order?: {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    } | undefined;
}>;
export type IUpdateRecordsRo = z.infer<typeof updateRecordsRoSchema>;
export declare const UPDATE_RECORD = "/table/{tableId}/record/{recordId}";
export declare const UpdateRecordRoute: RouteConfig;
export declare function updateRecord(tableId: string, recordId: string, recordRo: IUpdateRecordRo): Promise<AxiosResponse<IRecord>>;
