import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_TEMPLATE_DETAIL = "/template/{templateId}";
export declare const GetTemplateDetailRoute: RouteConfig;
export declare const getTemplateDetail: (templateId: string) => Promise<import("axios").AxiosResponse<{
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
