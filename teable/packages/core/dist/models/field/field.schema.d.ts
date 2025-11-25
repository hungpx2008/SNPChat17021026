import { z } from '../../zod';
import { CellValueType, DbFieldType, FieldType } from './constant';
export declare const fieldVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof FieldType>;
    description: z.ZodOptional<z.ZodString>;
    options: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }>, z.ZodObject<{
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
        defaultValue: z.ZodOptional<z.ZodEnum<["now"]>>;
    }, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
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
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strip", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>>;
        defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    }, "strict", z.ZodTypeAny, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }>, z.ZodObject<{
        icon: z.ZodNativeEnum<typeof import("./derivate/rating-option.schema").RatingIcon>;
        color: z.ZodEnum<[import("./colors").Colors.YellowBright, import("./colors").Colors.RedBright, import("./colors").Colors.TealBright]>;
        max: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    }, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
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
        color: z.ZodNativeEnum<typeof import("./colors").Colors>;
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
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    }, {
        color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
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
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>>;
        defaultValue: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        formatting: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        };
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    }, {
        formatting: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        };
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "strict", z.ZodTypeAny, {
        expression: "CREATED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        expression: "CREATED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }>, z.ZodObject<{
        expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "strict", z.ZodTypeAny, {
        expression: "LAST_MODIFIED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        expression: "LAST_MODIFIED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Summary>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Translation>;
        sourceFieldId: z.ZodString;
        targetLanguage: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Translation;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Improvement>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Classification>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Tag>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.ImageGeneration>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        n: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodString>;
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>]>, z.ZodUnion<[z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Rating>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        linkFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        filter: z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    }, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
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
    cellValueType: z.ZodNativeEnum<typeof CellValueType>;
    isMultipleCellValue: z.ZodOptional<z.ZodBoolean>;
    dbFieldType: z.ZodNativeEnum<typeof DbFieldType>;
    dbFieldName: z.ZodString;
    recordRead: z.ZodOptional<z.ZodBoolean>;
    recordCreate: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    dbFieldName: string;
    type: FieldType;
    options: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
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
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        };
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        expression: "AUTO_NUMBER()";
    } | {
        expression: "CREATED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        expression: "LAST_MODIFIED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    };
    cellValueType: CellValueType;
    dbFieldType: DbFieldType;
    description?: string | undefined;
    isMultipleCellValue?: boolean | undefined;
    meta?: {
        persistedAsGeneratedColumn: boolean;
    } | {
        hasOrderColumn: boolean;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
    } | {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
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
    type: FieldType;
    options: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
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
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        };
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        expression: "AUTO_NUMBER()";
    } | {
        expression: "CREATED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        expression: "LAST_MODIFIED_TIME()";
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    };
    cellValueType: CellValueType;
    dbFieldType: DbFieldType;
    description?: string | undefined;
    isMultipleCellValue?: boolean | undefined;
    meta?: {
        persistedAsGeneratedColumn?: boolean | undefined;
    } | {
        hasOrderColumn?: boolean | undefined;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
    } | {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
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
}>;
export type IFieldVo = z.infer<typeof fieldVoSchema>;
export type IFieldPropertyKey = keyof Omit<IFieldVo, 'id'>;
export declare const FIELD_RO_PROPERTIES: readonly ["type", "name", "dbFieldName", "isLookup", "isConditionalLookup", "description", "lookupOptions", "options"];
export declare const FIELD_VO_PROPERTIES: readonly ["type", "description", "options", "meta", "aiConfig", "name", "isLookup", "isConditionalLookup", "lookupOptions", "notNull", "unique", "isPrimary", "isComputed", "isPending", "hasError", "cellValueType", "isMultipleCellValue", "dbFieldType", "dbFieldName", "recordRead", "recordCreate"];
export declare const getOptionsSchema: (type: FieldType) => z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}> | z.ZodObject<Omit<{
    expression: z.ZodLiteral<"AUTO_NUMBER()">;
}, "expression">, "strip", z.ZodTypeAny, {}, {}>;
export declare const convertFieldRoSchema: z.ZodEffects<z.ZodObject<{
    dbFieldName: z.ZodOptional<z.ZodString>;
    type: z.ZodNativeEnum<typeof FieldType>;
    isLookup: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    isConditionalLookup: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    notNull: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    unique: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
} & {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lookupOptions: z.ZodOptional<z.ZodUnion<[z.ZodObject<Pick<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        linkFieldId: z.ZodString;
    }, "filter" | "foreignTableId" | "lookupFieldId" | "linkFieldId">, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        filter: z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    }, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    }>]>>;
    options: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }>, z.ZodObject<{
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
        defaultValue: z.ZodOptional<z.ZodEnum<["now"]>>;
    }, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
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
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strip", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>>;
        defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    }, "strict", z.ZodTypeAny, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }>, z.ZodObject<{
        icon: z.ZodNativeEnum<typeof import("./derivate/rating-option.schema").RatingIcon>;
        color: z.ZodEnum<[import("./colors").Colors.YellowBright, import("./colors").Colors.RedBright, import("./colors").Colors.TealBright]>;
        max: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    }, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
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
        color: z.ZodNativeEnum<typeof import("./colors").Colors>;
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
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    }, {
        color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }>, z.ZodObject<Pick<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "filter" | "baseId" | "foreignTableId" | "relationship" | "isOneWay" | "filterByViewId" | "visibleFieldIds"> & {
        lookupFieldId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }>, z.ZodObject<{
        choices: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            color: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }>, "many">;
        defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }, {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }>, z.ZodObject<{
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>>;
        showAs: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>>>;
        defaultValue: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    }, {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    }>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"AUTO_NUMBER()">;
    }, "expression">, "strict", z.ZodTypeAny, {}, {}>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"CREATED_TIME()">;
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "expression">, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "expression">, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }>, z.ZodObject<{
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>]>>;
    aiConfig: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Summary>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Translation>;
        sourceFieldId: z.ZodString;
        targetLanguage: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Translation;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Improvement>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Classification>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Tag>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.ImageGeneration>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        n: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodString>;
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>]>, z.ZodUnion<[z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Rating>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }>]>]>>>;
}, "strip", z.ZodTypeAny, {
    type: FieldType;
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}, {
    type: FieldType;
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}>, {
    type: FieldType;
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}, {
    type: FieldType;
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}>;
export declare const createFieldRoSchema: z.ZodEffects<z.ZodObject<{
    dbFieldName: z.ZodOptional<z.ZodString>;
    type: z.ZodNativeEnum<typeof FieldType>;
    isLookup: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    isConditionalLookup: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    notNull: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    unique: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
} & {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lookupOptions: z.ZodOptional<z.ZodUnion<[z.ZodObject<Pick<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        linkFieldId: z.ZodString;
    }, "filter" | "foreignTableId" | "lookupFieldId" | "linkFieldId">, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        filter: z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    }, {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    }>]>>;
    options: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
        timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        expression: string;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>, z.ZodObject<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }>, z.ZodObject<{
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
        defaultValue: z.ZodOptional<z.ZodEnum<["now"]>>;
    }, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
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
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strip", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>>;
        defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    }, "strict", z.ZodTypeAny, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }, {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    }>, z.ZodObject<{
        icon: z.ZodNativeEnum<typeof import("./derivate/rating-option.schema").RatingIcon>;
        color: z.ZodEnum<[import("./colors").Colors.YellowBright, import("./colors").Colors.RedBright, import("./colors").Colors.TealBright]>;
        max: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    }, {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
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
        color: z.ZodNativeEnum<typeof import("./colors").Colors>;
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
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    }, {
        color: import("./colors").Colors;
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
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
    } & {
        baseId: z.ZodOptional<z.ZodString>;
        foreignTableId: z.ZodOptional<z.ZodString>;
        lookupFieldId: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
        sort: z.ZodOptional<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("..").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("..").SortFunc;
        }, {
            fieldId: string;
            order: import("..").SortFunc;
        }>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }>, z.ZodObject<Pick<{
        baseId: z.ZodOptional<z.ZodString>;
        relationship: z.ZodNativeEnum<typeof import("./constant").Relationship>;
        foreignTableId: z.ZodString;
        lookupFieldId: z.ZodString;
        isOneWay: z.ZodOptional<z.ZodBoolean>;
        fkHostTableName: z.ZodString;
        selfKeyName: z.ZodString;
        foreignKeyName: z.ZodString;
        symmetricFieldId: z.ZodOptional<z.ZodString>;
        filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
        filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("..").IFilterSet, z.ZodTypeDef, import("..").IFilterSet>>>;
    }, "filter" | "baseId" | "foreignTableId" | "relationship" | "isOneWay" | "filterByViewId" | "visibleFieldIds"> & {
        lookupFieldId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }, {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    }>, z.ZodObject<{
        choices: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            color: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }>, "many">;
        defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }, {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }>, z.ZodObject<{
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>>;
        showAs: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>>>;
        defaultValue: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    }, {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    }>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"AUTO_NUMBER()">;
    }, "expression">, "strict", z.ZodTypeAny, {}, {}>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"CREATED_TIME()">;
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "expression">, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }>, z.ZodObject<Omit<{
        expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
        formatting: z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>;
    }, "expression">, "strict", z.ZodTypeAny, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    }>, z.ZodObject<{
        showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleLineTextDisplayType>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleLineTextDisplayType;
        }, {
            type: import("./show-as").SingleLineTextDisplayType;
        }>, z.ZodUnion<[z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").SingleNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
            showValue: z.ZodBoolean;
            maxValue: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }, {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        }>, z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./show-as").MultiNumberDisplayType>;
            color: z.ZodNativeEnum<typeof import("./colors").Colors>;
        }, "strict", z.ZodTypeAny, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }, {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        }>]>]>>;
        formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            date: z.ZodString;
            time: z.ZodNativeEnum<typeof import("./formatting").TimeFormatting>;
            timeZone: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }, {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        }>, z.ZodUnion<[z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Decimal>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Percent>;
        }, "strip", z.ZodTypeAny, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }, {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        }>, z.ZodObject<{
            precision: z.ZodNumber;
        } & {
            type: z.ZodLiteral<import("./formatting").NumberFormattingType.Currency>;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }, {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        }>]>]>>;
    }, "strict", z.ZodTypeAny, {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }, {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    }>]>>;
    aiConfig: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Summary>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Translation>;
        sourceFieldId: z.ZodString;
        targetLanguage: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Translation;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Improvement>;
        sourceFieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Classification>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Tag>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.ImageGeneration>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        n: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodString>;
        quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./ai-config").ImageQuality>>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        prompt: z.ZodString;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    }>]>, z.ZodUnion<[z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Rating>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
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
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Extraction>;
        sourceFieldId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    }>, z.ZodObject<{
        modelKey: z.ZodString;
        isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        attachPrompt: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<import("./ai-config").FieldAIActionType.Customization>;
        attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        prompt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }, {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    }>]>]>>>;
} & {
    id: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodObject<{
        viewId: z.ZodString;
        orderIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        viewId: string;
        orderIndex: number;
    }, {
        viewId: string;
        orderIndex: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: FieldType;
    description?: string | null | undefined;
    id?: string | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    order?: {
        viewId: string;
        orderIndex: number;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}, {
    type: FieldType;
    description?: string | null | undefined;
    id?: string | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    order?: {
        viewId: string;
        orderIndex: number;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}>, {
    type: FieldType;
    description?: string | null | undefined;
    id?: string | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    order?: {
        viewId: string;
        orderIndex: number;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}, {
    type: FieldType;
    description?: string | null | undefined;
    id?: string | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
    options?: {} | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("..").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
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
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        relationship: import("./constant").Relationship;
        fkHostTableName: string;
        selfKeyName: string;
        foreignKeyName: string;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        isOneWay?: boolean | undefined;
        symmetricFieldId?: string | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    } | {
        defaultValue?: boolean | undefined;
    } | {
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | undefined;
        defaultValue?: string | undefined;
    } | {
        max: number;
        color: import("./colors").Colors.RedBright | import("./colors").Colors.TealBright | import("./colors").Colors.YellowBright;
        icon: import("./derivate/rating-option.schema").RatingIcon;
    } | {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    } | {} | {} | {
        color: import("./colors").Colors;
        label: string;
        maxCount?: number | undefined;
        resetCount?: boolean | undefined;
        workflow?: {
            id?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
        } | null | undefined;
    } | {} | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        formatting: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        };
    } | {
        foreignTableId: string;
        relationship: import("./constant").Relationship;
        filter?: import("..").IFilterSet | null | undefined;
        baseId?: string | undefined;
        lookupFieldId?: string | undefined;
        isOneWay?: boolean | undefined;
        filterByViewId?: string | null | undefined;
        visibleFieldIds?: string[] | null | undefined;
    } | {
        formatting?: {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
        defaultValue?: number | undefined;
    } | {
        choices: {
            name: string;
            id?: string | undefined;
            color?: string | undefined;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    } | {
        formatting?: {
            date: string;
            timeZone: string;
            time: import("./formatting").TimeFormatting;
        } | {
            type: import("./formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("./formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("./formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
        showAs?: {
            type: import("./show-as").SingleLineTextDisplayType;
        } | {
            type: import("./show-as").SingleNumberDisplayType;
            color: import("./colors").Colors;
            showValue: boolean;
            maxValue: number;
        } | {
            type: import("./show-as").MultiNumberDisplayType;
            color: import("./colors").Colors;
        } | undefined;
    } | undefined;
    order?: {
        viewId: string;
        orderIndex: number;
    } | undefined;
    aiConfig?: {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Summary;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Translation;
        modelKey: string;
        sourceFieldId: string;
        targetLanguage: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Improvement;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Classification;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Tag;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        onlyAllowConfiguredOptions?: boolean | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.ImageGeneration;
        modelKey: string;
        sourceFieldId: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        n?: number | undefined;
        size?: string | undefined;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
        quality?: import("./ai-config").ImageQuality | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Rating;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Extraction;
        modelKey: string;
        sourceFieldId: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
    } | {
        type: import("./ai-config").FieldAIActionType.Customization;
        modelKey: string;
        prompt: string;
        isAutoFill?: boolean | null | undefined;
        attachPrompt?: string | undefined;
        attachmentFieldIds?: string[] | undefined;
    } | null | undefined;
    isLookup?: boolean | undefined;
    isConditionalLookup?: boolean | undefined;
    lookupOptions?: {
        filter: import("..").IFilterSet | null;
        foreignTableId: string;
        lookupFieldId: string;
        sort?: {
            fieldId: string;
            order: import("..").SortFunc;
        } | undefined;
        baseId?: string | undefined;
        limit?: number | undefined;
    } | {
        foreignTableId: string;
        lookupFieldId: string;
        linkFieldId: string;
        filter?: import("..").IFilterSet | null | undefined;
    } | undefined;
    notNull?: boolean | undefined;
    unique?: boolean | undefined;
}>;
export declare const updateFieldRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dbFieldName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
}, {
    description?: string | null | undefined;
    name?: string | undefined;
    dbFieldName?: string | undefined;
}>;
export type IFieldRo = z.infer<typeof createFieldRoSchema>;
export type IConvertFieldRo = z.infer<typeof convertFieldRoSchema>;
export type IUpdateFieldRo = z.infer<typeof updateFieldRoSchema>;
export declare const getFieldsQuerySchema: z.ZodObject<{
    viewId: z.ZodOptional<z.ZodString>;
    filterHidden: z.ZodOptional<z.ZodBoolean>;
    projection: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    viewId?: string | undefined;
    filterHidden?: boolean | undefined;
    projection?: string[] | undefined;
}, {
    viewId?: string | undefined;
    filterHidden?: boolean | undefined;
    projection?: string[] | undefined;
}>;
export type IGetFieldsQuery = z.infer<typeof getFieldsQuerySchema>;
