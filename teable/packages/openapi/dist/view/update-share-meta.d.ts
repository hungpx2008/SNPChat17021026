import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_SHARE_META = "/table/{tableId}/view/{viewId}/share-meta";
export declare const viewShareMetaRoSchema: z.ZodObject<{
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
export type IViewShareMetaRo = z.infer<typeof viewShareMetaRoSchema>;
export declare const updateViewShareMetaRoute: RouteConfig;
export declare const updateViewShareMeta: (tableId: string, viewId: string, shareMeta: IViewShareMetaRo) => Promise<import("axios").AxiosResponse<void, any>>;
