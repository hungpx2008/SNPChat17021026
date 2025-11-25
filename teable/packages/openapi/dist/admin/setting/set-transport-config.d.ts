import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const SET_SETTING_MAIL_TRANSPORT_CONFIG = "/admin/setting/set-mail-transport-config";
export declare const setSettingMailTransportConfigRoSchema: z.ZodObject<{
    name: z.ZodUnion<[z.ZodLiteral<"notifyMailTransportConfig">, z.ZodLiteral<"automationMailTransportConfig">]>;
    transportConfig: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    name: "notifyMailTransportConfig" | "automationMailTransportConfig";
    transportConfig: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    };
}, {
    name: "notifyMailTransportConfig" | "automationMailTransportConfig";
    transportConfig: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    };
}>;
export type ISetSettingMailTransportConfigRo = z.infer<typeof setSettingMailTransportConfigRoSchema>;
export declare const setSettingMailTransportConfigVoSchema: z.ZodObject<{
    name: z.ZodUnion<[z.ZodLiteral<"notifyMailTransportConfig">, z.ZodLiteral<"automationMailTransportConfig">]>;
    transportConfig: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    name: "notifyMailTransportConfig" | "automationMailTransportConfig";
    transportConfig: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    };
}, {
    name: "notifyMailTransportConfig" | "automationMailTransportConfig";
    transportConfig: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    };
}>;
export type ISetSettingMailTransportConfigVo = z.infer<typeof setSettingMailTransportConfigVoSchema>;
export declare const SetSettingMailTransportConfigRoute: RouteConfig;
export declare const setSettingMailTransportConfig: (ro: ISetSettingMailTransportConfigRo) => Promise<import("axios").AxiosResponse<{
    name: "notifyMailTransportConfig" | "automationMailTransportConfig";
    transportConfig: {
        auth: {
            user: string;
            pass: string;
        };
        host: string;
        sender: string;
        port: number;
        senderName?: string | undefined;
        secure?: boolean | undefined;
    };
}, any>>;
