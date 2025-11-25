import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const UPDATE_TEMPLATE_CATEGORY = "/template/category/{templateCategoryId}";
export declare const updateTemplateCategoryRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IUpdateTemplateCategoryRo = z.infer<typeof updateTemplateCategoryRoSchema>;
export declare const UpdateTemplateCategoryRoute: RouteConfig;
export declare const updateTemplateCategory: (templateCategoryId: string, updateTemplateCategoryRoSchema: IUpdateTemplateCategoryRo) => Promise<import("axios").AxiosResponse<void, any>>;
