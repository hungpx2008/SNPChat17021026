import { z } from 'zod';
import { Colors } from '../colors';
export declare const buttonFieldOptionsSchema: z.ZodObject<{
    label: z.ZodString;
    color: z.ZodNativeEnum<typeof Colors>;
    maxCount: z.ZodOptional<z.ZodNumber>;
    resetCount: z.ZodOptional<z.ZodBoolean>;
    workflow: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    color: Colors;
    label: string;
    maxCount?: number | undefined;
    resetCount?: boolean | undefined;
    workflow?: {
        id?: string | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    } | null | undefined;
}, {
    color: Colors;
    label: string;
    maxCount?: number | undefined;
    resetCount?: boolean | undefined;
    workflow?: {
        id?: string | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    } | null | undefined;
}>;
export type IButtonFieldOptions = z.infer<typeof buttonFieldOptionsSchema>;
