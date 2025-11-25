import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const GET_AI_DISABLE_ACTIONS = "/{baseId}/ai/disable-ai-actions";
export declare const getAIDisableActionsVoSchema: z.ZodObject<{
    disableActions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    disableActions: string[];
}, {
    disableActions: string[];
}>;
export type IGetAIDisableActionsVo = z.infer<typeof getAIDisableActionsVoSchema>;
export declare const GetAIDisableActionsRoute: RouteConfig;
export declare const getAIDisableActions: (baseId: string) => Promise<import("axios").AxiosResponse<{
    disableActions: string[];
}, any>>;
