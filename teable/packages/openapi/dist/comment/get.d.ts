import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_COMMENT_DETAIL = "/comment/{tableId}/{recordId}/{commentId}";
export declare const commentSchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<import("./types").CommentNodeType.Paragraph>;
        children: z.ZodArray<z.ZodUnion<[z.ZodObject<{} & {
            type: z.ZodLiteral<import("./types").CommentNodeType.Text>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: import("./types").CommentNodeType.Text;
            value: string;
        }, {
            type: import("./types").CommentNodeType.Text;
            value: string;
        }>, z.ZodObject<{} & {
            type: z.ZodLiteral<import("./types").CommentNodeType.Mention>;
            value: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            avatar: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: import("./types").CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }, {
            type: import("./types").CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }>, z.ZodObject<{
            value: z.ZodOptional<z.ZodUnknown>;
        } & {
            type: z.ZodLiteral<import("./types").CommentNodeType.Link>;
            url: z.ZodString;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type: import("./types").CommentNodeType.Link;
            title: string;
            value?: unknown;
        }, {
            url: string;
            type: import("./types").CommentNodeType.Link;
            title: string;
            value?: unknown;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>, z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<import("./types").CommentNodeType.Img>;
        path: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: import("./types").CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }, {
        path: string;
        type: import("./types").CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }>]>, "many">;
    createdBy: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        avatar?: string | undefined;
    }, {
        name: string;
        id: string;
        avatar?: string | undefined;
    }>;
    reaction: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        reaction: z.ZodEffects<z.ZodString, string, string>;
        user: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            avatar: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
            avatar?: string | undefined;
        }, {
            name: string;
            id: string;
            avatar?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        user: {
            name: string;
            id: string;
            avatar?: string | undefined;
        }[];
        reaction: string;
    }, {
        user: {
            name: string;
            id: string;
            avatar?: string | undefined;
        }[];
        reaction: string;
    }>, "many">>>;
    createdTime: z.ZodString;
    lastModifiedTime: z.ZodOptional<z.ZodString>;
    quoteId: z.ZodOptional<z.ZodString>;
    deletedTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type ICommentVo = z.infer<typeof commentSchema>;
export declare const GetCommentDetailRoute: RouteConfig;
export declare const getCommentDetail: (tableId: string, recordId: string, commentId: string) => Promise<import("axios").AxiosResponse<{
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
} | null, any>>;
