import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const NOTIFY_URL = "/attachments/notify/{token}";
export declare const notifyVoSchema: z.ZodObject<{
    token: z.ZodString;
    size: z.ZodNumber;
    url: z.ZodString;
    path: z.ZodString;
    mimetype: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    presignedUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    token: string;
    path: string;
    size: number;
    mimetype: string;
    presignedUrl: string;
    width?: number | undefined;
    height?: number | undefined;
}, {
    url: string;
    token: string;
    path: string;
    size: number;
    mimetype: string;
    presignedUrl: string;
    width?: number | undefined;
    height?: number | undefined;
}>;
export type INotifyVo = z.infer<typeof notifyVoSchema>;
export declare const NotifyRoute: RouteConfig;
export declare const notify: (token: string, shareId?: string, filename?: string) => Promise<import("axios").AxiosResponse<{
    url: string;
    token: string;
    path: string;
    size: number;
    mimetype: string;
    presignedUrl: string;
    width?: number | undefined;
    height?: number | undefined;
}, any>>;
