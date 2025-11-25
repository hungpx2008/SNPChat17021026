import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_TEMP_TOKEN = "/auth/temp-token";
export declare const getTempTokenVoSchema: z.ZodObject<{
    accessToken: z.ZodString;
    expiresTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    expiresTime: string;
}, {
    accessToken: string;
    expiresTime: string;
}>;
export type IGetTempTokenVo = z.infer<typeof getTempTokenVoSchema>;
export declare const getTempTokenRoute: RouteConfig;
export declare const getTempToken: () => Promise<import("axios").AxiosResponse<{
    accessToken: string;
    expiresTime: string;
}, any>>;
