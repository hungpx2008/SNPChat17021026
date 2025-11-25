import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_SORT = "/table/{tableId}/view/{viewId}/sort";
export declare const viewSortRoSchema: z.ZodObject<{
    sort: z.ZodNullable<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    sort: {
        sortObjs: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null;
}, {
    sort: {
        sortObjs: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[];
        manualSort?: boolean | undefined;
    } | null;
}>;
export type IViewSortRo = z.infer<typeof viewSortRoSchema>;
export declare const updateViewSortRoute: RouteConfig;
export declare const updateViewSort: (tableId: string, viewId: string, sortViewRo: IViewSortRo) => Promise<import("axios").AxiosResponse<void, any>>;
