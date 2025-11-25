import { z } from '../../zod';
import { ViewType } from './constant';
export declare const sharePasswordSchema: z.ZodString;
export declare const shareViewMetaSchema: z.ZodObject<{
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
}>;
export type IShareViewMeta = z.infer<typeof shareViewMetaSchema>;
export declare const viewVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof ViewType>;
    description: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        rowHeight: z.ZodOptional<z.ZodNativeEnum<typeof import("./constant").RowHeightLevel>>;
        fieldNameDisplayLines: z.ZodOptional<z.ZodNumber>;
        frozenColumnCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        rowHeight?: import("./constant").RowHeightLevel | undefined;
        fieldNameDisplayLines?: number | undefined;
        frozenColumnCount?: number | undefined;
    }, {
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
            type: z.ZodNativeEnum<typeof import("./derivate/calendar-view-option.schema").ColorConfigType>;
            fieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            color: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("..").Colors>>>;
        }, "strip", z.ZodTypeAny, {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        }, {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        }>>>;
    }, "strict", z.ZodTypeAny, {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    }, {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
            order: z.ZodNativeEnum<typeof import("./sort").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("./sort").SortFunc;
        }, {
            fieldId: string;
            order: import("./sort").SortFunc;
        }>, "many">;
        manualSort: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    }, {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    }>>>;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("./filter").IFilterSet, z.ZodTypeDef, import("./filter").IFilterSet>>>;
    group: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof import("./sort").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: import("./sort").SortFunc;
    }, {
        fieldId: string;
        order: import("./sort").SortFunc;
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
        statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof import("..").StatisticsFunc>>>;
    }, "strict", z.ZodTypeAny, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
    }, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    type: ViewType;
    columnMeta: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
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
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
        order: import("./sort").SortFunc;
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
    type: ViewType;
    columnMeta: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
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
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
        order: import("./sort").SortFunc;
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
}>;
export type IViewVo = z.infer<typeof viewVoSchema>;
export declare const viewRoSchema: z.ZodEffects<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("./filter").IFilterSet, z.ZodTypeDef, import("./filter").IFilterSet>>>;
    sort: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        sortObjs: z.ZodArray<z.ZodObject<{
            fieldId: z.ZodString;
            order: z.ZodNativeEnum<typeof import("./sort").SortFunc>;
        }, "strip", z.ZodTypeAny, {
            fieldId: string;
            order: import("./sort").SortFunc;
        }, {
            fieldId: string;
            order: import("./sort").SortFunc;
        }>, "many">;
        manualSort: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    }, {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    }>>>;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodNativeEnum<typeof ViewType>;
    options: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        rowHeight: z.ZodOptional<z.ZodNativeEnum<typeof import("./constant").RowHeightLevel>>;
        fieldNameDisplayLines: z.ZodOptional<z.ZodNumber>;
        frozenColumnCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        rowHeight?: import("./constant").RowHeightLevel | undefined;
        fieldNameDisplayLines?: number | undefined;
        frozenColumnCount?: number | undefined;
    }, {
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
            type: z.ZodNativeEnum<typeof import("./derivate/calendar-view-option.schema").ColorConfigType>;
            fieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            color: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof import("..").Colors>>>;
        }, "strip", z.ZodTypeAny, {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        }, {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        }>>>;
    }, "strict", z.ZodTypeAny, {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
            fieldId?: string | null | undefined;
        } | null | undefined;
    }, {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
    order: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    columnMeta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        order: z.ZodNumber;
    } & {
        width: z.ZodOptional<z.ZodNumber>;
        hidden: z.ZodOptional<z.ZodBoolean>;
        statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof import("..").StatisticsFunc>>>;
    }, "strict", z.ZodTypeAny, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
    }, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    }>]>>>;
    group: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof import("./sort").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: import("./sort").SortFunc;
    }, {
        fieldId: string;
        order: import("./sort").SortFunc;
    }>, "many">>>;
    isLocked: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
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
}, "strip", z.ZodTypeAny, {
    type: ViewType;
    description?: string | undefined;
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null | undefined;
    name?: string | undefined;
    options?: {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
    columnMeta?: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    }> | undefined;
    group?: {
        fieldId: string;
        order: import("./sort").SortFunc;
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
    type: ViewType;
    description?: string | undefined;
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null | undefined;
    name?: string | undefined;
    options?: {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
    columnMeta?: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    }> | undefined;
    group?: {
        fieldId: string;
        order: import("./sort").SortFunc;
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
}>, {
    type: ViewType;
    description?: string | undefined;
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null | undefined;
    name?: string | undefined;
    options?: {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
    columnMeta?: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    }> | undefined;
    group?: {
        fieldId: string;
        order: import("./sort").SortFunc;
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
    type: ViewType;
    description?: string | undefined;
    filter?: import("./filter").IFilterSet | null | undefined;
    sort?: {
        sortObjs: {
            fieldId: string;
            order: import("./sort").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null | undefined;
    name?: string | undefined;
    options?: {
        startDateFieldId?: string | null | undefined;
        endDateFieldId?: string | null | undefined;
        titleFieldId?: string | null | undefined;
        colorConfig?: {
            type: import("./derivate/calendar-view-option.schema").ColorConfigType;
            color?: import("..").Colors | null | undefined;
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
        rowHeight?: import("./constant").RowHeightLevel | undefined;
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
    columnMeta?: Record<string, {
        order: number;
        width?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("..").StatisticsFunc | null | undefined;
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
    }> | undefined;
    group?: {
        fieldId: string;
        order: import("./sort").SortFunc;
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
}>;
export type IViewRo = z.infer<typeof viewRoSchema>;
export type IViewPropertyKeys = keyof IViewVo;
export declare const VIEW_JSON_KEYS: string[];
