import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const testLLMRoSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof import("./update").LLMProviderType>;
    apiKey: z.ZodString;
    baseUrl: z.ZodString;
    models: z.ZodDefault<z.ZodString>;
} & {
    modelKey: z.ZodOptional<z.ZodString>;
    ability: z.ZodOptional<z.ZodArray<z.ZodEnum<["image", "pdf", "webSearch"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: import("./update").LLMProviderType;
    apiKey: string;
    baseUrl: string;
    models: string;
    ability?: ("image" | "pdf" | "webSearch")[] | undefined;
    modelKey?: string | undefined;
}, {
    name: string;
    type: import("./update").LLMProviderType;
    apiKey: string;
    baseUrl: string;
    models?: string | undefined;
    ability?: ("image" | "pdf" | "webSearch")[] | undefined;
    modelKey?: string | undefined;
}>;
export type ITestLLMRo = z.infer<typeof testLLMRoSchema>;
export declare const testLLMVoSchema: z.ZodObject<{
    success: z.ZodBoolean;
    response: z.ZodOptional<z.ZodString>;
    ability: z.ZodOptional<z.ZodObject<{
        image: z.ZodOptional<z.ZodBoolean>;
        pdf: z.ZodOptional<z.ZodBoolean>;
        webSearch: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        image?: boolean | undefined;
        pdf?: boolean | undefined;
        webSearch?: boolean | undefined;
    }, {
        image?: boolean | undefined;
        pdf?: boolean | undefined;
        webSearch?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    ability?: {
        image?: boolean | undefined;
        pdf?: boolean | undefined;
        webSearch?: boolean | undefined;
    } | undefined;
    response?: string | undefined;
}, {
    success: boolean;
    ability?: {
        image?: boolean | undefined;
        pdf?: boolean | undefined;
        webSearch?: boolean | undefined;
    } | undefined;
    response?: string | undefined;
}>;
export type ITestLLMVo = z.infer<typeof testLLMVoSchema>;
export declare const TEST_LLM = "/admin/setting/test-llm";
export declare const TestLLMRoute: RouteConfig;
export declare const testLLM: (data: ITestLLMRo) => Promise<ITestLLMVo>;
