import { z } from '../zod';
export declare const dashboardLayoutSchema: z.ZodArray<z.ZodObject<{
    pluginInstallId: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    w: z.ZodNumber;
    h: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pluginInstallId: string;
    x: number;
    y: number;
    w: number;
    h: number;
}, {
    pluginInstallId: string;
    x: number;
    y: number;
    w: number;
    h: number;
}>, "many">;
export type IDashboardLayout = z.infer<typeof dashboardLayoutSchema>;
export declare const dashboardPluginItemSchema: z.ZodObject<{
    id: z.ZodString;
    pluginInstallId: z.ZodString;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    pluginInstallId: string;
    url?: string | undefined;
}, {
    name: string;
    id: string;
    pluginInstallId: string;
    url?: string | undefined;
}>;
export type IDashboardPluginItem = z.infer<typeof dashboardPluginItemSchema>;
export declare const pluginInstallStorageSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export type IPluginInstallStorage = z.infer<typeof pluginInstallStorageSchema>;
