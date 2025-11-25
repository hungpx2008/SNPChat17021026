import { z } from 'zod';
export declare const localizationSchema: z.ZodObject<{
    i18nKey: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    i18nKey: string;
    context?: Record<string, unknown> | undefined;
}, {
    i18nKey: string;
    context?: Record<string, unknown> | undefined;
}>;
export type ILocalization = z.infer<typeof localizationSchema>;
