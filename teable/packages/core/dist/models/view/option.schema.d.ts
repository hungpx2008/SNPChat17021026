import { z } from '../../zod';
import { ViewType } from './constant';
export declare const viewOptionsSchema: z.ZodUnion<[z.ZodObject<{
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
}>]>;
export type IViewOptions = z.infer<typeof viewOptionsSchema>;
export declare const validateOptionsType: (type: ViewType, optionsString: IViewOptions) => string | void;
