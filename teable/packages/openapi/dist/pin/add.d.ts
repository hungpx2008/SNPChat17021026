import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PinType } from './types';
export declare const ADD_PIN = "/pin/";
export declare const addPinRoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof PinType>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: PinType;
    id: string;
}, {
    type: PinType;
    id: string;
}>;
export type AddPinRo = z.infer<typeof addPinRoSchema>;
export declare const AddPinRoute: RouteConfig;
export declare const addPin: (data: AddPinRo) => Promise<import("axios").AxiosResponse<any, any>>;
