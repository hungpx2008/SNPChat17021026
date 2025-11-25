import { z } from '../../zod';
import { StatisticsFunc } from '../aggregation';
export declare const fieldsViewVisibleRoSchema: z.ZodObject<{
    viewFields: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        hidden: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        hidden: boolean;
    }, {
        fieldId: string;
        hidden: boolean;
    }>, "atleastone">;
}, "strip", z.ZodTypeAny, {
    viewFields: [{
        fieldId: string;
        hidden: boolean;
    }, ...{
        fieldId: string;
        hidden: boolean;
    }[]];
}, {
    viewFields: [{
        fieldId: string;
        hidden: boolean;
    }, ...{
        fieldId: string;
        hidden: boolean;
    }[]];
}>;
export type IColumnMeta = z.infer<typeof columnMetaSchema>;
export type IGridColumnMeta = z.infer<typeof gridColumnMetaSchema>;
export type IKanbanColumnMeta = z.infer<typeof kanbanColumnMetaSchema>;
export type IGalleryColumnMeta = z.infer<typeof galleryColumnMetaSchema>;
export type ICalendarColumnMeta = z.infer<typeof calendarColumnMetaSchema>;
export type IFormColumnMeta = z.infer<typeof formColumnMetaSchema>;
export type IPluginColumnMeta = z.infer<typeof pluginColumnMetaSchema>;
export type IColumn = z.infer<typeof columnSchema>;
export type IGridColumn = z.infer<typeof gridColumnSchema>;
export type IKanbanColumn = z.infer<typeof kanbanColumnSchema>;
export type IFormColumn = z.infer<typeof formColumnSchema>;
export type IPluginColumn = z.infer<typeof pluginColumnSchema>;
export declare const columnSchemaBase: z.ZodObject<{
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    order: number;
}, {
    order: number;
}>;
export declare const gridColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    width: z.ZodOptional<z.ZodNumber>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof StatisticsFunc>>>;
}, "strip", z.ZodTypeAny, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}>;
export declare const kanbanColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>;
export declare const galleryColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>;
export declare const calendarColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>;
export declare const formColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    required?: boolean | undefined;
    visible?: boolean | undefined;
}, {
    order: number;
    required?: boolean | undefined;
    visible?: boolean | undefined;
}>;
export declare const pluginColumnSchema: z.ZodObject<{
    order: z.ZodNumber;
} & {
    hidden: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    hidden?: boolean | undefined;
}, {
    order: number;
    hidden?: boolean | undefined;
}>;
export declare const columnSchema: z.ZodUnion<[z.ZodObject<{
    order: z.ZodNumber;
} & {
    width: z.ZodOptional<z.ZodNumber>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof StatisticsFunc>>>;
}, "strict", z.ZodTypeAny, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
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
}>]>;
export declare const columnMetaSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    order: z.ZodNumber;
} & {
    width: z.ZodOptional<z.ZodNumber>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof StatisticsFunc>>>;
}, "strict", z.ZodTypeAny, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
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
export declare const gridColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    width: z.ZodOptional<z.ZodNumber>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    statisticFunc: z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof StatisticsFunc>>>;
}, "strip", z.ZodTypeAny, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}, {
    order: number;
    width?: number | undefined;
    hidden?: boolean | undefined;
    statisticFunc?: StatisticsFunc | null | undefined;
}>>;
export declare const kanbanColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>>;
export declare const galleryColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>>;
export declare const calendarColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    visible?: boolean | undefined;
}, {
    order: number;
    visible?: boolean | undefined;
}>>;
export declare const formColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    visible: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    required?: boolean | undefined;
    visible?: boolean | undefined;
}, {
    order: number;
    required?: boolean | undefined;
    visible?: boolean | undefined;
}>>;
export declare const pluginColumnMetaSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    order: z.ZodNumber;
} & {
    hidden: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    order: number;
    hidden?: boolean | undefined;
}, {
    order: number;
    hidden?: boolean | undefined;
}>>;
export declare const columnMetaRoSchema: z.ZodArray<z.ZodObject<{
    fieldId: z.ZodString;
    columnMeta: z.ZodUnion<[z.ZodObject<{
        order: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        hidden: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        statisticFunc: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNativeEnum<typeof StatisticsFunc>>>>;
    }, "strict", z.ZodTypeAny, {
        width?: number | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: StatisticsFunc | null | undefined;
    }, {
        width?: number | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: StatisticsFunc | null | undefined;
    }>, z.ZodObject<{
        order: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strict", z.ZodTypeAny, {
        order?: number | undefined;
        visible?: boolean | undefined;
    }, {
        order?: number | undefined;
        visible?: boolean | undefined;
    }>, z.ZodObject<{
        order: z.ZodOptional<z.ZodNumber>;
        visible: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        required: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strict", z.ZodTypeAny, {
        required?: boolean | undefined;
        order?: number | undefined;
        visible?: boolean | undefined;
    }, {
        required?: boolean | undefined;
        order?: number | undefined;
        visible?: boolean | undefined;
    }>, z.ZodObject<{
        order: z.ZodOptional<z.ZodNumber>;
        hidden: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strict", z.ZodTypeAny, {
        order?: number | undefined;
        hidden?: boolean | undefined;
    }, {
        order?: number | undefined;
        hidden?: boolean | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    columnMeta: {
        width?: number | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: StatisticsFunc | null | undefined;
    } | {
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        required?: boolean | undefined;
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        order?: number | undefined;
        hidden?: boolean | undefined;
    };
}, {
    fieldId: string;
    columnMeta: {
        width?: number | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: StatisticsFunc | null | undefined;
    } | {
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        required?: boolean | undefined;
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        order?: number | undefined;
        hidden?: boolean | undefined;
    };
}>, "many">;
export type IColumnMetaRo = z.infer<typeof columnMetaRoSchema>;
export type IFieldsViewVisibleRo = z.infer<typeof fieldsViewVisibleRoSchema>;
