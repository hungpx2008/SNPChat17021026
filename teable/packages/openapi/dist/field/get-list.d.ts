import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IFieldVo, IGetFieldsQuery } from '@teable/core';
import type { AxiosResponse } from 'axios';
export declare const GET_FIELD_LIST = "/table/{tableId}/field";
export declare const GetFieldListRoute: RouteConfig;
export declare function getFields(tableId: string, query?: IGetFieldsQuery): Promise<AxiosResponse<IFieldVo[]>>;
