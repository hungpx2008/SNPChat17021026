import type { AxiosResponse } from 'axios';
import { z } from 'zod';
export declare const queryParamsRoSchema: z.ZodObject<{
    params: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    params: Record<string, unknown>;
}, {
    params: Record<string, unknown>;
}>;
export type IQueryParamsRo = z.infer<typeof queryParamsRoSchema>;
export declare const queryParamsVoSchema: z.ZodObject<{
    queryId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    queryId: string;
}, {
    queryId: string;
}>;
export type IQueryParamsVo = z.infer<typeof queryParamsVoSchema>;
export declare const SAVE_QUERY_PARAMS_URL = "/query-params";
export declare function saveQueryParams(queryParamsRo: IQueryParamsRo): Promise<AxiosResponse<IQueryParamsVo>>;
