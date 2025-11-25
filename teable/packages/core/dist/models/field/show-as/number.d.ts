import { z } from 'zod';
import { Colors } from '../colors';
export declare enum SingleNumberDisplayType {
    Bar = "bar",
    Ring = "ring"
}
export declare enum MultiNumberDisplayType {
    Bar = "bar",
    Line = "line"
}
export declare const singleNumberShowAsSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof SingleNumberDisplayType>;
    color: z.ZodNativeEnum<typeof Colors>;
    showValue: z.ZodBoolean;
    maxValue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: SingleNumberDisplayType;
    color: Colors;
    showValue: boolean;
    maxValue: number;
}, {
    type: SingleNumberDisplayType;
    color: Colors;
    showValue: boolean;
    maxValue: number;
}>;
export declare const multiNumberShowAsSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof MultiNumberDisplayType>;
    color: z.ZodNativeEnum<typeof Colors>;
}, "strip", z.ZodTypeAny, {
    type: MultiNumberDisplayType;
    color: Colors;
}, {
    type: MultiNumberDisplayType;
    color: Colors;
}>;
export type ISingleNumberShowAs = z.infer<typeof singleNumberShowAsSchema>;
export type IMultiNumberShowAs = z.infer<typeof multiNumberShowAsSchema>;
export declare const numberShowAsSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodNativeEnum<typeof SingleNumberDisplayType>;
    color: z.ZodNativeEnum<typeof Colors>;
    showValue: z.ZodBoolean;
    maxValue: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    type: SingleNumberDisplayType;
    color: Colors;
    showValue: boolean;
    maxValue: number;
}, {
    type: SingleNumberDisplayType;
    color: Colors;
    showValue: boolean;
    maxValue: number;
}>, z.ZodObject<{
    type: z.ZodNativeEnum<typeof MultiNumberDisplayType>;
    color: z.ZodNativeEnum<typeof Colors>;
}, "strict", z.ZodTypeAny, {
    type: MultiNumberDisplayType;
    color: Colors;
}, {
    type: MultiNumberDisplayType;
    color: Colors;
}>]>;
export type INumberShowAs = z.infer<typeof numberShowAsSchema>;
