import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const CREATE_COMMENT_SUBSCRIBE = "/comment/{tableId}/{recordId}/subscribe";
export declare const CreateCommentSubscribeRoute: RouteConfig;
export declare const createCommentSubscribe: (tableId: string, recordId: string) => Promise<import("axios").AxiosResponse<void, any>>;
