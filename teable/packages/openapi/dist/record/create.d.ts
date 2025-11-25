import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const recordInsertOrderRoSchema: z.ZodObject<{
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
}>;
export type IRecordInsertOrderRo = z.infer<typeof recordInsertOrderRoSchema>;
export declare const createRecordsRoSchema: z.ZodObject<{
    fieldKeyType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof import("@teable/core").FieldKeyType>>, import("@teable/core").FieldKeyType, import("@teable/core").FieldKeyType | undefined>>;
    typecast: z.ZodOptional<z.ZodBoolean>;
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
    records: z.ZodArray<z.ZodObject<{
        fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        fields: Record<string, unknown>;
    }, {
        fields: Record<string, unknown>;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    records: {
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
export type ICreateRecordsRo = z.infer<typeof createRecordsRoSchema>;
export declare const createRecordsVoSchema: z.ZodObject<Pick<{
    records: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    extra: z.ZodOptional<z.ZodObject<{
        groupPoints: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<import("..").GroupPointType.Header>;
            depth: z.ZodNumber;
            value: z.ZodUnknown;
            isCollapsed: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            type: import("..").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }, {
            type: import("..").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }>, z.ZodObject<{
            type: z.ZodLiteral<import("..").GroupPointType.Row>;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: import("..").GroupPointType.Row;
            count: number;
        }, {
            type: import("..").GroupPointType.Row;
            count: number;
        }>]>, "many">>>;
        allGroupHeaderRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            depth: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            depth: number;
        }, {
            id: string;
            depth: number;
        }>, "many">>;
        searchHitIndex: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            recordId: z.ZodString;
            fieldId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            recordId: string;
            fieldId: string;
        }, {
            recordId: string;
            fieldId: string;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        groupPoints?: ({
            type: import("..").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("..").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    }, {
        groupPoints?: ({
            type: import("..").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("..").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    }>>;
}, "records">, "strip", z.ZodTypeAny, {
    records: {
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
    }[];
}, {
    records: {
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
    }[];
}>;
export type ICreateRecordsVo = z.infer<typeof createRecordsVoSchema>;
export declare const CREATE_RECORD = "/table/{tableId}/record";
export declare const CreateRecordRoute: RouteConfig;
export declare function createRecords(tableId: string, recordsRo: ICreateRecordsRo): Promise<AxiosResponse<ICreateRecordsVo>>;
