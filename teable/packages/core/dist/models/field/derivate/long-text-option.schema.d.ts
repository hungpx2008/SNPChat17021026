import { z } from '../../../zod';
export declare const longTextFieldOptionsSchema: z.ZodObject<{
    defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strict", z.ZodTypeAny, {
    defaultValue?: string | undefined;
}, {
    defaultValue?: string | undefined;
}>;
export type ILongTextFieldOptions = z.infer<typeof longTextFieldOptionsSchema>;
