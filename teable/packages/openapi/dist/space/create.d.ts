import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_SPACE = "/space";
export declare const createSpaceRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type ICreateSpaceRo = z.infer<typeof createSpaceRoSchema>;
export declare const createSpaceVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type ICreateSpaceVo = z.infer<typeof createSpaceVoSchema>;
export declare const CreateSpaceRoute: RouteConfig;
export declare const createSpace: (createSpaceRo: ICreateSpaceRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
