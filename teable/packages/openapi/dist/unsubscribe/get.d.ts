import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { MailType } from '../mail/types';
import { z } from '../zod';
export declare const GET_UNSUBSCRIBE = "/unsubscribe/{token}";
export declare const unsubscribeBaseSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof MailType>;
    baseId: z.ZodString;
    email: z.ZodString;
    subscriptionStatus: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: MailType;
    email: string;
    baseId: string;
    subscriptionStatus?: boolean | undefined;
}, {
    type: MailType;
    email: string;
    baseId: string;
    subscriptionStatus?: boolean | undefined;
}>;
export type IUnsubscribeBase = z.infer<typeof unsubscribeBaseSchema>;
export declare const unsubscribeAutomationSendEmailActionSchema: z.ZodObject<{
    baseId: z.ZodString;
    email: z.ZodString;
    subscriptionStatus: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<MailType.AutomationSendEmailAction>;
    actionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: MailType.AutomationSendEmailAction;
    email: string;
    baseId: string;
    actionId: string;
    subscriptionStatus?: boolean | undefined;
}, {
    type: MailType.AutomationSendEmailAction;
    email: string;
    baseId: string;
    actionId: string;
    subscriptionStatus?: boolean | undefined;
}>;
export type IUnsubscribeAutomationSendEmailAction = z.infer<typeof unsubscribeAutomationSendEmailActionSchema>;
export type IUnsubscribe = IUnsubscribeBase | IUnsubscribeAutomationSendEmailAction;
export declare const unsubscribeVoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof MailType>;
    baseId: z.ZodString;
    email: z.ZodString;
    subscriptionStatus: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: MailType;
    email: string;
    baseId: string;
    subscriptionStatus?: boolean | undefined;
}, {
    type: MailType;
    email: string;
    baseId: string;
    subscriptionStatus?: boolean | undefined;
}>;
export type IUnsubscribeVo = z.infer<typeof unsubscribeVoSchema>;
export declare const getUnSubscribeRoute: RouteConfig;
export declare const getUnSubscribe: (token: string) => Promise<import("axios").AxiosResponse<{
    type: MailType;
    email: string;
    baseId: string;
    subscriptionStatus?: boolean | undefined;
}, any>>;
