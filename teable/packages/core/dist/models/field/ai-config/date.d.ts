import { z } from 'zod';
import { FieldAIActionType } from './text';
export declare const dateFieldExtractionAIConfigSchema: z.ZodObject<{
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
export type IDateFieldExtractionAIConfig = z.infer<typeof dateFieldExtractionAIConfigSchema>;
export declare const dateFieldCustomizeAIConfigSchema: z.ZodObject<{
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
export type IDateFieldCustomizeAIConfig = z.infer<typeof dateFieldCustomizeAIConfigSchema>;
export declare const dateFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Extraction>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
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
export type IDateFieldAIConfig = z.infer<typeof dateFieldAIConfigSchema>;
