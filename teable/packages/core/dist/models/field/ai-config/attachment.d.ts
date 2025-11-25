import { z } from 'zod';
import { FieldAIActionType } from './text';
export declare enum ImageQuality {
    Low = "low",
    Medium = "medium",
    High = "high"
}
export declare const attachmentFieldAIConfigBaseSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof ImageQuality>>;
}, "strip", z.ZodTypeAny, {
    modelKey: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}, {
    modelKey: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}>;
export declare const attachmentFieldGenerateImageAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof ImageQuality>>;
} & {
    type: z.ZodLiteral<FieldAIActionType.ImageGeneration>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}, {
    type: FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}>;
export type IAttachmentFieldGenerateImageAIConfig = z.infer<typeof attachmentFieldGenerateImageAIConfigSchema>;
export declare const attachmentFieldCustomizeAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof ImageQuality>>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: ImageQuality | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: ImageQuality | undefined;
}>;
export type IAttachmentFieldCustomizeAIConfig = z.infer<typeof attachmentFieldCustomizeAIConfigSchema>;
export declare const attachmentFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof ImageQuality>>;
} & {
    type: z.ZodLiteral<FieldAIActionType.ImageGeneration>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}, {
    type: FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: ImageQuality | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof ImageQuality>>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: ImageQuality | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: ImageQuality | undefined;
}>]>;
export type IAttachmentFieldAIConfig = z.infer<typeof attachmentFieldAIConfigSchema>;
