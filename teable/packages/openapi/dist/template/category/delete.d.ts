import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_TEMPLATE_CATEGORY = "/template/category/{templateCategoryId}";
export declare const DeleteTemplateCategoryRoute: RouteConfig;
export declare const deleteTemplateCategory: (templateCategoryId: string) => Promise<import("axios").AxiosResponse<void, any>>;
