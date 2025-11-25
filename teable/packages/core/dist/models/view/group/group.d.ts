import { z } from '../../../zod';
export declare const groupItemSchema: z.ZodObject<{
    fieldId: z.ZodString;
    order: z.ZodNativeEnum<typeof import("../sort").SortFunc>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    order: import("../sort").SortFunc;
}, {
    fieldId: string;
    order: import("../sort").SortFunc;
}>;
export declare const groupSchema: z.ZodNullable<z.ZodArray<z.ZodObject<{
    fieldId: z.ZodString;
    order: z.ZodNativeEnum<typeof import("../sort").SortFunc>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    order: import("../sort").SortFunc;
}, {
    fieldId: string;
    order: import("../sort").SortFunc;
}>, "many">>;
export declare const viewGroupRoSchema: z.ZodObject<{
    group: z.ZodNullable<z.ZodNullable<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof import("../sort").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: import("../sort").SortFunc;
    }, {
        fieldId: string;
        order: import("../sort").SortFunc;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    group: {
        fieldId: string;
        order: import("../sort").SortFunc;
    }[] | null;
}, {
    group: {
        fieldId: string;
        order: import("../sort").SortFunc;
    }[] | null;
}>;
export type IViewGroupRo = z.infer<typeof viewGroupRoSchema>;
export type IGroupItem = z.infer<typeof groupItemSchema>;
export type IGroup = z.infer<typeof groupSchema>;
export declare const groupStringSchema: z.ZodEffects<z.ZodString, {
    fieldId: string;
    order: import("../sort").SortFunc;
}[] | null, string>;
export declare function parseGroup(queryGroup?: IGroup): IGroup | undefined;
