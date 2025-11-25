import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_COMMENT_SUBSCRIBE = "/comment/{tableId}/{recordId}/subscribe";
export declare const DeleteCommentSubscribeRoute: RouteConfig;
export declare const deleteCommentSubscribe: (tableId: string, recordId: string) => Promise<import("axios").AxiosResponse<void, any>>;
