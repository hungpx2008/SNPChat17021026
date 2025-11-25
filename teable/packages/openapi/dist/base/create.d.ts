import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_BASE = "/base";
export declare const createBaseRoSchema: z.ZodObject<{
    spaceId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
    name?: string | undefined;
    icon?: string | undefined;
}, {
    spaceId: string;
    name?: string | undefined;
    icon?: string | undefined;
}>;
export type ICreateBaseRo = z.infer<typeof createBaseRoSchema>;
export declare const createBaseVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    spaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
}, {
    name: string;
    id: string;
    spaceId: string;
}>;
export type ICreateBaseVo = z.infer<typeof createBaseVoSchema>;
export declare const CreateBaseRoute: RouteConfig;
export declare const createBase: (createBaseRo: ICreateBaseRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    spaceId: string;
}, any>>;
