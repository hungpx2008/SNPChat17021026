import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const settingVoSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    instanceId: string;
    createdTime?: string | undefined;
    aiConfig?: {
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
    } | null | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    appConfig?: {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    } | null | undefined;
    webSearchConfig?: {
        apiKey?: string | undefined;
    } | null | undefined;
    notifyMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
    automationMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
}, {
    instanceId: string;
    createdTime?: string | undefined;
    aiConfig?: {
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
    } | null | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    appConfig?: {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    } | null | undefined;
    webSearchConfig?: {
        apiKey?: string | undefined;
    } | null | undefined;
    notifyMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
    automationMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
}>;
export type ISettingVo = z.infer<typeof settingVoSchema>;
export declare const GET_SETTING = "/admin/setting";
export declare const GetSettingRoute: RouteConfig;
export declare const getSetting: () => Promise<import("axios").AxiosResponse<{
    instanceId: string;
    createdTime?: string | undefined;
    aiConfig?: {
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
    } | null | undefined;
    brandName?: string | null | undefined;
    brandLogo?: string | null | undefined;
    disallowSignUp?: boolean | null | undefined;
    disallowSpaceCreation?: boolean | null | undefined;
    disallowSpaceInvitation?: boolean | null | undefined;
    enableEmailVerification?: boolean | null | undefined;
    enableWaitlist?: boolean | null | undefined;
    appConfig?: {
        apiKey?: string | undefined;
        creditCount?: number | undefined;
    } | null | undefined;
    webSearchConfig?: {
        apiKey?: string | undefined;
    } | null | undefined;
    notifyMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
    automationMailTransportConfig?: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    } | null | undefined;
}, any>>;
