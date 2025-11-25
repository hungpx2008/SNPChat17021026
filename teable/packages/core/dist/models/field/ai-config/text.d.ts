import { z } from 'zod';
export declare enum FieldAIActionType {
    Summary = "summary",
    Translation = "translation",
    Improvement = "improvement",
    Extraction = "extraction",
    Classification = "classification",
    Tag = "tag",
    Customization = "customization",
    ImageGeneration = "imageGeneration",
    Rating = "rating"
}
export declare const commonFieldAIConfig: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    modelKey: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    modelKey: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ICommonFieldAIConfig = z.infer<typeof commonFieldAIConfig>;
export declare const textFieldExtractInfoAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ITextFieldExtractInfoAIConfig = z.infer<typeof textFieldExtractInfoAIConfigSchema>;
export declare const textFieldSummarizeAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Summary>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ITextFieldSummarizeAIConfig = z.infer<typeof textFieldSummarizeAIConfigSchema>;
export declare const textFieldTranslateAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Translation>;
    sourceFieldId: z.ZodString;
    targetLanguage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ITextFieldTranslateAIConfig = z.infer<typeof textFieldTranslateAIConfigSchema>;
export declare const textFieldImproveTextAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Improvement>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ITextFieldImproveTextAIConfig = z.infer<typeof textFieldImproveTextAIConfigSchema>;
export declare const textFieldCustomizeAIConfigSchema: z.ZodObject<{
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
export type ITextFieldCustomizeAIConfig = z.infer<typeof textFieldCustomizeAIConfigSchema>;
export declare const textFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Extraction;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Summary>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Summary;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>, z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Translation>;
    sourceFieldId: z.ZodString;
    targetLanguage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Translation;
    modelKey: string;
    sourceFieldId: string;
    targetLanguage: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Translation;
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
    type: z.ZodLiteral<FieldAIActionType.Improvement>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Improvement;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Improvement;
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
}>]>;
export type ITextFieldAIConfig = z.infer<typeof textFieldAIConfigSchema>;
