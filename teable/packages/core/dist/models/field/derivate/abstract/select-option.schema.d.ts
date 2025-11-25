import { z } from '../../../../zod';
export declare const selectFieldChoiceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    color: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    color: string;
}, {
    id: string;
    name: string;
    color: string;
}>;
export declare const selectFieldChoiceRoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    id?: string | undefined;
    color?: string | undefined;
}>;
export type ISelectFieldChoice = z.infer<typeof selectFieldChoiceSchema>;
export declare const selectFieldOptionsSchema: z.ZodObject<{
    choices: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        color: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        color: string;
    }, {
        id: string;
        name: string;
        color: string;
    }>, "many">;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    choices: {
        id: string;
        name: string;
        color: string;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}, {
    choices: {
        id: string;
        name: string;
        color: string;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}>;
export declare const selectFieldOptionsRoSchema: z.ZodObject<{
    choices: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id?: string | undefined;
        color?: string | undefined;
    }, {
        name: string;
        id?: string | undefined;
        color?: string | undefined;
    }>, "many">;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    preventAutoNewOptions: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    choices: {
        name: string;
        id?: string | undefined;
        color?: string | undefined;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}, {
    choices: {
        name: string;
        id?: string | undefined;
        color?: string | undefined;
    }[];
    defaultValue?: string | string[] | undefined;
    preventAutoNewOptions?: boolean | undefined;
}>;
export type ISelectFieldOptions = z.infer<typeof selectFieldOptionsSchema>;
export type ISelectFieldOptionsRo = z.infer<typeof selectFieldOptionsRoSchema>;
