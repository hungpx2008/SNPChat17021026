import { z } from '../../../zod';
export declare const dateFieldOptionsSchema: z.ZodObject<{
    formatting: z.ZodObject<{
        date: z.ZodString;
        time: z.ZodNativeEnum<typeof import("../formatting").TimeFormatting>;
        timeZone: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    }, {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    }>;
    defaultValue: z.ZodOptional<z.ZodEnum<["now"]>>;
}, "strip", z.ZodTypeAny, {
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
    defaultValue?: "now" | undefined;
}, {
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
    defaultValue?: "now" | undefined;
}>;
export type IDateFieldOptions = z.infer<typeof dateFieldOptionsSchema>;
