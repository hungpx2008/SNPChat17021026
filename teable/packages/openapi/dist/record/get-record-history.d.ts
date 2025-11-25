import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const getRecordHistoryQuerySchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    cursor?: string | null | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    cursor?: string | null | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const recordHistoryItemStateVoSchema: z.ZodObject<{
    meta: z.ZodObject<Pick<{
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
    }, "name" | "type" | "isLookup" | "isConditionalLookup" | "cellValueType"> & {
        options: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: import("@teable/core").FieldType;
        cellValueType: import("@teable/core").CellValueType;
        options?: unknown;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
    }, {
        name: string;
        type: import("@teable/core").FieldType;
        cellValueType: import("@teable/core").CellValueType;
        options?: unknown;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
    }>;
    data: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    meta: {
        name: string;
        type: import("@teable/core").FieldType;
        cellValueType: import("@teable/core").CellValueType;
        options?: unknown;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
    };
    data?: unknown;
}, {
    meta: {
        name: string;
        type: import("@teable/core").FieldType;
        cellValueType: import("@teable/core").CellValueType;
        options?: unknown;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
    };
    data?: unknown;
}>;
export declare const recordHistoryItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    tableId: z.ZodString;
    recordId: z.ZodString;
    fieldId: z.ZodString;
    before: z.ZodObject<{
        meta: z.ZodObject<Pick<{
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
        }, "name" | "type" | "isLookup" | "isConditionalLookup" | "cellValueType"> & {
            options: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        }, {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        }>;
        data: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    }, {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    }>;
    after: z.ZodObject<{
        meta: z.ZodObject<Pick<{
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
        }, "name" | "type" | "isLookup" | "isConditionalLookup" | "cellValueType"> & {
            options: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        }, {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        }>;
        data: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    }, {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    }>;
    createdTime: z.ZodString;
    createdBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    recordId: string;
    id: string;
    fieldId: string;
    before: {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    };
    after: {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    };
    createdBy: string;
    createdTime: string;
}, {
    tableId: string;
    recordId: string;
    id: string;
    fieldId: string;
    before: {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    };
    after: {
        meta: {
            name: string;
            type: import("@teable/core").FieldType;
            cellValueType: import("@teable/core").CellValueType;
            options?: unknown;
            isLookup?: boolean | undefined;
            isConditionalLookup?: boolean | undefined;
        };
        data?: unknown;
    };
    createdBy: string;
    createdTime: string;
}>;
export type IGetRecordHistoryQuery = z.infer<typeof getRecordHistoryQuerySchema>;
export type IRecordHistoryItemVo = z.infer<typeof recordHistoryItemVoSchema>;
export declare const recordHistoryVoSchema: z.ZodObject<{
    historyList: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tableId: z.ZodString;
        recordId: z.ZodString;
        fieldId: z.ZodString;
        before: z.ZodObject<{
            meta: z.ZodObject<Pick<{
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
            }, "name" | "type" | "isLookup" | "isConditionalLookup" | "cellValueType"> & {
                options: z.ZodUnknown;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            }, {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            }>;
            data: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        }, {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        }>;
        after: z.ZodObject<{
            meta: z.ZodObject<Pick<{
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
            }, "name" | "type" | "isLookup" | "isConditionalLookup" | "cellValueType"> & {
                options: z.ZodUnknown;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            }, {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            }>;
            data: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        }, {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        }>;
        createdTime: z.ZodString;
        createdBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }, {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }>, "many">;
    userMap: z.ZodRecord<z.ZodString, z.ZodObject<Pick<{
        userId: z.ZodString;
        userName: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<{
            readonly Owner: "owner";
            readonly Creator: "creator";
            readonly Editor: "editor";
            readonly Commenter: "commenter";
            readonly Viewer: "viewer";
        }>;
        avatar: z.ZodNullable<z.ZodString>;
        createdTime: z.ZodString;
        type: z.ZodLiteral<import("..").PrincipalType.User>;
        resourceType: z.ZodNativeEnum<typeof import("..").CollaboratorType>;
        isSystem: z.ZodOptional<z.ZodBoolean>;
        billable: z.ZodOptional<z.ZodBoolean>;
        base: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>>;
    }, "email" | "avatar"> & {
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>>;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    userMap: Record<string, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>;
    historyList: {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }[];
    nextCursor?: string | null | undefined;
}, {
    userMap: Record<string, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>;
    historyList: {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }[];
    nextCursor?: string | null | undefined;
}>;
export type IRecordHistoryVo = z.infer<typeof recordHistoryVoSchema>;
export declare const GET_RECORD_HISTORY_URL = "/table/{tableId}/record/{recordId}/history";
export declare const GetRecordHistoryRoute: RouteConfig;
export declare const getRecordHistory: (tableId: string, recordId: string, query: IGetRecordHistoryQuery) => Promise<import("axios").AxiosResponse<{
    userMap: Record<string, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>;
    historyList: {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }[];
    nextCursor?: string | null | undefined;
}, any>>;
