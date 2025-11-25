import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../../zod';
export declare enum RecurringIntervalType {
    Month = "month",
    Year = "year"
}
export declare enum BillingProductLevel {
    Free = "free",
    Plus = "plus",
    Pro = "pro",
    Enterprise = "enterprise"
}
export declare enum SubscriptionStatus {
    Active = "active",
    Canceled = "canceled",
    Incomplete = "incomplete",
    IncompleteExpired = "incomplete_expired",
    Trialing = "trialing",
    PastDue = "past_due",
    Unpaid = "unpaid",
    Paused = "paused",
    SeatLimitExceeded = "seat_limit_exceeded"
}
export declare const subscriptionSummaryVoSchema: z.ZodObject<{
    spaceId: z.ZodString;
    status: z.ZodNativeEnum<typeof SubscriptionStatus>;
    level: z.ZodNativeEnum<typeof BillingProductLevel>;
}, "strip", z.ZodTypeAny, {
    status: SubscriptionStatus;
    spaceId: string;
    level: BillingProductLevel;
}, {
    status: SubscriptionStatus;
    spaceId: string;
    level: BillingProductLevel;
}>;
export type ISubscriptionSummaryVo = z.infer<typeof subscriptionSummaryVoSchema>;
export declare const GET_SUBSCRIPTION_SUMMARY = "/space/{spaceId}/billing/subscription/summary";
export declare const GetSubscriptionSummaryRoute: RouteConfig;
export declare function getSubscriptionSummary(spaceId: string): Promise<AxiosResponse<ISubscriptionSummaryVo>>;
