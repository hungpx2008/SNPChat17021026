import { z } from '../../../zod';
import { CellValueType } from '../constant';
export * from './number';
export * from './text';
export declare const getShowAsSchema: (cellValueType: CellValueType, isMultipleCellValue: boolean | undefined) => z.ZodOptional<z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./text").SingleLineTextDisplayType>;
}, "strip", z.ZodTypeAny, {
    type: import("./text").SingleLineTextDisplayType;
}, {
    type: import("./text").SingleLineTextDisplayType;
}>> | z.ZodUndefined | z.ZodOptional<z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./number").SingleNumberDisplayType>;
    color: z.ZodNativeEnum<typeof import("..").Colors>;
    showValue: z.ZodBoolean;
    maxValue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: import("./number").SingleNumberDisplayType;
    color: import("..").Colors;
    showValue: boolean;
    maxValue: number;
}, {
    type: import("./number").SingleNumberDisplayType;
    color: import("..").Colors;
    showValue: boolean;
    maxValue: number;
}>> | z.ZodOptional<z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./number").MultiNumberDisplayType>;
    color: z.ZodNativeEnum<typeof import("..").Colors>;
}, "strip", z.ZodTypeAny, {
    type: import("./number").MultiNumberDisplayType;
    color: import("..").Colors;
}, {
    type: import("./number").MultiNumberDisplayType;
    color: import("..").Colors;
}>>;
export declare const unionShowAsSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./text").SingleLineTextDisplayType>;
}, "strict", z.ZodTypeAny, {
    type: import("./text").SingleLineTextDisplayType;
}, {
    type: import("./text").SingleLineTextDisplayType;
}>, z.ZodUnion<[z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./number").SingleNumberDisplayType>;
    color: z.ZodNativeEnum<typeof import("..").Colors>;
    showValue: z.ZodBoolean;
    maxValue: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    type: import("./number").SingleNumberDisplayType;
    color: import("..").Colors;
    showValue: boolean;
    maxValue: number;
}, {
    type: import("./number").SingleNumberDisplayType;
    color: import("..").Colors;
    showValue: boolean;
    maxValue: number;
}>, z.ZodObject<{
    type: z.ZodNativeEnum<typeof import("./number").MultiNumberDisplayType>;
    color: z.ZodNativeEnum<typeof import("..").Colors>;
}, "strict", z.ZodTypeAny, {
    type: import("./number").MultiNumberDisplayType;
    color: import("..").Colors;
}, {
    type: import("./number").MultiNumberDisplayType;
    color: import("..").Colors;
}>]>]>;
export type IUnionShowAs = z.infer<typeof unionShowAsSchema>;
