import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const ENABLE_SHARE_VIEW = "/table/{tableId}/view/{viewId}/enable-share";
export declare const enableShareViewVoSchema: z.ZodObject<{
    shareId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shareId: string;
}, {
    shareId: string;
}>;
export type IEnableShareViewVo = z.infer<typeof enableShareViewVoSchema>;
export declare const EnableShareViewRoute: RouteConfig;
export declare const enableShareView: (params: {
    tableId: string;
    viewId: string;
}) => Promise<import("axios").AxiosResponse<{
    shareId: string;
}, any>>;
