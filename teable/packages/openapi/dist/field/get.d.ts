import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IFieldVo } from '@teable/core';
import type { AxiosResponse } from 'axios';
export declare const GET_FIELD = "/table/{tableId}/field/{fieldId}";
export declare const GetFieldRoute: RouteConfig;
export declare function getField(tableId: string, fieldId: string): Promise<AxiosResponse<IFieldVo>>;
