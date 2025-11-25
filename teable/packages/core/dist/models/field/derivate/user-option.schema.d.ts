import { z } from '../../../zod';
export declare const userFieldOptionsSchema: z.ZodObject<{
    isMultiple: z.ZodOptional<z.ZodBoolean>;
    shouldNotify: z.ZodOptional<z.ZodBoolean>;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodEnum<["me"]>]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodEnum<["me"]>]>, "many">]>>;
}, "strip", z.ZodTypeAny, {
    isMultiple?: boolean | undefined;
    defaultValue?: string | string[] | undefined;
    shouldNotify?: boolean | undefined;
}, {
    isMultiple?: boolean | undefined;
    defaultValue?: string | string[] | undefined;
    shouldNotify?: boolean | undefined;
}>;
export type IUserFieldOptions = z.infer<typeof userFieldOptionsSchema>;
