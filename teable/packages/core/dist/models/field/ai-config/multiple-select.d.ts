import { z } from 'zod';
import { FieldAIActionType } from './text';
export declare const multipleSelectFieldTagAIConfigSchema: z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Tag>;
    sourceFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}>;
export type IMultipleSelectFieldTagAIConfig = z.infer<typeof multipleSelectFieldTagAIConfigSchema>;
export declare const multipleSelectFieldCustomizeAIConfigSchema: z.ZodObject<{
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
export type IMultipleSelectFieldCustomizeAIConfig = z.infer<typeof multipleSelectFieldCustomizeAIConfigSchema>;
export declare const multipleSelectFieldAIConfigSchema: z.ZodUnion<[z.ZodObject<{
    modelKey: z.ZodString;
    isAutoFill: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    attachPrompt: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<FieldAIActionType.Tag>;
    sourceFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: FieldAIActionType.Tag;
    modelKey: string;
    sourceFieldId: string;
    isAutoFill?: boolean | null | undefined;
    attachPrompt?: string | undefined;
}, {
    type: FieldAIActionType.Tag;
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
export type IMultipleSelectFieldAIConfig = z.infer<typeof multipleSelectFieldAIConfigSchema>;
