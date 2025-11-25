import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_COMMENT_ATTACHMENT_URL = "/comment/{tableId}/{recordId}/attachment/{path}";
export declare const GetCommentAttachmentUrlRoute: RouteConfig;
export declare const getCommentAttachmentUrl: (tableId: string, recordId: string, path: string) => Promise<import("axios").AxiosResponse<string, any>>;
