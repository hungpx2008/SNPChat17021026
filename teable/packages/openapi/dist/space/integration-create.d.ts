import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { IntegrationType } from './integration-get-list';
export declare const CREATE_INTEGRATION = "/space/{spaceId}/integration";
export declare const createIntegrationRoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof IntegrationType>;
    enable: z.ZodOptional<z.ZodBoolean>;
    config: z.ZodObject<{
        llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("..").LLMProviderType>;
            name: z.ZodString;
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            models: z.ZodDefault<z.ZodString>;
            isInstance: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: import("..").LLMProviderType;
            models: string;
            apiKey?: string | undefined;
            baseUrl?: string | undefined;
            isInstance?: boolean | undefined;
        }, {
            name: string;
            type: import("..").LLMProviderType;
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
        appConfig: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodString>;
            creditCount: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        }, {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        }>>;
        webSearchConfig: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            apiKey?: string | undefined;
        }, {
            apiKey?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        llmProviders: {
            name: string;
            type: import("..").LLMProviderType;
            models: string;
            apiKey?: string | undefined;
            baseUrl?: string | undefined;
            isInstance?: boolean | undefined;
        }[];
        appConfig?: {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        } | undefined;
        webSearchConfig?: {
            apiKey?: string | undefined;
        } | undefined;
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
    }, {
        appConfig?: {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        } | undefined;
        webSearchConfig?: {
            apiKey?: string | undefined;
        } | undefined;
        llmProviders?: {
            name: string;
            type: import("..").LLMProviderType;
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
    }>;
}, "strip", z.ZodTypeAny, {
    type: IntegrationType;
    config: {
        llmProviders: {
            name: string;
            type: import("..").LLMProviderType;
            models: string;
            apiKey?: string | undefined;
            baseUrl?: string | undefined;
            isInstance?: boolean | undefined;
        }[];
        appConfig?: {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        } | undefined;
        webSearchConfig?: {
            apiKey?: string | undefined;
        } | undefined;
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
    };
    enable?: boolean | undefined;
}, {
    type: IntegrationType;
    config: {
        appConfig?: {
            apiKey?: string | undefined;
            creditCount?: number | undefined;
        } | undefined;
        webSearchConfig?: {
            apiKey?: string | undefined;
        } | undefined;
        llmProviders?: {
            name: string;
            type: import("..").LLMProviderType;
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
    };
    enable?: boolean | undefined;
}>;
export type ICreateIntegrationRo = z.infer<typeof createIntegrationRoSchema>;
export declare const CreateIntegrationRoute: RouteConfig;
export declare const createIntegration: (spaceId: string, createIntegrationRo: ICreateIntegrationRo) => Promise<import("axios").AxiosResponse<any, any>>;
