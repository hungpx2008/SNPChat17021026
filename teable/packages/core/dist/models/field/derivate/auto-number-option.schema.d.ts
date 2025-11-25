import { z } from '../../../zod';
export declare const autoNumberFieldOptionsSchema: z.ZodObject<{
    expression: z.ZodLiteral<"AUTO_NUMBER()">;
}, "strip", z.ZodTypeAny, {
    expression: "AUTO_NUMBER()";
}, {
    expression: "AUTO_NUMBER()";
}>;
export type IAutoNumberFieldOptions = z.infer<typeof autoNumberFieldOptionsSchema>;
export declare const autoNumberFieldOptionsRoSchema: z.ZodObject<Omit<{
    expression: z.ZodLiteral<"AUTO_NUMBER()">;
}, "expression">, "strip", z.ZodTypeAny, {}, {}>;
export type IAutoNumberFieldOptionsRo = z.infer<typeof autoNumberFieldOptionsRoSchema>;
