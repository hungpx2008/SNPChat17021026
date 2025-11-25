import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IUpdateFieldRo } from '@teable/core';
export declare const UPDATE_FIELD = "/table/{tableId}/field/{fieldId}";
export declare const UpdateFieldRoute: RouteConfig;
export declare const updateField: (tableId: string, fieldId: string, fieldRo: IUpdateFieldRo) => Promise<import("axios").AxiosResponse<any, any>>;
