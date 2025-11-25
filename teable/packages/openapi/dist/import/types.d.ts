import { FieldType } from '@teable/core';
import z from 'zod';
export declare enum SUPPORTEDTYPE {
    CSV = "csv",
    EXCEL = "excel"
}
export declare const analyzeRoSchema: z.ZodObject<{
    attachmentUrl: z.ZodString;
    fileType: z.ZodNativeEnum<typeof SUPPORTEDTYPE>;
}, "strip", z.ZodTypeAny, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
}, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
}>;
export declare const analyzeColumnSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof FieldType>;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: FieldType;
}, {
    name: string;
    type: FieldType;
}>;
export declare const analyzeVoSchema: z.ZodObject<{
    worksheets: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        columns: z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof FieldType>;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: FieldType;
        }, {
            name: string;
            type: FieldType;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
        }[];
    }, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    worksheets: Record<string, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
        }[];
    }>;
}, {
    worksheets: Record<string, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
        }[];
    }>;
}>;
export type IAnalyzeRo = z.infer<typeof analyzeRoSchema>;
export type IAnalyzeVo = z.infer<typeof analyzeVoSchema>;
export type IAnalyzeColumn = z.infer<typeof analyzeColumnSchema>;
export type IValidateTypes = FieldType.Number | FieldType.Date | FieldType.LongText | FieldType.Checkbox | FieldType.SingleLineText;
export declare const importColumnSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof FieldType>;
    name: z.ZodString;
} & {
    sourceColumnIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: FieldType;
    sourceColumnIndex: number;
}, {
    name: string;
    type: FieldType;
    sourceColumnIndex: number;
}>;
export declare const importSheetItem: z.ZodObject<{
    name: z.ZodString;
    columns: z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof FieldType>;
        name: z.ZodString;
    } & {
        sourceColumnIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }, {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }>, "many">;
    useFirstRowAsHeader: z.ZodBoolean;
    importData: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    columns: {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }[];
    useFirstRowAsHeader: boolean;
    importData: boolean;
}, {
    name: string;
    columns: {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }[];
    useFirstRowAsHeader: boolean;
    importData: boolean;
}>;
export declare const importOptionSchema: z.ZodObject<Pick<{
    name: z.ZodString;
    columns: z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof FieldType>;
        name: z.ZodString;
    } & {
        sourceColumnIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }, {
        name: string;
        type: FieldType;
        sourceColumnIndex: number;
    }>, "many">;
    useFirstRowAsHeader: z.ZodBoolean;
    importData: z.ZodBoolean;
}, "useFirstRowAsHeader" | "importData">, "strip", z.ZodTypeAny, {
    useFirstRowAsHeader: boolean;
    importData: boolean;
}, {
    useFirstRowAsHeader: boolean;
    importData: boolean;
}>;
export declare const importOptionRoSchema: z.ZodObject<{
    worksheets: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        columns: z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof FieldType>;
            name: z.ZodString;
        } & {
            sourceColumnIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }, {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }>, "many">;
        useFirstRowAsHeader: z.ZodBoolean;
        importData: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }[];
        useFirstRowAsHeader: boolean;
        importData: boolean;
    }, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }[];
        useFirstRowAsHeader: boolean;
        importData: boolean;
    }>>;
    attachmentUrl: z.ZodString;
    fileType: z.ZodNativeEnum<typeof SUPPORTEDTYPE>;
    notification: z.ZodOptional<z.ZodBoolean>;
    tz: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
    worksheets: Record<string, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }[];
        useFirstRowAsHeader: boolean;
        importData: boolean;
    }>;
    tz: string;
    notification?: boolean | undefined;
}, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
    worksheets: Record<string, {
        name: string;
        columns: {
            name: string;
            type: FieldType;
            sourceColumnIndex: number;
        }[];
        useFirstRowAsHeader: boolean;
        importData: boolean;
    }>;
    tz: string;
    notification?: boolean | undefined;
}>;
export declare const inplaceImportOptionRoSchema: z.ZodObject<{
    attachmentUrl: z.ZodString;
    fileType: z.ZodNativeEnum<typeof SUPPORTEDTYPE>;
    insertConfig: z.ZodObject<{
        sourceWorkSheetKey: z.ZodString;
        excludeFirstRow: z.ZodBoolean;
        sourceColumnMap: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        sourceWorkSheetKey: string;
        excludeFirstRow: boolean;
        sourceColumnMap: Record<string, number | null>;
    }, {
        sourceWorkSheetKey: string;
        excludeFirstRow: boolean;
        sourceColumnMap: Record<string, number | null>;
    }>;
    notification: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
    insertConfig: {
        sourceWorkSheetKey: string;
        excludeFirstRow: boolean;
        sourceColumnMap: Record<string, number | null>;
    };
    notification?: boolean | undefined;
}, {
    attachmentUrl: string;
    fileType: SUPPORTEDTYPE;
    insertConfig: {
        sourceWorkSheetKey: string;
        excludeFirstRow: boolean;
        sourceColumnMap: Record<string, number | null>;
    };
    notification?: boolean | undefined;
}>;
export type IImportColumn = z.infer<typeof importColumnSchema>;
export type IImportOptionRo = z.infer<typeof importOptionRoSchema>;
export type IImportSheetItem = z.infer<typeof importSheetItem>;
export type IImportOption = z.infer<typeof importOptionSchema>;
export type IInplaceImportOptionRo = z.infer<typeof inplaceImportOptionRoSchema>;
