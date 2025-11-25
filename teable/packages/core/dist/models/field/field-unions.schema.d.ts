import { z } from '../../zod';
export declare const unionFieldOptions: z.ZodUnion<[z.ZodObject<{
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
}>]>;
export declare const commonOptionsSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const unionFieldOptionsVoSchema: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
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
export declare const unionFieldOptionsRoSchema: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
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
}>]>;
export declare const unionFieldMetaVoSchema: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
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
}>]>>;
export type IFieldOptionsRo = z.infer<typeof unionFieldOptionsRoSchema>;
export type IFieldOptionsVo = z.infer<typeof unionFieldOptionsVoSchema>;
export type IFieldMetaVo = z.infer<typeof unionFieldMetaVoSchema>;
