import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const testMailTransportConfigRoSchema: z.ZodObject<{
    to: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
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
    to: string;
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
    message?: string | undefined;
}, {
    to: string;
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
    message?: string | undefined;
}>;
export type ITestMailTransportConfigRo = z.infer<typeof testMailTransportConfigRoSchema>;
export declare const TEST_MAIL_TRANSPORT_CONFIG = "/mail-sender/test-transport-config";
export declare const TestMailTransportConfigRoute: RouteConfig;
export declare const testMailTransportConfig: (ro: ITestMailTransportConfigRo) => Promise<import("axios").AxiosResponse<void, any>>;
