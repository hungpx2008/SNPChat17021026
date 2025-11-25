import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ViewType } from '@teable/core';
import { z } from '../zod';
import { PinType } from './types';
export declare const GET_PIN_LIST = "/pin/list";
export declare const IGetPinListVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<typeof PinType>;
    order: z.ZodNumber;
    name: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    parentBaseId: z.ZodOptional<z.ZodString>;
    viewMeta: z.ZodOptional<z.ZodObject<{
        tableId: z.ZodString;
        type: z.ZodNativeEnum<typeof ViewType>;
        pluginLogo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: ViewType;
        tableId: string;
        pluginLogo?: string | undefined;
    }, {
        type: ViewType;
        tableId: string;
        pluginLogo?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: PinType;
    id: string;
    order: number;
    icon?: string | undefined;
    parentBaseId?: string | undefined;
    viewMeta?: {
        type: ViewType;
        tableId: string;
        pluginLogo?: string | undefined;
    } | undefined;
}, {
    name: string;
    type: PinType;
    id: string;
    order: number;
    icon?: string | undefined;
    parentBaseId?: string | undefined;
    viewMeta?: {
        type: ViewType;
        tableId: string;
        pluginLogo?: string | undefined;
    } | undefined;
}>, "many">;
export type IGetPinListVo = z.infer<typeof IGetPinListVoSchema>;
export declare const GetPinRoute: RouteConfig;
export declare const getPinList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    type: PinType;
    id: string;
    order: number;
    icon?: string | undefined;
    parentBaseId?: string | undefined;
    viewMeta?: {
        type: ViewType;
        tableId: string;
        pluginLogo?: string | undefined;
    } | undefined;
}[], any>>;
