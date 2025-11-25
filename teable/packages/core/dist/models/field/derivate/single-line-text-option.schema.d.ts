import { z } from '../../../zod';
export declare const singlelineTextFieldOptionsSchema: z.ZodObject<{
    showAs: z.ZodOptional<z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("../show-as").SingleLineTextDisplayType>;
    }, "strip", z.ZodTypeAny, {
        type: import("../show-as").SingleLineTextDisplayType;
    }, {
        type: import("../show-as").SingleLineTextDisplayType;
    }>>;
    defaultValue: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    showAs?: {
        type: import("../show-as").SingleLineTextDisplayType;
    } | undefined;
    defaultValue?: string | undefined;
}, {
    showAs?: {
        type: import("../show-as").SingleLineTextDisplayType;
    } | undefined;
    defaultValue?: string | undefined;
}>;
export type ISingleLineTextFieldOptions = z.infer<typeof singlelineTextFieldOptionsSchema>;
