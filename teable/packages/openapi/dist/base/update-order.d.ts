import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IUpdateOrderRo } from '../view/update-order';
export declare const BASE_ORDER = "/base/{baseId}/order";
export declare const updateBaseOrderRoute: RouteConfig;
export declare const updateBaseOrder: (params: {
    baseId: string;
} & IUpdateOrderRo) => Promise<import("axios").AxiosResponse<void, any>>;
