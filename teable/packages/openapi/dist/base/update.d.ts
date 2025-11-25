import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_BASE = "/base/{baseId}";
export declare const updateBaseRoSchema: z.ZodObject<Omit<{
    spaceId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "spaceId">, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    icon?: string | undefined;
}, {
    name?: string | undefined;
    icon?: string | undefined;
}>;
export type IUpdateBaseRo = z.infer<typeof updateBaseRoSchema>;
export declare const updateBaseVoSchema: z.ZodObject<{
    spaceId: z.ZodString;
    name: z.ZodString;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    spaceId: string;
    icon?: string | null | undefined;
}, {
    name: string;
    spaceId: string;
    icon?: string | null | undefined;
}>;
export type IUpdateBaseVo = z.infer<typeof updateBaseVoSchema>;
export declare const UpdateBaseRoute: RouteConfig;
export declare const updateBase: (params: {
    baseId: string;
    updateBaseRo: IUpdateBaseRo;
}) => Promise<import("axios").AxiosResponse<{
    name: string;
    spaceId: string;
    icon?: string | null | undefined;
}, any>>;
