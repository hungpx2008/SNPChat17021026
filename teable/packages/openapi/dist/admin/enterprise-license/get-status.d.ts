import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const enterpriseLicenseStatusVoSchema: z.ZodObject<{
    expiredTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    expiredTime?: string | null | undefined;
}, {
    expiredTime?: string | null | undefined;
}>;
export type IEnterpriseLicenseStatusVo = z.infer<typeof enterpriseLicenseStatusVoSchema>;
export declare const GET_ENTERPRISE_LICENSE_STATUS = "/admin/enterprise-license/status";
export declare const GetEnterpriseLicenseStatusRoute: RouteConfig;
export declare const getEnterpriseLicenseStatus: () => Promise<import("axios").AxiosResponse<{
    expiredTime?: string | null | undefined;
}, any>>;
