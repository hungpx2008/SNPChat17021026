import { z } from 'zod';
import { FieldType } from '../constant';
export * from './text';
export * from './single-select';
export * from './multiple-select';
export * from './attachment';
export * from './rating';
export * from './date';
export declare const fieldAIConfigSchema: z.ZodUnion<[z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Summary>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Translation>;
    sourceFieldId: z.ZodString;
    targetLanguage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Improvement>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]>, z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Classification>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>]>, z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Tag>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>]>, z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./attachment").ImageQuality>>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.ImageGeneration>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}, {
    type: import("./text").FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./attachment").ImageQuality>>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}>]>, z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Rating>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]>, z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]>]>;
export type IFieldAIConfig = z.infer<typeof fieldAIConfigSchema>;
export declare const getAiConfigSchema: (type: FieldType) => z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Summary>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Translation>;
    sourceFieldId: z.ZodString;
    targetLanguage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Improvement>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]> | z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Classification>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>]> | z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Tag>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>]> | z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./attachment").ImageQuality>>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.ImageGeneration>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}, {
    type: import("./text").FieldAIActionType.ImageGeneration;
    modelKey: string;
    sourceFieldId: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    n: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    quality: z.ZodOptional<z.ZodNativeEnum<typeof import("./attachment").ImageQuality>>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    n?: number | undefined;
    size?: string | undefined;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    quality?: import("./attachment").ImageQuality | undefined;
}>]> | z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Rating>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Rating;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]> | z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: import("./text").FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<import("./text").FieldAIActionType.Customization>;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prompt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}, {
    type: import("./text").FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
}>]> | z.ZodUndefined;
