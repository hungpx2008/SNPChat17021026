import { z } from '../zod';
export declare const GET_DEFAULT_VIEW_ID = "/base/{baseId}/table/{tableId}/default-view-id";
export declare const getDefaultViewIdVoSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type IGetDefaultViewIdVo = z.infer<typeof getDefaultViewIdVoSchema>;
export declare const GetDefaultViewIdRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const getDefaultViewId: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<{
    id: string;
}, any>>;
