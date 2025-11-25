import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const CREATE_TEMPLATE_CATEGORY = "/template/category/create";
export declare const createTemplateCategoryRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type ICreateTemplateCategoryRo = z.infer<typeof createTemplateCategoryRoSchema>;
export declare const CreateTemplateCategoryRoute: RouteConfig;
export declare const createTemplateCategory: (createTemplateCategoryRo: ICreateTemplateCategoryRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    order: number;
}, any>>;
