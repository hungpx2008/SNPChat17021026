import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const REFRESH_SHARE_ID = "/table/{tableId}/view/{viewId}/refresh-share-id";
export declare const refreshShareViewVoSchema: z.ZodObject<{
    shareId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shareId: string;
}, {
    shareId: string;
}>;
export declare const refreshViewShareIdRoute: RouteConfig;
export declare const refreshViewShareId: (tableId: string, viewId: string) => Promise<import("axios").AxiosResponse<void, any>>;
