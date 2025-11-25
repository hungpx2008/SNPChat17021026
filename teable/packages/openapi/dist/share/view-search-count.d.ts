import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { ISearchCountRo } from '../aggregation';
export declare const GET_SHARE_VIEW_SEARCH_COUNT = "/share/{shareId}/view/search-count";
export declare const GetShareViewSearchCountRoute: RouteConfig;
export declare const getShareViewSearchCount: (shareId: string, query?: ISearchCountRo) => Promise<import("axios").AxiosResponse<{
    count: number;
}, any>>;
