import { z } from '../../../zod';
export declare const pluginViewOptionSchema: z.ZodObject<{
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    pluginLogo: z.ZodString;
}, "strict", z.ZodTypeAny, {
    pluginId: string;
    pluginInstallId: string;
    pluginLogo: string;
}, {
    pluginId: string;
    pluginInstallId: string;
    pluginLogo: string;
}>;
export type IPluginViewOptions = z.infer<typeof pluginViewOptionSchema>;
