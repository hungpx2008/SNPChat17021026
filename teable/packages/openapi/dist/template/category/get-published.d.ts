import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_PUBLISHED_TEMPLATE_CATEGORY_LIST = "/template/category/list/published";
export declare const GetPublishedTemplateCategoryListRoute: RouteConfig;
export declare const getPublishedTemplateCategoryList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    order: number;
}[], any>>;
