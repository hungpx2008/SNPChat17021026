import { z } from '../../../zod';
export declare const galleryViewOptionSchema: z.ZodObject<{
    coverFieldId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isCoverFit: z.ZodOptional<z.ZodBoolean>;
    isFieldNameHidden: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    coverFieldId?: string | null | undefined;
    isCoverFit?: boolean | undefined;
    isFieldNameHidden?: boolean | undefined;
}, {
    coverFieldId?: string | null | undefined;
    isCoverFit?: boolean | undefined;
    isFieldNameHidden?: boolean | undefined;
}>;
export type IGalleryViewOptions = z.infer<typeof galleryViewOptionSchema>;
