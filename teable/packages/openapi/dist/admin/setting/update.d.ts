import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare enum LLMProviderType {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    GOOGLE = "google",
    AZURE = "azure",
    COHERE = "cohere",
    MISTRAL = "mistral",
    DEEPSEEK = "deepseek",
    QWEN = "qwen",
    ZHIPU = "zhipu",
    LINGYIWANWU = "lingyiwanwu",
    XAI = "xai",
    TOGETHERAI = "togetherai",
    OLLAMA = "ollama",
    AMAZONBEDROCK = "amazonBedrock",
    OPENROUTER = "openRouter"
}
export declare const llmProviderSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof LLMProviderType>;
    name: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    models: z.ZodDefault<z.ZodString>;
    isInstance: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: LLMProviderType;
    models: string;
    apiKey?: string | undefined;
    baseUrl?: string | undefined;
    isInstance?: boolean | undefined;
}, {
    name: string;
    type: LLMProviderType;
    apiKey?: string | undefined;
    baseUrl?: string | undefined;
    models?: string | undefined;
    isInstance?: boolean | undefined;
}>;
export type LLMProvider = z.infer<typeof llmProviderSchema>;
export declare const chatModelAbilitySchema: z.ZodObject<{
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
}>;
export declare const chatModelAbilityType: z.ZodEnum<["image", "pdf", "webSearch"]>;
export type IChatModelAbilityType = z.infer<typeof chatModelAbilityType>;
export type IChatModelAbility = z.infer<typeof chatModelAbilitySchema>;
export declare const chatModelSchema: z.ZodObject<{
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
}>;
export declare const aiConfigSchema: z.ZodObject<{
    llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof LLMProviderType>;
        name: z.ZodString;
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        models: z.ZodDefault<z.ZodString>;
        isInstance: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: LLMProviderType;
        models: string;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        isInstance?: boolean | undefined;
    }, {
        name: string;
        type: LLMProviderType;
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
}, "strip", z.ZodTypeAny, {
    llmProviders: {
        name: string;
        type: LLMProviderType;
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
}, {
    llmProviders?: {
        name: string;
        type: LLMProviderType;
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
export type IAIConfig = z.infer<typeof aiConfigSchema>;
export declare const aiConfigVoSchema: z.ZodObject<{
    llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof LLMProviderType>;
        name: z.ZodString;
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        models: z.ZodDefault<z.ZodString>;
        isInstance: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: LLMProviderType;
        models: string;
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
        isInstance?: boolean | undefined;
    }, {
        name: string;
        type: LLMProviderType;
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
    enable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    llmProviders: {
        name: string;
        type: LLMProviderType;
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
    enable?: boolean | undefined;
}, {
    llmProviders?: {
        name: string;
        type: LLMProviderType;
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
    enable?: boolean | undefined;
}>;
export declare const appConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    creditCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    creditCount?: number | undefined;
}, {
    apiKey?: string | undefined;
    creditCount?: number | undefined;
}>;
export type IAppConfig = z.infer<typeof appConfigSchema>;
export declare const webSearchConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
}, {
    apiKey?: string | undefined;
}>;
export type IWebSearchConfig = z.infer<typeof webSearchConfigSchema>;
export declare const updateSettingRoSchema: z.ZodObject<{
    disallowSignUp: z.ZodOptional<z.ZodBoolean>;
    disallowSpaceCreation: z.ZodOptional<z.ZodBoolean>;
    disallowSpaceInvitation: z.ZodOptional<z.ZodBoolean>;
    enableEmailVerification: z.ZodOptional<z.ZodBoolean>;
    aiConfig: z.ZodOptional<z.ZodObject<{
        llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof LLMProviderType>;
            name: z.ZodString;
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            models: z.ZodDefault<z.ZodString>;
            isInstance: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: LLMProviderType;
            models: string;
            apiKey?: string | undefined;
            baseUrl?: string | undefined;
            isInstance?: boolean | undefined;
        }, {
            name: string;
            type: LLMProviderType;
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
        enable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        llmProviders: {
            name: string;
            type: LLMProviderType;
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
        enable?: boolean | undefined;
    }, {
        llmProviders?: {
            name: string;
            type: LLMProviderType;
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
        enable?: boolean | undefined;
    }>>;
    enableWaitlist: z.ZodOptional<z.ZodBoolean>;
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
    brandName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    aiConfig?: {
        llmProviders: {
            name: string;
            type: LLMProviderType;
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
        enable?: boolean | undefined;
    } | undefined;
    brandName?: string | undefined;
    disallowSignUp?: boolean | undefined;
    disallowSpaceCreation?: boolean | undefined;
    disallowSpaceInvitation?: boolean | undefined;
    enableEmailVerification?: boolean | undefined;
    enableWaitlist?: boolean | undefined;
    appConfig?: {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    } | undefined;
    webSearchConfig?: {
        apiKey?: string | undefined;
    } | undefined;
}, {
    aiConfig?: {
        llmProviders?: {
            name: string;
            type: LLMProviderType;
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
        enable?: boolean | undefined;
    } | undefined;
    brandName?: string | undefined;
    disallowSignUp?: boolean | undefined;
    disallowSpaceCreation?: boolean | undefined;
    disallowSpaceInvitation?: boolean | undefined;
    enableEmailVerification?: boolean | undefined;
    enableWaitlist?: boolean | undefined;
    appConfig?: {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    } | undefined;
    webSearchConfig?: {
        apiKey?: string | undefined;
    } | undefined;
}>;
export type IUpdateSettingRo = z.infer<typeof updateSettingRoSchema>;
export declare const UPDATE_SETTING = "/admin/setting";
export declare const UpdateSettingRoute: RouteConfig;
export declare const updateSetting: (updateSettingRo: IUpdateSettingRo) => Promise<import("axios").AxiosResponse<any, any>>;
