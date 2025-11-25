import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const GET_AI_CONFIG = "/{baseId}/ai/config";
export declare enum ModelOutputType {
    Image = "image",
    Audio = "audio",
    Video = "video"
}
export declare const textModelDefinationSchema: z.ZodObject<{
    inputRate: z.ZodNumber;
    outputRate: z.ZodNumber;
    visionEnable: z.ZodOptional<z.ZodBoolean>;
    audioEnable: z.ZodOptional<z.ZodBoolean>;
    videoEnable: z.ZodOptional<z.ZodBoolean>;
    deepThinkEnable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}>;
export type ITextModelDefination = z.infer<typeof textModelDefinationSchema>;
export declare const imageModelDefinationSchema: z.ZodObject<{
    usagePerUnit: z.ZodNumber;
    outputType: z.ZodNativeEnum<typeof ModelOutputType>;
}, "strip", z.ZodTypeAny, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}>;
export type IImageModelDefination = z.infer<typeof imageModelDefinationSchema>;
export declare const modelDefinationSchema: z.ZodUnion<[z.ZodObject<{
    inputRate: z.ZodNumber;
    outputRate: z.ZodNumber;
    visionEnable: z.ZodOptional<z.ZodBoolean>;
    audioEnable: z.ZodOptional<z.ZodBoolean>;
    videoEnable: z.ZodOptional<z.ZodBoolean>;
    deepThinkEnable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}>, z.ZodObject<{
    usagePerUnit: z.ZodNumber;
    outputType: z.ZodNativeEnum<typeof ModelOutputType>;
}, "strip", z.ZodTypeAny, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}>]>;
export declare const modelDefinationMapSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    inputRate: z.ZodNumber;
    outputRate: z.ZodNumber;
    visionEnable: z.ZodOptional<z.ZodBoolean>;
    audioEnable: z.ZodOptional<z.ZodBoolean>;
    videoEnable: z.ZodOptional<z.ZodBoolean>;
    deepThinkEnable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}, {
    inputRate: number;
    outputRate: number;
    visionEnable?: boolean | undefined;
    audioEnable?: boolean | undefined;
    videoEnable?: boolean | undefined;
    deepThinkEnable?: boolean | undefined;
}>, z.ZodObject<{
    usagePerUnit: z.ZodNumber;
    outputType: z.ZodNativeEnum<typeof ModelOutputType>;
}, "strip", z.ZodTypeAny, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}, {
    usagePerUnit: number;
    outputType: ModelOutputType;
}>]>>;
export type IModelDefinationMap = z.infer<typeof modelDefinationMapSchema>;
export declare const getAIConfigSchema: z.ZodObject<{
    llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("../admin").LLMProviderType>;
        name: z.ZodString;
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        models: z.ZodDefault<z.ZodString>;
        isInstance: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: import("../admin").LLMProviderType;
        models: string;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        isInstance?: boolean | undefined;
    }, {
        name: string;
        type: import("../admin").LLMProviderType;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        models?: string | undefined;
        isInstance?: boolean | undefined;
    }>, "many">>;
    embeddingModel: z.ZodOptional<z.ZodString>;
    translationModel: z.ZodOptional<z.ZodString>;
    chatModel: z.ZodOptional<z.ZodObject<{
        lg: z.ZodOptional<z.ZodString>;
        md: z.ZodOptional<z.ZodString>;
        sm: z.ZodOptional<z.ZodString>;
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
        lg?: string | undefined;
        md?: string | undefined;
        sm?: string | undefined;
        ability?: {
            image?: boolean | undefined;
            pdf?: boolean | undefined;
            webSearch?: boolean | undefined;
        } | undefined;
    }, {
        lg?: string | undefined;
        md?: string | undefined;
        sm?: string | undefined;
        ability?: {
            image?: boolean | undefined;
            pdf?: boolean | undefined;
            webSearch?: boolean | undefined;
        } | undefined;
    }>>;
    capabilities: z.ZodOptional<z.ZodObject<{
        disableActions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        disableActions?: string[] | undefined;
    }, {
        disableActions?: string[] | undefined;
    }>>;
} & {
    modelDefinationMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        inputRate: z.ZodNumber;
        outputRate: z.ZodNumber;
        visionEnable: z.ZodOptional<z.ZodBoolean>;
        audioEnable: z.ZodOptional<z.ZodBoolean>;
        videoEnable: z.ZodOptional<z.ZodBoolean>;
        deepThinkEnable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        inputRate: number;
        outputRate: number;
        visionEnable?: boolean | undefined;
        audioEnable?: boolean | undefined;
        videoEnable?: boolean | undefined;
        deepThinkEnable?: boolean | undefined;
    }, {
        inputRate: number;
        outputRate: number;
        visionEnable?: boolean | undefined;
        audioEnable?: boolean | undefined;
        videoEnable?: boolean | undefined;
        deepThinkEnable?: boolean | undefined;
    }>, z.ZodObject<{
        usagePerUnit: z.ZodNumber;
        outputType: z.ZodNativeEnum<typeof ModelOutputType>;
    }, "strip", z.ZodTypeAny, {
        usagePerUnit: number;
        outputType: ModelOutputType;
    }, {
        usagePerUnit: number;
        outputType: ModelOutputType;
    }>]>>>;
}, "strip", z.ZodTypeAny, {
    llmProviders: {
        name: string;
        type: import("../admin").LLMProviderType;
        models: string;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        isInstance?: boolean | undefined;
    }[];
    embeddingModel?: string | undefined;
    translationModel?: string | undefined;
    chatModel?: {
        lg?: string | undefined;
        md?: string | undefined;
        sm?: string | undefined;
        ability?: {
            image?: boolean | undefined;
            pdf?: boolean | undefined;
            webSearch?: boolean | undefined;
        } | undefined;
    } | undefined;
    capabilities?: {
        disableActions?: string[] | undefined;
    } | undefined;
    modelDefinationMap?: Record<string, {
        inputRate: number;
        outputRate: number;
        visionEnable?: boolean | undefined;
        audioEnable?: boolean | undefined;
        videoEnable?: boolean | undefined;
        deepThinkEnable?: boolean | undefined;
    } | {
        usagePerUnit: number;
        outputType: ModelOutputType;
    }> | undefined;
}, {
    llmProviders?: {
        name: string;
        type: import("../admin").LLMProviderType;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        models?: string | undefined;
        isInstance?: boolean | undefined;
    }[] | undefined;
    embeddingModel?: string | undefined;
    translationModel?: string | undefined;
    chatModel?: {
        lg?: string | undefined;
        md?: string | undefined;
        sm?: string | undefined;
        ability?: {
            image?: boolean | undefined;
            pdf?: boolean | undefined;
            webSearch?: boolean | undefined;
        } | undefined;
    } | undefined;
    capabilities?: {
        disableActions?: string[] | undefined;
    } | undefined;
    modelDefinationMap?: Record<string, {
        inputRate: number;
        outputRate: number;
        visionEnable?: boolean | undefined;
        audioEnable?: boolean | undefined;
        videoEnable?: boolean | undefined;
        deepThinkEnable?: boolean | undefined;
    } | {
        usagePerUnit: number;
        outputType: ModelOutputType;
    }> | undefined;
}>;
export type IGetAIConfig = z.infer<typeof getAIConfigSchema>;
export declare const GetAIConfigRoute: RouteConfig;
export declare const getAIConfig: (baseId: string) => Promise<import("axios").AxiosResponse<{
    llmProviders: {
        name: string;
        type: import("../admin").LLMProviderType;
        models: string;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        isInstance?: boolean | undefined;
    }[];
    embeddingModel?: string | undefined;
    translationModel?: string | undefined;
    chatModel?: {
        lg?: string | undefined;
        md?: string | undefined;
        sm?: string | undefined;
        ability?: {
            image?: boolean | undefined;
            pdf?: boolean | undefined;
            webSearch?: boolean | undefined;
        } | undefined;
    } | undefined;
    capabilities?: {
        disableActions?: string[] | undefined;
    } | undefined;
    modelDefinationMap?: Record<string, {
        inputRate: number;
        outputRate: number;
        visionEnable?: boolean | undefined;
        audioEnable?: boolean | undefined;
        videoEnable?: boolean | undefined;
        deepThinkEnable?: boolean | undefined;
    } | {
        usagePerUnit: number;
        outputType: ModelOutputType;
    }> | undefined;
}, any>>;
