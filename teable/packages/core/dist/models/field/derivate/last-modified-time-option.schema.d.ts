import { z } from '../../../zod';
export declare const lastModifiedTimeFieldOptionsSchema: z.ZodObject<{
    expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
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
}, "strip", z.ZodTypeAny, {
    expression: "LAST_MODIFIED_TIME()";
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}, {
    expression: "LAST_MODIFIED_TIME()";
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}>;
export type ILastModifiedTimeFieldOptions = z.infer<typeof lastModifiedTimeFieldOptionsSchema>;
export declare const lastModifiedTimeFieldOptionsRoSchema: z.ZodObject<Omit<{
    expression: z.ZodLiteral<"LAST_MODIFIED_TIME()">;
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
}, "expression">, "strip", z.ZodTypeAny, {
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}, {
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}>;
export type ILastModifiedTimeFieldOptionsRo = z.infer<typeof lastModifiedTimeFieldOptionsRoSchema>;
