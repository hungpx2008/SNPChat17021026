import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IUpdateOrderRo } from '../view/update-order';
export declare const TABLE_ORDER = "/base/{baseId}/table/{tableId}/order";
export declare const updateTableOrderRoute: RouteConfig;
export declare const updateTableOrder: (baseId: string, tableId: string, orderRo: IUpdateOrderRo) => Promise<import("axios").AxiosResponse<void, any>>;
