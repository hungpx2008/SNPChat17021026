import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_OPTION = "/table/{tableId}/view/{viewId}/options";
export declare const viewOptionsRoSchema: z.ZodObject<{
    options: z.ZodUnion<[z.ZodObject<{
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
    }>]>;
}, "strip", z.ZodTypeAny, {
    options: {
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
            type: import("@teable/core").ColorConfigType;
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
    };
}, {
    options: {
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
            type: import("@teable/core").ColorConfigType;
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
    };
}>;
export type IViewOptionsRo = z.infer<typeof viewOptionsRoSchema>;
export declare const UpdateViewOptionsRoute: RouteConfig;
export declare const updateViewOptions: (tableId: string, viewId: string, viewOptionsRo: IViewOptionsRo) => Promise<import("axios").AxiosResponse<void, any>>;
