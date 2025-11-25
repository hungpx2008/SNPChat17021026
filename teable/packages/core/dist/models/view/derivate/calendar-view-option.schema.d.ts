import { z } from '../../../zod';
import { Colors } from '../../field/colors';
export declare enum ColorConfigType {
    Field = "field",
    Custom = "custom"
}
export declare const colorConfigSchema: z.ZodNullable<z.ZodOptional<z.ZodObject<{
    type: z.ZodNativeEnum<typeof ColorConfigType>;
    fieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    color: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof Colors>>>;
}, "strip", z.ZodTypeAny, {
    type: ColorConfigType;
    color?: Colors | null | undefined;
    fieldId?: string | null | undefined;
}, {
    type: ColorConfigType;
    color?: Colors | null | undefined;
    fieldId?: string | null | undefined;
}>>>;
export type IColorConfig = z.infer<typeof colorConfigSchema>;
export declare const calendarViewOptionSchema: z.ZodObject<{
    startDateFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDateFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    titleFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    colorConfig: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        type: z.ZodNativeEnum<typeof ColorConfigType>;
        fieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        color: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof Colors>>>;
    }, "strip", z.ZodTypeAny, {
        type: ColorConfigType;
        color?: Colors | null | undefined;
        fieldId?: string | null | undefined;
    }, {
        type: ColorConfigType;
        color?: Colors | null | undefined;
        fieldId?: string | null | undefined;
    }>>>;
}, "strict", z.ZodTypeAny, {
    startDateFieldId?: string | null | undefined;
    endDateFieldId?: string | null | undefined;
    titleFieldId?: string | null | undefined;
    colorConfig?: {
        type: ColorConfigType;
        color?: Colors | null | undefined;
        fieldId?: string | null | undefined;
    } | null | undefined;
}, {
    startDateFieldId?: string | null | undefined;
    endDateFieldId?: string | null | undefined;
    titleFieldId?: string | null | undefined;
    colorConfig?: {
        type: ColorConfigType;
        color?: Colors | null | undefined;
        fieldId?: string | null | undefined;
    } | null | undefined;
}>;
export type ICalendarViewOptions = z.infer<typeof calendarViewOptionSchema>;
