import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_TEMPLATE = "/template/{templateId}";
export declare const DeleteTemplateRoute: RouteConfig;
export declare const deleteTemplate: (templateId: string) => Promise<import("axios").AxiosResponse<void, any>>;
