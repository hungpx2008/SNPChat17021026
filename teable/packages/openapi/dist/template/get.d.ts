import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_TEMPLATE_LIST = "/template";
export declare const templateCoverVoSchema: z.ZodObject<Pick<{
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
} & {
    presignedUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    token: string;
    name: string;
    path: string;
    id: string;
    size: number;
    mimetype: string;
    presignedUrl: string;
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
    presignedUrl: string;
    width?: number | undefined;
    height?: number | undefined;
}>;
export type ITemplateCoverVo = z.infer<typeof templateCoverVoSchema>;
export declare const templateVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    isSystem: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    snapshot: z.ZodObject<{
        baseId: z.ZodString;
        snapshotTime: z.ZodString;
        spaceId: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        spaceId: string;
        baseId: string;
        snapshotTime: string;
    }, {
        name: string;
        spaceId: string;
        baseId: string;
        snapshotTime: string;
    }>;
    description: z.ZodOptional<z.ZodString>;
    baseId: z.ZodOptional<z.ZodString>;
    cover: z.ZodObject<Pick<{
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
    } & {
        presignedUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
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
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    }>;
    usageCount: z.ZodNumber;
    markdownDescription: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    cover: {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
    snapshot: {
        name: string;
        spaceId: string;
        baseId: string;
        snapshotTime: string;
    };
    usageCount: number;
    name?: string | undefined;
    description?: string | undefined;
    isSystem?: boolean | undefined;
    baseId?: string | undefined;
    categoryId?: string | undefined;
    isPublished?: boolean | undefined;
    markdownDescription?: string | undefined;
}, {
    id: string;
    cover: {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
    snapshot: {
        name: string;
        spaceId: string;
        baseId: string;
        snapshotTime: string;
    };
    usageCount: number;
    name?: string | undefined;
    description?: string | undefined;
    isSystem?: boolean | undefined;
    baseId?: string | undefined;
    categoryId?: string | undefined;
    isPublished?: boolean | undefined;
    markdownDescription?: string | undefined;
}>;
export type ITemplateVo = z.infer<typeof templateVoSchema>;
export declare const GetTemplateRoute: RouteConfig;
export declare const getTemplateList: () => Promise<import("axios").AxiosResponse<{
    id: string;
    cover: {
        url: string;
        token: string;
        name: string;
        path: string;
        id: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
    snapshot: {
        name: string;
        spaceId: string;
        baseId: string;
        snapshotTime: string;
    };
    usageCount: number;
    name?: string | undefined;
    description?: string | undefined;
    isSystem?: boolean | undefined;
    baseId?: string | undefined;
    categoryId?: string | undefined;
    isPublished?: boolean | undefined;
    markdownDescription?: string | undefined;
}[], any>>;
