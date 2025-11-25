import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const EXPORT_UNSUBSCRIBE_LIST = "/unsubscribe/export-list/{baseId}";
export declare const exportUnsubscribeListRoute: RouteConfig;
export declare const exportUnsubscribeList: (baseId: string) => Promise<import("axios").AxiosResponse<any, any>>;
