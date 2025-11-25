import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_COMMENT_LIST = "/comment/{tableId}/{recordId}/list";
export declare const getCommentListVoSchema: z.ZodObject<{
    comments: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    comments: {
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
    }[];
    nextCursor?: string | null | undefined;
}, {
    comments: {
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
    }[];
    nextCursor?: string | null | undefined;
}>;
export type IGetCommentListVo = z.infer<typeof getCommentListVoSchema>;
export declare const getCommentListQueryRoSchema: z.ZodObject<{
    take: z.ZodOptional<z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, z.ZodNumber>>>;
    cursor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    includeCursor: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "false" | "true">]>>;
    direction: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"forward">, z.ZodLiteral<"backward">]>>;
}, "strip", z.ZodTypeAny, {
    take?: number | undefined;
    cursor?: string | null | undefined;
    includeCursor?: boolean | undefined;
    direction?: "forward" | "backward" | undefined;
}, {
    take?: string | number | undefined;
    cursor?: string | null | undefined;
    includeCursor?: boolean | "false" | "true" | undefined;
    direction?: "forward" | "backward" | undefined;
}>;
export type IGetCommentListQueryRo = z.infer<typeof getCommentListQueryRoSchema>;
export declare const GetCommentListRoute: RouteConfig;
export declare const getCommentList: (tableId: string, recordId: string, getCommentListQueryRo: IGetCommentListQueryRo) => Promise<import("axios").AxiosResponse<{
    comments: {
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
    }[];
    nextCursor?: string | null | undefined;
}, any>>;
