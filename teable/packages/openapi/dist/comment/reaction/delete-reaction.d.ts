import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IUpdateCommentReactionRo } from './create-reaction';
export declare const DELETE_COMMENT_REACTION = "/comment/{tableId}/{recordId}/{commentId}/reaction";
export declare const DeleteCommentReactionRoute: RouteConfig;
export declare const deleteCommentReaction: (tableId: string, recordId: string, commentId: string, deleteCommentReactionRo: IUpdateCommentReactionRo) => Promise<import("axios").AxiosResponse<void, any>>;
