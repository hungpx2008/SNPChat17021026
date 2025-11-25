import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { ICreateCommentRo } from './types';
export declare const CREATE_COMMENT = "/comment/{tableId}/{recordId}/create";
export declare const CreateCommentRoute: RouteConfig;
export declare const createComment: (tableId: string, recordId: string, createCommentRo: ICreateCommentRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    content: ({
        path: string;
        type: import("./types").CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    } | {
        type: import("./types").CommentNodeType.Paragraph;
        children: ({
            type: import("./types").CommentNodeType.Text;
            value: string;
        } | {
            type: import("./types").CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: import("./types").CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    })[];
    createdBy: {
        name: string;
        id: string;
        avatar?: string | undefined;
    };
    createdTime: string;
    lastModifiedTime?: string | undefined;
    deletedTime?: string | undefined;
    reaction?: {
        user: {
            name: string;
            id: string;
            avatar?: string | undefined;
        }[];
        reaction: string;
    }[] | null | undefined;
    quoteId?: string | undefined;
}, any>>;
