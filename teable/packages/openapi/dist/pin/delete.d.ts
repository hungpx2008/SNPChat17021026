import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PinType } from './types';
export declare const DELETE_PIN = "/pin";
export declare const deletePinRoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof PinType>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: PinType;
    id: string;
}, {
    type: PinType;
    id: string;
}>;
export type DeletePinRo = z.infer<typeof deletePinRoSchema>;
export declare const DeletePinRoute: RouteConfig;
export declare const deletePin: (data: DeletePinRo) => Promise<import("axios").AxiosResponse<any, any>>;
