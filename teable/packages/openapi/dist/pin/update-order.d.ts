import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PinType } from './types';
export declare const UPDATE_PIN_ORDER = "/pin/order";
export declare const updatePinOrderRoSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<typeof PinType>;
    anchorId: z.ZodString;
    anchorType: z.ZodNativeEnum<typeof PinType>;
    position: z.ZodEnum<["before", "after"]>;
}, "strip", z.ZodTypeAny, {
    type: PinType;
    id: string;
    anchorId: string;
    position: "before" | "after";
    anchorType: PinType;
}, {
    type: PinType;
    id: string;
    anchorId: string;
    position: "before" | "after";
    anchorType: PinType;
}>;
export type UpdatePinOrderRo = z.infer<typeof updatePinOrderRoSchema>;
export declare const UpdatePinOrderRoute: RouteConfig;
export declare const updatePinOrder: (data: UpdatePinOrderRo) => Promise<import("axios").AxiosResponse<any, any>>;
