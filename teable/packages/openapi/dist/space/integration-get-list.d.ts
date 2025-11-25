import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare enum IntegrationType {
    AI = "AI"
}
export declare const GET_INTEGRATION_LIST = "/space/{spaceId}/integration";
export declare const aiIntegrationConfigSchema: z.ZodObject<{
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
        type: import("../admin").LLMProviderType;
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
}>;
export type IAIIntegrationConfig = z.infer<typeof aiIntegrationConfigSchema>;
export declare const integrationConfigSchema: z.ZodObject<{
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
        type: import("../admin").LLMProviderType;
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
}>;
export type IIntegrationConfig = z.infer<typeof integrationConfigSchema>;
export declare const integrationItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    spaceId: z.ZodString;
    type: z.ZodNativeEnum<typeof IntegrationType>;
    enable: z.ZodOptional<z.ZodBoolean>;
    config: z.ZodObject<{
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
            type: import("../admin").LLMProviderType;
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
    }>;
    createdTime: z.ZodString;
    lastModifiedTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: IntegrationType;
    id: string;
    spaceId: string;
    createdTime: string;
    config: {
        llmProviders: {
            name: string;
            type: import("../admin").LLMProviderType;
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
    lastModifiedTime?: string | undefined;
    enable?: boolean | undefined;
}, {
    type: IntegrationType;
    id: string;
    spaceId: string;
    createdTime: string;
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
    };
    lastModifiedTime?: string | undefined;
    enable?: boolean | undefined;
}>;
export declare const aiIntegrationSettingSchema: z.ZodObject<Pick<{
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
}, "chatModel"> & {
    enable: z.ZodOptional<z.ZodBoolean>;
    llmProviders: z.ZodArray<z.ZodObject<Omit<Pick<{
        type: z.ZodNativeEnum<typeof import("../admin").LLMProviderType>;
        name: z.ZodString;
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        models: z.ZodDefault<z.ZodString>;
        isInstance: z.ZodOptional<z.ZodBoolean>;
    }, "name" | "type" | "models" | "isInstance">, "isInstance">, "strip", z.ZodTypeAny, {
        name: string;
        type: import("../admin").LLMProviderType;
        models: string;
    }, {
        name: string;
        type: import("../admin").LLMProviderType;
        models?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    llmProviders: {
        name: string;
        type: import("../admin").LLMProviderType;
        models: string;
    }[];
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
    enable?: boolean | undefined;
}, {
    llmProviders: {
        name: string;
        type: import("../admin").LLMProviderType;
        models?: string | undefined;
    }[];
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
    enable?: boolean | undefined;
}>;
export type IAIIntegrationAISetting = z.infer<typeof aiIntegrationSettingSchema>;
export type IIntegrationItemVo = z.infer<typeof integrationItemVoSchema>;
export declare const GetIntegrationListRoute: RouteConfig;
export declare const getIntegrationList: (spaceId: string) => Promise<import("axios").AxiosResponse<{
    type: IntegrationType;
    id: string;
    spaceId: string;
    createdTime: string;
    config: {
        llmProviders: {
            name: string;
            type: import("../admin").LLMProviderType;
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
    lastModifiedTime?: string | undefined;
    enable?: boolean | undefined;
}[], any>>;
