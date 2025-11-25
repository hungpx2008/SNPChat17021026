import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Axios } from 'axios';
export declare const GET_SUBSCRIPTION_SUMMARY_LIST = "/billing/subscription/summary";
export declare const GetSubscriptionSummaryListRoute: RouteConfig;
export declare const getSubscriptionSummaryList: (axios?: Axios) => Promise<import("axios").AxiosResponse<{
    status: import("./get-subscription-summary").SubscriptionStatus;
    spaceId: string;
    level: import("./get-subscription-summary").BillingProductLevel;
}[], any>>;
