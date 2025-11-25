import type { IFieldVo, IViewVo, IFilter, IFilterItem, IFilterSet } from '@teable/core';
import { ColorConfigType, ViewType } from '@teable/core';
import type { GridView, KanbanView, GalleryView, CalendarView, FormView } from '../model';
import type { PluginView } from '../model/view/plugin.view';
export declare const validatePersonalViewProps: (view: IViewVo, fields: IFieldVo[]) => {
    createdTime: string;
    createdBy: string;
    id: string;
    name: string;
    type: ViewType;
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
    filter?: IFilterSet | null | undefined;
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
            type: ColorConfigType;
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
};
export declare const validateFilterItem: (item: IFilterItem, fieldMap: Record<string, IFieldVo>) => {
    value: string | number | boolean | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | [string | number | boolean, ...(string | number | boolean)[]] | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | null;
    fieldId: string;
    operator: "is" | "contains" | "isNot" | "doesNotContain" | "isEmpty" | "isNotEmpty" | "isGreater" | "isGreaterEqual" | "isLess" | "isLessEqual" | "isAnyOf" | "isNoneOf" | "hasAnyOf" | "hasAllOf" | "hasNoneOf" | "isExactly" | "isWithIn" | "isBefore" | "isAfter" | "isOnOrBefore" | "isOnOrAfter" | "isNotExactly";
    isSymbol?: false | undefined;
} | {
    value: string | number | boolean | [string | number | boolean, ...(string | number | boolean)[]] | {
        timeZone: string;
        mode: "today" | "tomorrow" | "yesterday" | "oneWeekAgo" | "oneWeekFromNow" | "oneMonthAgo" | "oneMonthFromNow" | "daysAgo" | "daysFromNow" | "exactDate" | "exactFormatDate" | "currentWeek" | "currentMonth" | "currentYear" | "lastWeek" | "lastMonth" | "lastYear" | "nextWeekPeriod" | "nextMonthPeriod" | "nextYearPeriod" | "pastWeek" | "pastMonth" | "pastYear" | "nextWeek" | "nextMonth" | "nextYear" | "pastNumberOfDays" | "nextNumberOfDays";
        exactDate?: string | undefined;
        numberOfDays?: number | undefined;
    } | {
        type: "field";
        fieldId: string;
        tableId?: string | undefined;
    } | null;
    fieldId: string;
    isSymbol: true;
    operator: "=" | ">" | "<" | "!=" | ">=" | "<=" | "LIKE" | "IN" | "HAS" | "NOT LIKE" | "NOT IN" | "IS NULL" | "IS NOT NULL";
} | null;
export declare const validateViewFilter: (filter: IFilter, fieldMap: Record<string, IFieldVo>) => IFilterSet | null | undefined;
export declare const validateViewOptions: (view: IViewVo, fieldMap: Record<string, IFieldVo>) => {
    startDateFieldId?: string | null | undefined;
    endDateFieldId?: string | null | undefined;
    titleFieldId?: string | null | undefined;
    colorConfig?: {
        type: ColorConfigType;
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
    pluginId: string;
    pluginInstallId: string;
    pluginLogo: string;
} | undefined;
export declare const generatePersonalViewProps: (view: GridView | KanbanView | GalleryView | CalendarView | FormView | PluginView | undefined) => {
    id?: undefined;
    type?: undefined;
    filter?: undefined;
    sort?: undefined;
    group?: undefined;
    options?: undefined;
    columnMeta?: undefined;
} | {
    id: string;
    type: ViewType.Grid | ViewType.Calendar | ViewType.Kanban | ViewType.Gallery;
    filter: IFilterSet | null | undefined;
    sort: {
        sortObjs: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null | undefined;
    group: {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | null | undefined;
    options: ({
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: ColorConfigType;
            color?: import("@teable/core").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    } & ({
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
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
    } | {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: ColorConfigType;
            color?: import("@teable/core").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    } | {
        coverUrl?: string | undefined;
        logoUrl?: string | undefined;
        submitLabel?: string | undefined;
    } | {
        pluginId: string;
        pluginInstallId: string;
        pluginLogo: string;
    })) | ({
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
    } & ({
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
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
    } | {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: ColorConfigType;
            color?: import("@teable/core").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    } | {
        coverUrl?: string | undefined;
        logoUrl?: string | undefined;
        submitLabel?: string | undefined;
    } | {
        pluginId: string;
        pluginInstallId: string;
        pluginLogo: string;
    })) | ({
        rowHeight?: import("@teable/core").RowHeightLevel | undefined;
        fieldNameDisplayLines?: number | undefined;
        frozenColumnCount?: number | undefined;
    } & ({
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
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
    } | {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: ColorConfigType;
            color?: import("@teable/core").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    } | {
        coverUrl?: string | undefined;
        logoUrl?: string | undefined;
        submitLabel?: string | undefined;
    } | {
        pluginId: string;
        pluginInstallId: string;
        pluginLogo: string;
    })) | ({
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
        stackFieldId?: string | undefined;
        isEmptyStackHidden?: boolean | undefined;
    } & ({
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
        coverFieldId?: string | null | undefined;
        isCoverFit?: boolean | undefined;
        isFieldNameHidden?: boolean | undefined;
    } | {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: ColorConfigType;
            color?: import("@teable/core").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    } | {
        coverUrl?: string | undefined;
        logoUrl?: string | undefined;
        submitLabel?: string | undefined;
    } | {
        pluginId: string;
        pluginInstallId: string;
        pluginLogo: string;
    }));
    columnMeta: (Record<string, {
        order: number;
        visible?: boolean | undefined;
    }> & Record<string, {
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
    }>) | (Record<string, {
        order: number;
        visible?: boolean | undefined;
    }> & Record<string, {
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
    }>) | (Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
    }> & Record<string, {
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
    }>) | (Record<string, {
        order: number;
        visible?: boolean | undefined;
    }> & Record<string, {
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
    }>);
};
