import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PIN_TOP_TEMPLATE = "/template/{templateId}/pin-top";
export declare const PinTopTemplateRoute: RouteConfig;
export declare const pinTopTemplate: (templateId: string) => Promise<import("axios").AxiosResponse<void, any>>;
