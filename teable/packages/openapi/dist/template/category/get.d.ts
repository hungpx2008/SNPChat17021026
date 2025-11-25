import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const GET_TEMPLATE_CATEGORY_LIST = "/template/category/list";
export declare const templateCategoryListVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    order: number;
}, {
    name: string;
    id: string;
    order: number;
}>;
export type ITemplateCategoryListVo = z.infer<typeof templateCategoryListVoSchema>;
export declare const GetTemplateCategoryListRoute: RouteConfig;
export declare const getTemplateCategoryList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    order: number;
}[], any>>;
