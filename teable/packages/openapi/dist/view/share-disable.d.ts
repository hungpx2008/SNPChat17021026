import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DISABLE_SHARE_VIEW = "/table/{tableId}/view/{viewId}/disable-share";
export declare const DisableShareViewRoute: RouteConfig;
export declare const disableShareView: (params: {
    tableId: string;
    viewId: string;
}) => Promise<import("axios").AxiosResponse<void, any>>;
