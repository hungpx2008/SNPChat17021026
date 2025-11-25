import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_GET = "/share/{shareId}/view";
declare const shareViewPluginSchema: z.ZodObject<Omit<{
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    baseId: z.ZodString;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "baseId">, "strip", z.ZodTypeAny, {
    name: string;
    pluginInstallId: string;
    pluginId: string;
    url?: string | undefined;
    storage?: Record<string, unknown> | undefined;
}, {
    name: string;
    pluginInstallId: string;
    pluginId: string;
    url?: string | undefined;
    storage?: Record<string, unknown> | undefined;
}>;
export type IShareViewPlugin = z.infer<typeof shareViewPluginSchema>;
export declare const shareViewGetVoSchema: z.ZodObject<{
    viewId: z.ZodOptional<z.ZodString>;
    tableId: z.ZodString;
    shareId: z.ZodString;
    shareMeta: z.ZodOptional<z.ZodObject<{
        allowCopy: z.ZodOptional<z.ZodBoolean>;
        includeHiddenField: z.ZodOptional<z.ZodBoolean>;
        password: z.ZodOptional<z.ZodString>;
        includeRecords: z.ZodOptional<z.ZodBoolean>;
        submit: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodBoolean>;
            requireLogin: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        }, {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        password?: string | undefined;
        allowCopy?: boolean | undefined;
        includeHiddenField?: boolean | undefined;
        includeRecords?: boolean | undefined;
        submit?: {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        } | undefined;
    }, {
        password?: string | undefined;
        allowCopy?: boolean | undefined;
        includeHiddenField?: boolean | undefined;
        includeRecords?: boolean | undefined;
        submit?: {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        } | undefined;
    }>>;
    view: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof import("@teable/core").ViewType>;
        description: z.ZodOptional<z.ZodString>;
        order: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            rowHeight: z.ZodOptional<z.ZodNativeEnum<typeof import("@teable/core").RowHeightLevel>>;
            fieldNameDisplayLines: z.ZodOptional<z.ZodNumber>;
            frozenColumnCount: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        }, {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        }>, z.ZodObject<{
            stackFieldId: z.ZodOptional<z.ZodString>;
            coverFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            isCoverFit: z.ZodOptional<z.ZodBoolean>;
            isFieldNameHidden: z.ZodOptional<z.ZodBoolean>;
            isEmptyStackHidden: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        }, {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        }>, z.ZodObject<{
            coverFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            isCoverFit: z.ZodOptional<z.ZodBoolean>;
            isFieldNameHidden: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        }, {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        }>, z.ZodObject<{
            startDateFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            endDateFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            titleFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            colorConfig: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").ColorConfigType>;
                fieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                color: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("@teable/core").Colors>>>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            }, {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            }>>>;
        }, "strict", z.ZodTypeAny, {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        }, {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        }>, z.ZodObject<{
            coverUrl: z.ZodOptional<z.ZodString>;
            logoUrl: z.ZodOptional<z.ZodString>;
            submitLabel: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        }, {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        }>, z.ZodObject<{
            pluginId: z.ZodString;
            pluginInstallId: z.ZodString;
            pluginLogo: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        }, {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        }>]>>;
        sort: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            sortObjs: z.ZodArray<z.ZodObject<{
                fieldId: z.ZodString;
                order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
            }, "strip", z.ZodTypeAny, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }>, "many">;
            manualSort: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        }, {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        }>>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
        group: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }, {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }>, "many">>>;
        isLocked: z.ZodOptional<z.ZodBoolean>;
        shareId: z.ZodOptional<z.ZodString>;
        enableShare: z.ZodOptional<z.ZodBoolean>;
        shareMeta: z.ZodOptional<z.ZodObject<{
            allowCopy: z.ZodOptional<z.ZodBoolean>;
            includeHiddenField: z.ZodOptional<z.ZodBoolean>;
            password: z.ZodOptional<z.ZodString>;
            includeRecords: z.ZodOptional<z.ZodBoolean>;
            submit: z.ZodOptional<z.ZodObject<{
                allow: z.ZodOptional<z.ZodBoolean>;
                requireLogin: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            }, {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        }, {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        }>>;
        createdBy: z.ZodString;
        lastModifiedBy: z.ZodOptional<z.ZodString>;
        createdTime: z.ZodString;
        lastModifiedTime: z.ZodOptional<z.ZodString>;
        columnMeta: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
            order: z.ZodNumber;
        } & {
            width: z.ZodOptional<z.ZodNumber>;
            hidden: z.ZodOptional<z.ZodBoolean>;
            statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof import("@teable/core").StatisticsFunc>>>;
        }, "strict", z.ZodTypeAny, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        }, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        }>, z.ZodObject<{
            order: z.ZodNumber;
        } & {
            visible: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            order: number;
            visible?: boolean | undefined;
        }, {
            order: number;
            visible?: boolean | undefined;
        }>, z.ZodObject<{
            order: z.ZodNumber;
        } & {
            visible: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            order: number;
            visible?: boolean | undefined;
        }, {
            order: number;
            visible?: boolean | undefined;
        }>, z.ZodObject<{
            order: z.ZodNumber;
        } & {
            visible: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        }, {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        }>, z.ZodObject<{
            order: z.ZodNumber;
        } & {
            hidden: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            order: number;
            hidden?: boolean | undefined;
        }, {
            order: number;
            hidden?: boolean | undefined;
        }>]>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    }, {
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>>;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof import("@teable/core").FieldType>;
        description: z.ZodOptional<z.ZodString>;
        options: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
            expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
            timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>, z.ZodUnion<[z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Decimal>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Percent>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Currency>;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }>]>]>>;
            showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleLineTextDisplayType>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }>, z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
                showValue: z.ZodBoolean;
                maxValue: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }>, z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").MultiNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }>]>]>>;
        }, "strict", z.ZodTypeAny, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        }, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        }>, z.ZodObject<{
            expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
            timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>, z.ZodUnion<[z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Decimal>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Percent>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Currency>;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }>]>]>>;
            showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleLineTextDisplayType>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }>, z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
                showValue: z.ZodBoolean;
                maxValue: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }>, z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").MultiNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }>]>]>>;
        } & {
            baseId: z.ZodOptional<z.ZodString>;
            foreignTableId: z.ZodOptional<z.ZodString>;
            lookupFieldId: z.ZodOptional<z.ZodString>;
            filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
            sort: z.ZodOptional<z.ZodObject<{
                fieldId: z.ZodString;
                order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
            }, "strip", z.ZodTypeAny, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        }, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        }>, z.ZodObject<{
            expression: z.ZodString;
            timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>, z.ZodUnion<[z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Decimal>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Percent>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Currency>;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }>]>]>>;
            showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleLineTextDisplayType>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }>, z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
                showValue: z.ZodBoolean;
                maxValue: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }>, z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").MultiNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }>]>]>>;
        }, "strict", z.ZodTypeAny, {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        }, {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        }>, z.ZodObject<{
            baseId: z.ZodOptional<z.ZodString>;
            relationship: z.ZodNativeEnum<typeof import("@teable/core").Relationship>;
            foreignTableId: z.ZodString;
            lookupFieldId: z.ZodString;
            isOneWay: z.ZodOptional<z.ZodBoolean>;
            fkHostTableName: z.ZodString;
            selfKeyName: z.ZodString;
            foreignKeyName: z.ZodString;
            symmetricFieldId: z.ZodOptional<z.ZodString>;
            filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
            filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
        }, "strict", z.ZodTypeAny, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        }, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        }>, z.ZodObject<{
            formatting: z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>;
            defaultValue: z.ZodOptional<z.ZodEnum<["now"]>>;
        }, "strict", z.ZodTypeAny, {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        }, {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        }>, z.ZodObject<{
            defaultValue: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            defaultValue?: boolean | undefined;
        }, {
            defaultValue?: boolean | undefined;
        }>, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>, z.ZodObject<{
            showAs: z.ZodOptional<z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleLineTextDisplayType>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }>>;
            defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
        }, "strict", z.ZodTypeAny, {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        }, {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        }>, z.ZodObject<{
            icon: z.ZodNativeEnum<typeof import("@teable/core").RatingIcon>;
            color: z.ZodEnum<[import("@teable/core").Colors.YellowBright, import("@teable/core").Colors.RedBright, import("@teable/core").Colors.TealBright]>;
            max: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        }, {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        }>, z.ZodObject<{
            isMultiple: z.ZodOptional<z.ZodBoolean>;
            shouldNotify: z.ZodOptional<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodEnum<["me"]>]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodEnum<["me"]>]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        }, {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        }>, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>, z.ZodObject<{
            label: z.ZodString;
            color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            maxCount: z.ZodOptional<z.ZodNumber>;
            resetCount: z.ZodOptional<z.ZodBoolean>;
            workflow: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                isActive: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            }, {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            }>>>;
        }, "strict", z.ZodTypeAny, {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        }, {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        }>]>, z.ZodObject<{
            expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
            timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>, z.ZodUnion<[z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Decimal>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Percent>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Currency>;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }>]>]>>;
            showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleLineTextDisplayType>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }, {
                type: import("@teable/core").SingleLineTextDisplayType;
            }>, z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
                showValue: z.ZodBoolean;
                maxValue: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }>, z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").MultiNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }>]>]>>;
        } & {
            baseId: z.ZodOptional<z.ZodString>;
            foreignTableId: z.ZodOptional<z.ZodString>;
            lookupFieldId: z.ZodOptional<z.ZodString>;
            filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
            sort: z.ZodOptional<z.ZodObject<{
                fieldId: z.ZodString;
                order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
            }, "strip", z.ZodTypeAny, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        }, {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        }>, z.ZodObject<{
            baseId: z.ZodOptional<z.ZodString>;
            relationship: z.ZodNativeEnum<typeof import("@teable/core").Relationship>;
            foreignTableId: z.ZodString;
            lookupFieldId: z.ZodString;
            isOneWay: z.ZodOptional<z.ZodBoolean>;
            fkHostTableName: z.ZodString;
            selfKeyName: z.ZodString;
            foreignKeyName: z.ZodString;
            symmetricFieldId: z.ZodOptional<z.ZodString>;
            filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
            filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
        }, "strict", z.ZodTypeAny, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        }, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        }>, z.ZodObject<{
            choices: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                color: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                name: string;
                color: string;
            }, {
                id: string;
                name: string;
                color: string;
            }>, "many">;
            defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        }, {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        }>, z.ZodObject<{
            formatting: z.ZodUnion<[z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Decimal>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Percent>;
            }, "strip", z.ZodTypeAny, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }, {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            }>, z.ZodObject<{
                precision: z.ZodNumber;
            } & {
                type: z.ZodLiteral<import("@teable/core").NumberFormattingType.Currency>;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }, {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            }>]>;
            showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").SingleNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
                showValue: z.ZodBoolean;
                maxValue: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }, {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            }>, z.ZodObject<{
                type: z.ZodNativeEnum<typeof import("@teable/core").MultiNumberDisplayType>;
                color: z.ZodNativeEnum<typeof import("@teable/core").Colors>;
            }, "strict", z.ZodTypeAny, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }, {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            }>]>>;
            defaultValue: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        }, {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        }>, z.ZodObject<{
            expression: z.ZodLiteral<"AUTO_NUMBER()">;
        }, "strict", z.ZodTypeAny, {
            expression: "AUTO_NUMBER()";
        }, {
            expression: "AUTO_NUMBER()";
        }>, z.ZodObject<{
            expression: z.ZodLiteral<"CREATED_TIME()">;
            formatting: z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>;
        }, "strict", z.ZodTypeAny, {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        }, {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        }>, z.ZodObject<{
            expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
            formatting: z.ZodObject<{
                date: z.ZodString;
                time: z.ZodNativeEnum<typeof import("@teable/core").TimeFormatting>;
                timeZone: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }, {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            }>;
        }, "strict", z.ZodTypeAny, {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        }, {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        }>]>;
        meta: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            persistedAsGeneratedColumn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            persistedAsGeneratedColumn: boolean;
        }, {
            persistedAsGeneratedColumn?: boolean | undefined;
        }>, z.ZodObject<{
            hasOrderColumn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            hasOrderColumn: boolean;
        }, {
            hasOrderColumn?: boolean | undefined;
        }>]>>>;
        aiConfig: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Extraction>;
            sourceFieldId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Summary>;
            sourceFieldId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Translation>;
            sourceFieldId: z.ZodString;
            targetLanguage: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Improvement>;
            sourceFieldId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }>]>, z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Classification>;
            sourceFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            prompt: z.ZodString;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        }>]>, z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Tag>;
            sourceFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            prompt: z.ZodString;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        }>]>, z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            n: z.ZodOptional<z.ZodNumber>;
            size: z.ZodOptional<z.ZodString>;
            quality: z.ZodOptional<z.ZodNativeEnum<typeof import("@teable/core").ImageQuality>>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.ImageGeneration>;
            sourceFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            n: z.ZodOptional<z.ZodNumber>;
            size: z.ZodOptional<z.ZodString>;
            quality: z.ZodOptional<z.ZodNativeEnum<typeof import("@teable/core").ImageQuality>>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            prompt: z.ZodString;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        }>]>, z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Rating>;
            sourceFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }>]>, z.ZodUnion<[z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Extraction>;
            sourceFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        }>, z.ZodObject<{
            modelKey: z.ZodString;
            isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            attachPrompt: z.ZodOptional<z.ZodString>;
        } & {
            type: z.ZodLiteral<import("@teable/core").FieldAIActionType.Customization>;
            attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            prompt: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }, {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        }>]>]>>>;
        isLookup: z.ZodOptional<z.ZodBoolean>;
        isConditionalLookup: z.ZodOptional<z.ZodBoolean>;
        lookupOptions: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            baseId: z.ZodOptional<z.ZodString>;
            relationship: z.ZodNativeEnum<typeof import("@teable/core").Relationship>;
            foreignTableId: z.ZodString;
            lookupFieldId: z.ZodString;
            fkHostTableName: z.ZodString;
            selfKeyName: z.ZodString;
            foreignKeyName: z.ZodString;
            filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
            linkFieldId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        }, {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        }>, z.ZodObject<{
            baseId: z.ZodOptional<z.ZodString>;
            foreignTableId: z.ZodString;
            lookupFieldId: z.ZodString;
            filter: z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>;
            sort: z.ZodOptional<z.ZodObject<{
                fieldId: z.ZodString;
                order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
            }, "strip", z.ZodTypeAny, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }, {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        }, {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        }>]>>;
        notNull: z.ZodOptional<z.ZodBoolean>;
        unique: z.ZodOptional<z.ZodBoolean>;
        isPrimary: z.ZodOptional<z.ZodBoolean>;
        isComputed: z.ZodOptional<z.ZodBoolean>;
        isPending: z.ZodOptional<z.ZodBoolean>;
        hasError: z.ZodOptional<z.ZodBoolean>;
        cellValueType: z.ZodNativeEnum<typeof import("@teable/core").CellValueType>;
        isMultipleCellValue: z.ZodOptional<z.ZodBoolean>;
        dbFieldType: z.ZodNativeEnum<typeof import("@teable/core").DbFieldType>;
        dbFieldName: z.ZodString;
        recordRead: z.ZodOptional<z.ZodBoolean>;
        recordCreate: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn: boolean;
        } | {
            hasOrderColumn: boolean;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    }, {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn?: boolean | undefined;
        } | {
            hasOrderColumn?: boolean | undefined;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    }>, "many">;
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
            type: z.ZodLiteral<import("../aggregation").GroupPointType.Header>;
            depth: z.ZodNumber;
            value: z.ZodUnknown;
            isCollapsed: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }, {
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }>, z.ZodObject<{
            type: z.ZodLiteral<import("../aggregation").GroupPointType.Row>;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        }, {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        }>]>, "many">>>;
        plugin: z.ZodOptional<z.ZodObject<Omit<{
            pluginId: z.ZodString;
            pluginInstallId: z.ZodString;
            baseId: z.ZodString;
            name: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "baseId">, "strip", z.ZodTypeAny, {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        }, {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        groupPoints?: ({
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        plugin?: {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        groupPoints?: ({
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        plugin?: {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    tableId: string;
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
    fields: {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn: boolean;
        } | {
            hasOrderColumn: boolean;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    }[];
    shareId: string;
    viewId?: string | undefined;
    extra?: {
        groupPoints?: ({
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        plugin?: {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        } | undefined;
    } | undefined;
    view?: {
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    shareMeta?: {
        password?: string | undefined;
        allowCopy?: boolean | undefined;
        includeHiddenField?: boolean | undefined;
        includeRecords?: boolean | undefined;
        submit?: {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    tableId: string;
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
    fields: {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn?: boolean | undefined;
        } | {
            hasOrderColumn?: boolean | undefined;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    }[];
    shareId: string;
    viewId?: string | undefined;
    extra?: {
        groupPoints?: ({
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        plugin?: {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        } | undefined;
    } | undefined;
    view?: {
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    shareMeta?: {
        password?: string | undefined;
        allowCopy?: boolean | undefined;
        includeHiddenField?: boolean | undefined;
        includeRecords?: boolean | undefined;
        submit?: {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
export type ShareViewGetVo = z.infer<typeof shareViewGetVoSchema>;
export declare const ShareViewGetRouter: RouteConfig;
export declare const getShareView: (shareId: string) => Promise<import("axios").AxiosResponse<{
    tableId: string;
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
    fields: {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn: boolean;
        } | {
            hasOrderColumn: boolean;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    }[];
    shareId: string;
    viewId?: string | undefined;
    extra?: {
        groupPoints?: ({
            type: import("../aggregation").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        plugin?: {
            name: string;
            pluginInstallId: string;
            pluginId: string;
            url?: string | undefined;
            storage?: Record<string, unknown> | undefined;
        } | undefined;
    } | undefined;
    view?: {
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    shareMeta?: {
        password?: string | undefined;
        allowCopy?: boolean | undefined;
        includeHiddenField?: boolean | undefined;
        includeRecords?: boolean | undefined;
        submit?: {
            allow?: boolean | undefined;
            requireLogin?: boolean | undefined;
        } | undefined;
    } | undefined;
}, any>>;
export {};
