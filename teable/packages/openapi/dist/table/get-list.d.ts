import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { tableListVoSchema } from './create';
export type ITableListVo = z.infer<typeof tableListVoSchema>;
export declare const GET_TABLE_LIST = "/base/{baseId}/table";
export declare const GetTableListRoute: RouteConfig;
export declare const getTableList: (baseId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    dbTableName: string;
    description?: string | undefined;
    order?: number | undefined;
    icon?: string | undefined;
    lastModifiedTime?: string | undefined;
    defaultViewId?: string | undefined;
}[], any>>;
