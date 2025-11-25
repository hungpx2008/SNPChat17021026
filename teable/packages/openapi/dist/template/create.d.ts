import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_TEMPLATE = "/template/create";
export declare const createTemplateRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
}>;
export type ICreateTemplateRo = z.infer<typeof createTemplateRoSchema>;
export declare const CreateTemplateRoute: RouteConfig;
export declare const createTemplate: (createTemplateRo: ICreateTemplateRo) => Promise<import("axios").AxiosResponse<{
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
}, any>>;
