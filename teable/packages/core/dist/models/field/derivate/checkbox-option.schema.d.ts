import { z } from '../../../zod';
export declare const checkboxFieldOptionsSchema: z.ZodObject<{
    defaultValue: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    defaultValue?: boolean | undefined;
}, {
    defaultValue?: boolean | undefined;
}>;
export type ICheckboxFieldOptions = z.infer<typeof checkboxFieldOptionsSchema>;
