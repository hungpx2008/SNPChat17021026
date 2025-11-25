import { baseFilterSetSchema, StatisticsFunc } from '@teable/core';
import { z } from '../../zod';
export declare enum BaseQueryColumnType {
    Aggregation = "aggregation",
    Field = "field"
}
export declare const baseQueryColumnTypeSchema: z.ZodNativeEnum<typeof BaseQueryColumnType>;
export declare const baseQueryFilterItemSchema: z.ZodObject<{
    column: z.ZodString;
    type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
    value: z.ZodNullable<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>, "atleastone">, z.ZodEffects<z.ZodObject<{
        mode: z.ZodUnion<[z.ZodLiteral<"today">, z.ZodLiteral<"tomorrow">, z.ZodLiteral<"yesterday">, z.ZodLiteral<"currentWeek">, z.ZodLiteral<"lastWeek">, z.ZodLiteral<"nextWeekPeriod">, z.ZodLiteral<"currentMonth">, z.ZodLiteral<"lastMonth">, z.ZodLiteral<"nextMonthPeriod">, z.ZodLiteral<"currentYear">, z.ZodLiteral<"lastYear">, z.ZodLiteral<"nextYearPeriod">, z.ZodLiteral<"oneWeekAgo">, z.ZodLiteral<"oneWeekFromNow">, z.ZodLiteral<"oneMonthAgo">, z.ZodLiteral<"oneMonthFromNow">, z.ZodLiteral<"daysAgo">, z.ZodLiteral<"daysFromNow">, z.ZodLiteral<"exactDate">, z.ZodLiteral<"exactFormatDate">, z.ZodLiteral<"pastWeek">, z.ZodLiteral<"pastMonth">, z.ZodLiteral<"pastYear">, z.ZodLiteral<"nextWeek">, z.ZodLiteral<"nextMonth">, z.ZodLiteral<"nextYear">, z.ZodLiteral<"pastNumberOfDays">, z.ZodLiteral<"nextNumberOfDays">]>;
        numberOfDays: z.ZodOptional<z.ZodNumber>;
        exactDate: z.ZodOptional<z.ZodString>;
        timeZone: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    }, {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    }>, {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    }, {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"field">;
        fieldId: z.ZodString;
        tableId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    }, {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    }>]>>;
    operator: z.ZodUnion<[z.ZodLiteral<"is">, z.ZodLiteral<"isNot">, z.ZodLiteral<"contains">, z.ZodLiteral<"doesNotContain">, z.ZodLiteral<"isGreater">, z.ZodLiteral<"isGreaterEqual">, z.ZodLiteral<"isLess">, z.ZodLiteral<"isLessEqual">, z.ZodLiteral<"isEmpty">, z.ZodLiteral<"isNotEmpty">, z.ZodLiteral<"isAnyOf">, z.ZodLiteral<"isNoneOf">, z.ZodLiteral<"hasAnyOf">, z.ZodLiteral<"hasAllOf">, z.ZodLiteral<"isNotExactly">, z.ZodLiteral<"hasNoneOf">, z.ZodLiteral<"isExactly">, z.ZodLiteral<"isWithIn">, z.ZodLiteral<"isBefore">, z.ZodLiteral<"isAfter">, z.ZodLiteral<"isOnOrBefore">, z.ZodLiteral<"isOnOrAfter">]>;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryColumnType;
    value: string | number | boolean | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | [string | number | boolean, ...(string | number | boolean)[]] | null;
    column: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "isEmpty" | "isNotEmpty" | "isAnyOf" | "isNoneOf" | "hasAnyOf" | "hasAllOf" | "isNotExactly" | "hasNoneOf" | "isExactly" | "isWithIn" | "isBefore" | "isAfter" | "isOnOrBefore" | "isOnOrAfter";
}, {
    type: BaseQueryColumnType;
    value: string | number | boolean | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | [string | number | boolean, ...(string | number | boolean)[]] | null;
    column: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "isEmpty" | "isNotEmpty" | "isAnyOf" | "isNoneOf" | "hasAnyOf" | "hasAllOf" | "isNotExactly" | "hasNoneOf" | "isExactly" | "isWithIn" | "isBefore" | "isAfter" | "isOnOrBefore" | "isOnOrAfter";
}>;
export type IBaseQueryFilterItem = z.infer<typeof baseQueryFilterItemSchema>;
export type IBaseQueryFilterSet = z.infer<typeof baseFilterSetSchema> & {
    filterSet: (IBaseQueryFilterItem | IBaseQueryFilterSet)[];
};
export declare const baseQueryFilterItemExtendSchema: z.ZodType<{
    type: BaseQueryColumnType;
    value: string | number | boolean | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | [string | number | boolean, ...(string | number | boolean)[]] | null;
    column: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "isEmpty" | "isNotEmpty" | "isAnyOf" | "isNoneOf" | "hasAnyOf" | "hasAllOf" | "isNotExactly" | "hasNoneOf" | "isExactly" | "isWithIn" | "isBefore" | "isAfter" | "isOnOrBefore" | "isOnOrAfter";
}, z.ZodTypeDef, {
    type: BaseQueryColumnType;
    value: string | number | boolean | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | [string | number | boolean, ...(string | number | boolean)[]] | null;
    column: string;
    operator: "is" | "isNot" | "contains" | "doesNotContain" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "isEmpty" | "isNotEmpty" | "isAnyOf" | "isNoneOf" | "hasAnyOf" | "hasAllOf" | "isNotExactly" | "hasNoneOf" | "isExactly" | "isWithIn" | "isBefore" | "isAfter" | "isOnOrBefore" | "isOnOrAfter";
}>;
export declare const baseQueryFilter: z.ZodType<IBaseQueryFilterSet>;
export type IBaseQueryFilter = z.infer<typeof baseQueryFilter>;
export declare enum BaseQueryJoinType {
    Inner = "INNER JOIN",
    Left = "LEFT JOIN",
    Right = "RIGHT JOIN",
    Full = "FULL JOIN"
}
export declare const baseQueryJoinTypeSchema: z.ZodNativeEnum<typeof BaseQueryJoinType>;
export declare const baseQueryJoinSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof BaseQueryJoinType>;
    table: z.ZodString;
    on: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryJoinType;
    table: string;
    on: string[];
}, {
    type: BaseQueryJoinType;
    table: string;
    on: string[];
}>;
export type IBaseQueryJoin = z.infer<typeof baseQueryJoinSchema>;
declare const baseQueryOrderBySchema: z.ZodArray<z.ZodObject<{
    column: z.ZodString;
    type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
    order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryColumnType;
    order: import("@teable/core").SortFunc;
    column: string;
}, {
    type: BaseQueryColumnType;
    order: import("@teable/core").SortFunc;
    column: string;
}>, "many">;
export type IBaseQueryOrderBy = z.infer<typeof baseQueryOrderBySchema>;
export declare const baseQueryGroupBySchema: z.ZodArray<z.ZodObject<{
    column: z.ZodString;
    type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryColumnType;
    column: string;
}, {
    type: BaseQueryColumnType;
    column: string;
}>, "many">;
export type IBaseQueryGroupBy = z.infer<typeof baseQueryGroupBySchema>;
export declare const baseQueryAggregationSchema: z.ZodArray<z.ZodObject<{
    column: z.ZodString;
    type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
    statisticFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryColumnType;
    column: string;
    statisticFunc: StatisticsFunc;
}, {
    type: BaseQueryColumnType;
    column: string;
    statisticFunc: StatisticsFunc;
}>, "many">;
export type IQueryAggregation = z.infer<typeof baseQueryAggregationSchema>;
export declare const baseQuerySelectSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
    column: z.ZodString;
    alias: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: BaseQueryColumnType;
    column: string;
    alias?: string | undefined;
}, {
    type: BaseQueryColumnType;
    column: string;
    alias?: string | undefined;
}>;
export type IBaseQuerySelect = z.infer<typeof baseQuerySelectSchema>;
export declare const baseQueryNormalSqlQuery: z.ZodObject<{
    select: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
        column: z.ZodString;
        alias: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: BaseQueryColumnType;
        column: string;
        alias?: string | undefined;
    }, {
        type: BaseQueryColumnType;
        column: string;
        alias?: string | undefined;
    }>, "many">>;
    groupBy: z.ZodOptional<z.ZodArray<z.ZodObject<{
        column: z.ZodString;
        type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
    }, "strip", z.ZodTypeAny, {
        type: BaseQueryColumnType;
        column: string;
    }, {
        type: BaseQueryColumnType;
        column: string;
    }>, "many">>;
    orderBy: z.ZodOptional<z.ZodArray<z.ZodObject<{
        column: z.ZodString;
        type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
        order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        type: BaseQueryColumnType;
        order: import("@teable/core").SortFunc;
        column: string;
    }, {
        type: BaseQueryColumnType;
        order: import("@teable/core").SortFunc;
        column: string;
    }>, "many">>;
    where: z.ZodOptional<z.ZodType<IBaseQueryFilterSet, z.ZodTypeDef, IBaseQueryFilterSet>>;
    join: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof BaseQueryJoinType>;
        table: z.ZodString;
        on: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: BaseQueryJoinType;
        table: string;
        on: string[];
    }, {
        type: BaseQueryJoinType;
        table: string;
        on: string[];
    }>, "many">>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
    aggregation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        column: z.ZodString;
        type: z.ZodNativeEnum<typeof BaseQueryColumnType>;
        statisticFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
    }, "strip", z.ZodTypeAny, {
        type: BaseQueryColumnType;
        column: string;
        statisticFunc: StatisticsFunc;
    }, {
        type: BaseQueryColumnType;
        column: string;
        statisticFunc: StatisticsFunc;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    join?: {
        type: BaseQueryJoinType;
        table: string;
        on: string[];
    }[] | undefined;
    orderBy?: {
        type: BaseQueryColumnType;
        order: import("@teable/core").SortFunc;
        column: string;
    }[] | undefined;
    groupBy?: {
        type: BaseQueryColumnType;
        column: string;
    }[] | undefined;
    aggregation?: {
        type: BaseQueryColumnType;
        column: string;
        statisticFunc: StatisticsFunc;
    }[] | undefined;
    select?: {
        type: BaseQueryColumnType;
        column: string;
        alias?: string | undefined;
    }[] | undefined;
    where?: IBaseQueryFilterSet | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}, {
    join?: {
        type: BaseQueryJoinType;
        table: string;
        on: string[];
    }[] | undefined;
    orderBy?: {
        type: BaseQueryColumnType;
        order: import("@teable/core").SortFunc;
        column: string;
    }[] | undefined;
    groupBy?: {
        type: BaseQueryColumnType;
        column: string;
    }[] | undefined;
    aggregation?: {
        type: BaseQueryColumnType;
        column: string;
        statisticFunc: StatisticsFunc;
    }[] | undefined;
    select?: {
        type: BaseQueryColumnType;
        column: string;
        alias?: string | undefined;
    }[] | undefined;
    where?: IBaseQueryFilterSet | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export type IBaseQueryNormalSqlQuery = z.infer<typeof baseQueryNormalSqlQuery>;
export type IBaseQuery = IBaseQueryNormalSqlQuery & {
    from: string | IBaseQuery;
};
export declare const baseQuerySchema: z.ZodType<IBaseQuery>;
export {};
