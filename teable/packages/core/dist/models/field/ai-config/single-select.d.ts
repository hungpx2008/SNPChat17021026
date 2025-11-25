import { z } from 'zod';
import { FieldAIActionType } from './text';
export declare const singleSelectFieldClassifyAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Classification>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type ISingleSelectFieldClassifyAIConfig = z.infer<typeof singleSelectFieldClassifyAIConfigSchema>;
export declare const singleSelectFieldCustomizeAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Customization>;
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>;
export type ISingleSelectFieldCustomizeAIConfig = z.infer<typeof singleSelectFieldCustomizeAIConfigSchema>;
export declare const singleSelectFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Classification>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Classification;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Classification;
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
    prompt: z.ZodString;
    attachmentFieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    onlyAllowConfiguredOptions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}, {
    type: FieldAIActionType.Customization;
    modelKey: string;
    prompt: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
    attachmentFieldIds?: string[] | undefined;
    onlyAllowConfiguredOptions?: boolean | undefined;
}>]>;
export type ISingleSelectFieldAIConfig = z.infer<typeof singleSelectFieldAIConfigSchema>;
