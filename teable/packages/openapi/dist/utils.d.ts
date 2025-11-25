import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const urlBuilder: (url: string, pathParams?: Record<string, unknown>) => string;
export declare const registerRoute: (route: RouteConfig) => RouteConfig;
export declare const getRoutes: () => RouteConfig[];
