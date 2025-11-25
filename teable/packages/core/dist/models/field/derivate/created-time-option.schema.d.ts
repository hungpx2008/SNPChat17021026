import { z } from '../../../zod';
export declare const createdTimeFieldOptionsSchema: z.ZodObject<{
    expression: z.ZodLiteral<"CREATED_TIME()">;
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
    expression: "CREATED_TIME()";
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}, {
    expression: "CREATED_TIME()";
    formatting: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    };
}>;
export type ICreatedTimeFieldOptions = z.infer<typeof createdTimeFieldOptionsSchema>;
export declare const createdTimeFieldOptionsRoSchema: z.ZodObject<Omit<{
    expression: z.ZodLiteral<"CREATED_TIME()">;
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
export type ICreatedTimeFieldOptionsRo = z.infer<typeof createdTimeFieldOptionsRoSchema>;
