import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_DB_CONNECTION = "/base/{baseId}/connection";
export declare const DeleteDbConnectionRoute: RouteConfig;
export declare const deleteDbConnection: (baseId: string) => Promise<import("axios").AxiosResponse<null, any>>;
