import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { createSpaceRoSchema } from './create';
export declare const UPDATE_SPACE = "/space/{spaceId}";
export declare const updateSpaceRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type IUpdateSpaceRo = z.infer<typeof createSpaceRoSchema>;
export declare const updateSpaceVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type IUpdateSpaceVo = z.infer<typeof updateSpaceVoSchema>;
export declare const UpdateSpaceRoute: RouteConfig;
export declare const updateSpace: (params: {
    spaceId: string;
    updateSpaceRo: IUpdateSpaceRo;
}) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
