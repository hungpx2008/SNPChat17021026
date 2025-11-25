import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_UNSUBSCRIBE = "/unsubscribe/{token}";
export declare const updateSubscriptionRoSchema: z.ZodObject<{
    subscriptionStatus: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    subscriptionStatus: boolean;
}, {
    subscriptionStatus: boolean;
}>;
export type IUpdateSubscriptionRo = z.infer<typeof updateSubscriptionRoSchema>;
export declare const updateSubscriptionRoute: RouteConfig;
export declare const updateSubscription: (token: string, ro: IUpdateSubscriptionRo) => Promise<import("axios").AxiosResponse<boolean, any>>;
