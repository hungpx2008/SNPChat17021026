import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const MOVE_BASE = "/base/{baseId}/move";
export declare const moveBaseRoSchema: z.ZodObject<{
    spaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
}, {
    spaceId: string;
}>;
export type IMoveBaseRo = z.infer<typeof moveBaseRoSchema>;
export declare const MoveBaseRoute: RouteConfig;
export declare const moveBase: (baseId: string, spaceId: string) => Promise<import("axios").AxiosResponse<void, any>>;
