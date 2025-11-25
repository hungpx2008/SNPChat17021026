import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const UPLOAD_LOGO = "/admin/setting/logo";
export declare const uploadLogoRoSchema: z.ZodObject<{
    file: z.ZodString;
}, "strip", z.ZodTypeAny, {
    file: string;
}, {
    file: string;
}>;
export declare const uploadLogoVoSchema: z.ZodObject<{
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
}, {
    url: string;
}>;
export type IUploadLogoVo = z.infer<typeof uploadLogoVoSchema>;
export type IUploadLogoRo = z.infer<typeof uploadLogoRoSchema>;
export declare const UploadLogoRoute: RouteConfig;
export declare const uploadLogo: (uploadLogoRo: IUploadLogoRo) => Promise<import("axios").AxiosResponse<{
    url: string;
}, any>>;
