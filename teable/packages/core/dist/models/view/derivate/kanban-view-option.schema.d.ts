import { z } from '../../../zod';
export declare const kanbanViewOptionSchema: z.ZodObject<{
    stackFieldId: z.ZodOptional<z.ZodString>;
    coverFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isCoverFit: z.ZodOptional<z.ZodBoolean>;
    isFieldNameHidden: z.ZodOptional<z.ZodBoolean>;
    isEmptyStackHidden: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    coverFieldId?: string | null | undefined;
    isCoverFit?: boolean | undefined;
    isFieldNameHidden?: boolean | undefined;
    stackFieldId?: string | undefined;
    isEmptyStackHidden?: boolean | undefined;
}, {
    coverFieldId?: string | null | undefined;
    isCoverFit?: boolean | undefined;
    isFieldNameHidden?: boolean | undefined;
    stackFieldId?: string | undefined;
    isEmptyStackHidden?: boolean | undefined;
}>;
export type IKanbanViewOptions = z.infer<typeof kanbanViewOptionSchema>;
