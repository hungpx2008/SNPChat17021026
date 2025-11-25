import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CHECK_BASE_INTEGRITY = "/integrity/base/{baseId}/link-check";
export declare enum IntegrityIssueType {
    ForeignTableNotFound = "ForeignTableNotFound",
    ForeignKeyNotFound = "ForeignKeyNotFound",
    SelfKeyNotFound = "SelfKeyNotFound",
    SymmetricFieldNotFound = "SymmetricFieldNotFound",
    MissingRecordReference = "MissingRecordReference",
    InvalidLinkReference = "InvalidLinkReference",
    ForeignKeyHostTableNotFound = "ForeignKeyHostTableNotFound",
    ReferenceFieldNotFound = "ReferenceFieldNotFound",
    UniqueIndexNotFound = "UniqueIndexNotFound",
    EmptyString = "EmptyString"
}
export declare const integrityIssueSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof IntegrityIssueType>;
    message: z.ZodString;
    fieldId: z.ZodString;
    tableId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: IntegrityIssueType;
    message: string;
    fieldId: string;
    tableId?: string | undefined;
}, {
    type: IntegrityIssueType;
    message: string;
    fieldId: string;
    tableId?: string | undefined;
}>;
export declare const linkFieldCheckItemSchema: z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    baseName: z.ZodOptional<z.ZodString>;
    tableId: z.ZodOptional<z.ZodString>;
    tableName: z.ZodOptional<z.ZodString>;
    issues: z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof IntegrityIssueType>;
        message: z.ZodString;
        fieldId: z.ZodString;
        tableId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: IntegrityIssueType;
        message: string;
        fieldId: string;
        tableId?: string | undefined;
    }, {
        type: IntegrityIssueType;
        message: string;
        fieldId: string;
        tableId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    issues: {
        type: IntegrityIssueType;
        message: string;
        fieldId: string;
        tableId?: string | undefined;
    }[];
    tableId?: string | undefined;
    baseId?: string | undefined;
    tableName?: string | undefined;
    baseName?: string | undefined;
}, {
    issues: {
        type: IntegrityIssueType;
        message: string;
        fieldId: string;
        tableId?: string | undefined;
    }[];
    tableId?: string | undefined;
    baseId?: string | undefined;
    tableName?: string | undefined;
    baseName?: string | undefined;
}>;
export type IIntegrityIssue = z.infer<typeof integrityIssueSchema>;
export declare const integrityCheckVoSchema: z.ZodObject<{
    hasIssues: z.ZodBoolean;
    linkFieldIssues: z.ZodArray<z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        baseName: z.ZodOptional<z.ZodString>;
        tableId: z.ZodOptional<z.ZodString>;
        tableName: z.ZodOptional<z.ZodString>;
        issues: z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof IntegrityIssueType>;
            message: z.ZodString;
            fieldId: z.ZodString;
            tableId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }, {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        issues: {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }[];
        tableId?: string | undefined;
        baseId?: string | undefined;
        tableName?: string | undefined;
        baseName?: string | undefined;
    }, {
        issues: {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }[];
        tableId?: string | undefined;
        baseId?: string | undefined;
        tableName?: string | undefined;
        baseName?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    hasIssues: boolean;
    linkFieldIssues: {
        issues: {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }[];
        tableId?: string | undefined;
        baseId?: string | undefined;
        tableName?: string | undefined;
        baseName?: string | undefined;
    }[];
}, {
    hasIssues: boolean;
    linkFieldIssues: {
        issues: {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }[];
        tableId?: string | undefined;
        baseId?: string | undefined;
        tableName?: string | undefined;
        baseName?: string | undefined;
    }[];
}>;
export type IIntegrityCheckVo = z.infer<typeof integrityCheckVoSchema>;
export declare const IntegrityCheckRoute: RouteConfig;
export declare const checkBaseIntegrity: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<{
    hasIssues: boolean;
    linkFieldIssues: {
        issues: {
            type: IntegrityIssueType;
            message: string;
            fieldId: string;
            tableId?: string | undefined;
        }[];
        tableId?: string | undefined;
        baseId?: string | undefined;
        tableName?: string | undefined;
        baseName?: string | undefined;
    }[];
}, any>>;
