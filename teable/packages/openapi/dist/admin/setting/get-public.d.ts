import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const simpleLLMProviderSchema: z.ZodObject<Pick<{
    type: z.ZodNativeEnum<typeof import("./update").LLMProviderType>;
    name: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    models: z.ZodDefault<z.ZodString>;
    isInstance: z.ZodOptional<z.ZodBoolean>;
}, "name" | "type" | "models" | "isInstance">, "strip", z.ZodTypeAny, {
    name: string;
    type: import("./update").LLMProviderType;
    models: string;
    isInstance?: boolean | undefined;
}, {
    name: string;
    type: import("./update").LLMProviderType;
    models?: string | undefined;
    isInstance?: boolean | undefined;
}>;
export type ISimpleLLMProvider = z.infer<typeof simpleLLMProviderSchema>;
export declare const publicSettingVoSchema: z.ZodObject<Pick<{
    instanceId: z.ZodString;
    brandName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    brandLogo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    disallowSignUp: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    disallowSpaceCreation: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    disallowSpaceInvitation: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    enableEmailVerification: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    enableWaitlist: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    aiConfig: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        llmProviders: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodNativeEnum<typeof import("./update").LLMProviderType>;
            name: z.ZodString;
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            models: z.ZodDefault<z.ZodString>;
            isInstance: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: import("./update").LLMProviderType;
            models: string;
            apiKey?: string | undefined;
            baseUrl?: string | undefined;
            isInstance?: boolean | undefined;
        }, {
            name: string;
            type: import("./update").LLMProviderType;
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
            type: import("./update").LLMProviderType;
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
            type: import("./update").LLMProviderType;
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
    }>>>;
    notifyMailTransportConfig: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        senderName: z.ZodOptional<z.ZodString>;
        sender: z.ZodString;
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodOptional<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            user: string;
            pass: string;
        }, {
            user: string;
            pass: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    }, {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    }>>>;
    automationMailTransportConfig: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        senderName: z.ZodOptional<z.ZodString>;
        sender: z.ZodString;
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodOptional<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            user: string;
            pass: string;
        }, {
            user: string;
            pass: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    }, {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    }>>>;
    appConfig: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        creditCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    }, {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    }>>>;
    webSearchConfig: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
    }, {
        apiKey?: string | undefined;
    }>>>;
    createdTime: z.ZodOptional<z.ZodString>;
}, "createdTime" | "instanceId" | "brandName" | "brandLogo" | "disallowSignUp" | "disallowSpaceCreation" | "disallowSpaceInvitation" | "enableEmailVerification" | "enableWaitlist"> & {
    aiConfig: z.ZodNullable<z.ZodObject<{
        enable: z.ZodBoolean;
        llmProviders: z.ZodArray<z.ZodObject<Pick<{
            type: z.ZodNativeEnum<typeof import("./update").LLMProviderType>;
            name: z.ZodString;
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            models: z.ZodDefault<z.ZodString>;
            isInstance: z.ZodOptional<z.ZodBoolean>;
        }, "name" | "type" | "models" | "isInstance">, "strip", z.ZodTypeAny, {
            name: string;
            type: import("./update").LLMProviderType;
            models: string;
            isInstance?: boolean | undefined;
        }, {
            name: string;
            type: import("./update").LLMProviderType;
            models?: string | undefined;
            isInstance?: boolean | undefined;
        }>, "many">;
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
            type: import("./update").LLMProviderType;
            models: string;
            isInstance?: boolean | undefined;
        }[];
        enable: boolean;
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
        llmProviders: {
            name: string;
            type: import("./update").LLMProviderType;
            models?: string | undefined;
            isInstance?: boolean | undefined;
        }[];
        enable: boolean;
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
    }>>;
    webSearchEnabled: z.ZodOptional<z.ZodBoolean>;
    appGenerationEnabled: z.ZodOptional<z.ZodBoolean>;
    turnstileSiteKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    changeEmailSendCodeMailRate: z.ZodOptional<z.ZodNumber>;
    resetPasswordSendMailRate: z.ZodOptional<z.ZodNumber>;
    signupVerificationSendCodeMailRate: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    aiConfig: {
        llmProviders: {
            name: string;
            type: import("./update").LLMProviderType;
            models: string;
            isInstance?: boolean | undefined;
        }[];
        enable: boolean;
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
    } | null;
    instanceId: string;
    createdTime?: string | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    webSearchEnabled?: boolean | undefined;
    appGenerationEnabled?: boolean | undefined;
    turnstileSiteKey?: string | null | undefined;
    changeEmailSendCodeMailRate?: number | undefined;
    resetPasswordSendMailRate?: number | undefined;
    signupVerificationSendCodeMailRate?: number | undefined;
}, {
    aiConfig: {
        llmProviders: {
            name: string;
            type: import("./update").LLMProviderType;
            models?: string | undefined;
            isInstance?: boolean | undefined;
        }[];
        enable: boolean;
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
    } | null;
    instanceId: string;
    createdTime?: string | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    webSearchEnabled?: boolean | undefined;
    appGenerationEnabled?: boolean | undefined;
    turnstileSiteKey?: string | null | undefined;
    changeEmailSendCodeMailRate?: number | undefined;
    resetPasswordSendMailRate?: number | undefined;
    signupVerificationSendCodeMailRate?: number | undefined;
}>;
export type IPublicSettingVo = z.infer<typeof publicSettingVoSchema>;
export declare const GET_PUBLIC_SETTING = "/admin/setting/public";
export declare const GetPublicSettingRoute: RouteConfig;
export declare const getPublicSetting: () => Promise<import("axios").AxiosResponse<{
    aiConfig: {
        llmProviders: {
            name: string;
            type: import("./update").LLMProviderType;
            models: string;
            isInstance?: boolean | undefined;
        }[];
        enable: boolean;
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
    } | null;
    instanceId: string;
    createdTime?: string | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    webSearchEnabled?: boolean | undefined;
    appGenerationEnabled?: boolean | undefined;
    turnstileSiteKey?: string | null | undefined;
    changeEmailSendCodeMailRate?: number | undefined;
    resetPasswordSendMailRate?: number | undefined;
    signupVerificationSendCodeMailRate?: number | undefined;
}, any>>;
