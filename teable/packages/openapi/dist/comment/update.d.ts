import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IUpdateCommentRo } from './types';
export declare const UPDATE_COMMENT = "/comment/{tableId}/{recordId}/{commentId}";
export declare const UpdateCommentRoute: RouteConfig;
export declare const updateComment: (tableId: string, recordId: string, commentId: string, updateCommentRo: IUpdateCommentRo) => Promise<import("axios").AxiosResponse<void, any>>;
