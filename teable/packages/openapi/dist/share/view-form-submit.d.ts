import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_FORM_SUBMIT = "/share/{shareId}/view/form-submit";
export declare const shareViewFormSubmitRoSchema: z.ZodObject<{
    fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    typecast: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    fields: Record<string, unknown>;
    typecast?: boolean | undefined;
}, {
    fields: Record<string, unknown>;
    typecast?: boolean | undefined;
}>;
export type ShareViewFormSubmitRo = z.infer<typeof shareViewFormSubmitRoSchema>;
export declare const ShareViewFormSubmitRouter: RouteConfig;
export declare const shareViewFormSubmit: (params: {
    shareId: string;
    fields: Record<string, unknown>;
    typecast?: boolean;
}) => Promise<import("axios").AxiosResponse<{
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string | undefined;
    lastModifiedTime?: string | undefined;
    createdBy?: string | undefined;
    lastModifiedBy?: string | undefined;
    autoNumber?: number | undefined;
    name?: string | undefined;
    permissions?: Record<string, Record<string, boolean>> | undefined;
    undeletable?: boolean | undefined;
}, any>>;
