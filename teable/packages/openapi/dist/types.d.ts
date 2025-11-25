import { z } from './zod';
export declare const getListSchemaVo: <T>(item: z.ZodType<T>) => z.ZodObject<{
    total: z.ZodNumber;
    list: z.ZodArray<z.ZodType<T, z.ZodTypeDef, T>, "many">;
}, "strip", z.ZodTypeAny, {
    total: number;
    list: T[];
}, {
    total: number;
    list: T[];
}>;
