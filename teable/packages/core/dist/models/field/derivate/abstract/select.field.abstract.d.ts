import { z } from 'zod';
import { Colors } from '../../colors';
import { FieldCore } from '../../field';
export declare const selectFieldChoiceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    color: z.ZodNativeEnum<typeof Colors>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    color: Colors;
}, {
    id: string;
    name: string;
    color: Colors;
}>;
export declare const selectFieldChoiceRoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    color: z.ZodOptional<z.ZodNativeEnum<typeof Colors>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id?: string | undefined;
    color?: Colors | undefined;
}, {
    name: string;
    id?: string | undefined;
    color?: Colors | undefined;
}>;
export type ISelectFieldChoice = z.infer<typeof selectFieldChoiceSchema>;
export declare const selectFieldOptionsSchema: z.ZodObject<{
    choices: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
        color: z.ZodNativeEnum<typeof Colors>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        color: Colors;
    }, {
        id: string;
        name: string;
        color: Colors;
    }>, "many">;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    choices: {
        id: string;
        name: string;
        color: Colors;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}, {
    choices: {
        id: string;
        name: string;
        color: Colors;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}>;
export declare const selectFieldOptionsRoSchema: z.ZodObject<{
    choices: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
        color: z.ZodOptional<z.ZodNativeEnum<typeof Colors>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id?: string | undefined;
        color?: Colors | undefined;
    }, {
        name: string;
        id?: string | undefined;
        color?: Colors | undefined;
    }>, "many">;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    choices: {
        name: string;
        id?: string | undefined;
        color?: Colors | undefined;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}, {
    choices: {
        name: string;
        id?: string | undefined;
        color?: Colors | undefined;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}>;
export type ISelectFieldOptions = z.infer<typeof selectFieldOptionsSchema>;
export type ISelectFieldOptionsRo = z.infer<typeof selectFieldOptionsRoSchema>;
export declare abstract class SelectFieldCore extends FieldCore {
    private _innerChoicesMap;
    meta?: undefined;
    static defaultOptions(): ISelectFieldOptions;
    options: ISelectFieldOptions;
    get innerChoicesMap(): Record<string, {
        id: string;
        name: string;
        color: Colors;
    }>;
    validateOptions(): z.SafeParseReturnType<{
        choices: {
            id: string;
            name: string;
            color: Colors;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }, {
        choices: {
            id: string;
            name: string;
            color: Colors;
        }[];
        defaultValue?: string | string[] | undefined;
        preventAutoNewOptions?: boolean | undefined;
    }>;
    cellValue2String(cellValue?: unknown): string;
    item2String(value?: unknown): string;
    validateCellValue(cellValue: unknown): z.SafeParseReturnType<[string, ...string[]] | null, [string, ...string[]] | null> | z.SafeParseReturnType<string | null, string | null>;
}
