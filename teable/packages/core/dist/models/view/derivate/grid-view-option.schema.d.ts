import { z } from '../../../zod';
import { RowHeightLevel } from '../constant';
export declare const gridViewOptionSchema: z.ZodObject<{
    rowHeight: z.ZodOptional<z.ZodNativeEnum<typeof RowHeightLevel>>;
    fieldNameDisplayLines: z.ZodOptional<z.ZodNumber>;
    frozenColumnCount: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    rowHeight?: RowHeightLevel | undefined;
    fieldNameDisplayLines?: number | undefined;
    frozenColumnCount?: number | undefined;
}, {
    rowHeight?: RowHeightLevel | undefined;
    fieldNameDisplayLines?: number | undefined;
    frozenColumnCount?: number | undefined;
}>;
export type IGridViewOptions = z.infer<typeof gridViewOptionSchema>;
