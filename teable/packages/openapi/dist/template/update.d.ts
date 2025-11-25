import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_TEMPLATE = "/template/{templateId}";
export declare const templateCoverRoSchema: z.ZodObject<Pick<{
    token: z.ZodString;
    size: z.ZodNumber;
    url: z.ZodString;
    path: z.ZodString;
    mimetype: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    presignedUrl: z.ZodString;
}, "url" | "token" | "path" | "width" | "height" | "size" | "mimetype"> & {
    name: z.ZodString;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    token: string;
    name: string;
    path: string;
    id: string;
    size: number;
    mimetype: string;
    width?: number | undefined;
    height?: number | undefined;
}, {
    url: string;
    token: string;
    name: string;
    path: string;
    id: string;
    size: number;
    mimetype: string;
    width?: number | undefined;
    height?: number | undefined;
}>;
export type ITemplateCoverRo = z.infer<typeof templateCoverRoSchema>;
export declare const updateTemplateRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    cover: z.ZodNullable<z.ZodOptional<z.ZodObject<Pick<{
        token: z.ZodString;
        size: z.ZodNumber;
        url: z.ZodString;
        path: z.ZodString;
        mimetype: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        presignedUrl: z.ZodString;
    }, "url" | "token" | "path" | "width" | "height" | "size" | "mimetype"> & {
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        width?: number | undefined;
        height?: number | undefined;
    }>>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    isSystem: z.ZodOptional<z.ZodBoolean>;
    baseId: z.ZodOptional<z.ZodString>;
    markdownDescription: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isSystem?: boolean | undefined;
    baseId?: string | undefined;
    categoryId?: string | undefined;
    cover?: {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        width?: number | undefined;
        height?: number | undefined;
    } | null | undefined;
    isPublished?: boolean | undefined;
    markdownDescription?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isSystem?: boolean | undefined;
    baseId?: string | undefined;
    categoryId?: string | undefined;
    cover?: {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        width?: number | undefined;
        height?: number | undefined;
    } | null | undefined;
    isPublished?: boolean | undefined;
    markdownDescription?: string | undefined;
}>;
export type IUpdateTemplateRo = z.infer<typeof updateTemplateRoSchema>;
export declare const UpdateTemplateRoute: RouteConfig;
export declare const updateTemplate: (templateId: string, updateTemplateRoSchema: IUpdateTemplateRo) => Promise<import("axios").AxiosResponse<void, any>>;
