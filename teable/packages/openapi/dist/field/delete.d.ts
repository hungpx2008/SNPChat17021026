import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_FIELD = "/table/{tableId}/field/{fieldId}";
export declare const DeleteFieldRoute: RouteConfig;
export declare const deleteField: (tableId: string, fieldId: string) => Promise<import("axios").AxiosResponse<null, any>>;
