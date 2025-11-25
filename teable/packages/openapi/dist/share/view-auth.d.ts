import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_AUTH = "/share/{shareId}/view/auth";
export declare const shareViewAuthVoSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type ShareViewAuthVo = z.infer<typeof shareViewAuthVoSchema>;
export declare const ShareViewAuthRouter: RouteConfig;
export declare const shareViewAuth: (params: {
    shareId: string;
    password: string;
}) => Promise<import("axios").AxiosResponse<{
    token: string;
}, any>>;
