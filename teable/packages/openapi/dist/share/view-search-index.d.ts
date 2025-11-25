import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { ISearchIndexByQueryRo } from '../aggregation';
export declare const GET_SHARE_VIEW_SEARCH_INDEX = "/share/{shareId}/view/search-index";
export declare const GetShareViewSearchIndexRoute: RouteConfig;
export declare const getShareViewSearchIndex: (shareId: string, query?: ISearchIndexByQueryRo) => Promise<import("axios").AxiosResponse<{
    index: number;
    recordId: string;
    fieldId: string;
}[] | null, any>>;
