import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_COMMENT = "/comment/{tableId}/{recordId}/{commentId}";
export declare const DeleteCommentRoute: RouteConfig;
export declare const deleteComment: (tableId: string, recordId: string, commentId: string) => Promise<import("axios").AxiosResponse<void, any>>;
