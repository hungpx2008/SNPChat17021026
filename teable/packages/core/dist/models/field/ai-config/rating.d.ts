import { z } from 'zod';
import { FieldAIActionType } from './text';
export declare const ratingFieldRatingAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Rating>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type IRatingFieldRatingAIConfig = z.infer<typeof ratingFieldRatingAIConfigSchema>;
export declare const ratingFieldCustomizeAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>;
export type IRatingFieldCustomizeAIConfig = z.infer<typeof ratingFieldCustomizeAIConfigSchema>;
export declare const ratingFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Rating>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]>;
export type IRatingFieldAIConfig = z.infer<typeof ratingFieldAIConfigSchema>;
