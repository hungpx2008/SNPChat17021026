import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_REGENERATE_SECRET = "/plugin/{id}/regenerate-secret";
export declare const pluginRegenerateSecretRoSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type IPluginRegenerateSecretRo = z.infer<typeof pluginRegenerateSecretRoSchema>;
export declare const pluginRegenerateSecretVoSchema: z.ZodObject<{
    id: z.ZodString;
    secret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    secret: string;
}, {
    id: string;
    secret: string;
}>;
export type IPluginRegenerateSecretVo = z.infer<typeof pluginRegenerateSecretVoSchema>;
export declare const pluginRegenerateSecretRoute: RouteConfig;
export declare const pluginRegenerateSecret: (id: string) => Promise<import("axios").AxiosResponse<{
    id: string;
    secret: string;
}, any>>;
