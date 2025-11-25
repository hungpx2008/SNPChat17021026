import { z } from '../zod';
export declare enum CommentNodeType {
    Text = "span",
    Link = "a",
    Paragraph = "p",
    Img = "img",
    Mention = "mention"
}
export declare enum CommentPatchType {
    CreateComment = "create_comment",
    UpdateComment = "update_comment",
    DeleteComment = "delete_comment",
    CreateReaction = "create_reaction",
    DeleteReaction = "delete_reaction"
}
export declare const baseCommentContentSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof CommentNodeType>;
    value: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    type: CommentNodeType;
    value?: unknown;
}, {
    type: CommentNodeType;
    value?: unknown;
}>;
export declare const textCommentContentSchema: z.ZodObject<{} & {
    type: z.ZodLiteral<CommentNodeType.Text>;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: CommentNodeType.Text;
    value: string;
}, {
    type: CommentNodeType.Text;
    value: string;
}>;
export declare const mentionCommentContentSchema: z.ZodObject<{} & {
    type: z.ZodLiteral<CommentNodeType.Mention>;
    value: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: CommentNodeType.Mention;
    value: string;
    name?: string | undefined;
    avatar?: string | undefined;
}, {
    type: CommentNodeType.Mention;
    value: string;
    name?: string | undefined;
    avatar?: string | undefined;
}>;
export declare const linkCommentContentSchema: z.ZodObject<{
    value: z.ZodOptional<z.ZodUnknown>;
} & {
    type: z.ZodLiteral<CommentNodeType.Link>;
    url: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    type: CommentNodeType.Link;
    title: string;
    value?: unknown;
}, {
    url: string;
    type: CommentNodeType.Link;
    title: string;
    value?: unknown;
}>;
export declare const imageCommentContentSchema: z.ZodObject<{
    value: z.ZodOptional<z.ZodUnknown>;
} & {
    type: z.ZodLiteral<CommentNodeType.Img>;
    path: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: CommentNodeType.Img;
    url?: string | undefined;
    value?: unknown;
    width?: number | undefined;
}, {
    path: string;
    type: CommentNodeType.Img;
    url?: string | undefined;
    value?: unknown;
    width?: number | undefined;
}>;
export declare const paragraphCommentContentSchema: z.ZodObject<{
    value: z.ZodOptional<z.ZodUnknown>;
} & {
    type: z.ZodLiteral<CommentNodeType.Paragraph>;
    children: z.ZodArray<z.ZodUnion<[z.ZodObject<{} & {
        type: z.ZodLiteral<CommentNodeType.Text>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Text;
        value: string;
    }, {
        type: CommentNodeType.Text;
        value: string;
    }>, z.ZodObject<{} & {
        type: z.ZodLiteral<CommentNodeType.Mention>;
        value: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    }, {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    }>, z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Link>;
        url: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    }, {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    type: CommentNodeType.Paragraph;
    children: ({
        type: CommentNodeType.Text;
        value: string;
    } | {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    } | {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    })[];
    value?: unknown;
}, {
    type: CommentNodeType.Paragraph;
    children: ({
        type: CommentNodeType.Text;
        value: string;
    } | {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    } | {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    })[];
    value?: unknown;
}>;
export type IParagraphCommentContent = z.infer<typeof paragraphCommentContentSchema>;
export declare const commentContentSchema: z.ZodArray<z.ZodUnion<[z.ZodObject<{
    value: z.ZodOptional<z.ZodUnknown>;
} & {
    type: z.ZodLiteral<CommentNodeType.Paragraph>;
    children: z.ZodArray<z.ZodUnion<[z.ZodObject<{} & {
        type: z.ZodLiteral<CommentNodeType.Text>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Text;
        value: string;
    }, {
        type: CommentNodeType.Text;
        value: string;
    }>, z.ZodObject<{} & {
        type: z.ZodLiteral<CommentNodeType.Mention>;
        value: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    }, {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    }>, z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Link>;
        url: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    }, {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    type: CommentNodeType.Paragraph;
    children: ({
        type: CommentNodeType.Text;
        value: string;
    } | {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    } | {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    })[];
    value?: unknown;
}, {
    type: CommentNodeType.Paragraph;
    children: ({
        type: CommentNodeType.Text;
        value: string;
    } | {
        type: CommentNodeType.Mention;
        value: string;
        name?: string | undefined;
        avatar?: string | undefined;
    } | {
        url: string;
        type: CommentNodeType.Link;
        title: string;
        value?: unknown;
    })[];
    value?: unknown;
}>, z.ZodObject<{
    value: z.ZodOptional<z.ZodUnknown>;
} & {
    type: z.ZodLiteral<CommentNodeType.Img>;
    path: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: CommentNodeType.Img;
    url?: string | undefined;
    value?: unknown;
    width?: number | undefined;
}, {
    path: string;
    type: CommentNodeType.Img;
    url?: string | undefined;
    value?: unknown;
    width?: number | undefined;
}>]>, "many">;
export type ICommentContent = z.infer<typeof commentContentSchema>;
export declare const createCommentRoSchema: z.ZodObject<{
    quoteId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Paragraph>;
        children: z.ZodArray<z.ZodUnion<[z.ZodObject<{} & {
            type: z.ZodLiteral<CommentNodeType.Text>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: CommentNodeType.Text;
            value: string;
        }, {
            type: CommentNodeType.Text;
            value: string;
        }>, z.ZodObject<{} & {
            type: z.ZodLiteral<CommentNodeType.Mention>;
            value: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            avatar: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }, {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }>, z.ZodObject<{
            value: z.ZodOptional<z.ZodUnknown>;
        } & {
            type: z.ZodLiteral<CommentNodeType.Link>;
            url: z.ZodString;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        }, {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    }, {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    }>, z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Img>;
        path: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }, {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    content: ({
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    } | {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    })[];
    quoteId?: string | null | undefined;
}, {
    content: ({
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    } | {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    })[];
    quoteId?: string | null | undefined;
}>;
export declare const updateCommentRoSchema: z.ZodObject<Pick<{
    quoteId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Paragraph>;
        children: z.ZodArray<z.ZodUnion<[z.ZodObject<{} & {
            type: z.ZodLiteral<CommentNodeType.Text>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: CommentNodeType.Text;
            value: string;
        }, {
            type: CommentNodeType.Text;
            value: string;
        }>, z.ZodObject<{} & {
            type: z.ZodLiteral<CommentNodeType.Mention>;
            value: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            avatar: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }, {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        }>, z.ZodObject<{
            value: z.ZodOptional<z.ZodUnknown>;
        } & {
            type: z.ZodLiteral<CommentNodeType.Link>;
            url: z.ZodString;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        }, {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    }, {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    }>, z.ZodObject<{
        value: z.ZodOptional<z.ZodUnknown>;
    } & {
        type: z.ZodLiteral<CommentNodeType.Img>;
        path: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }, {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    }>]>, "many">;
}, "content">, "strip", z.ZodTypeAny, {
    content: ({
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    } | {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    })[];
}, {
    content: ({
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    } | {
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    })[];
}>;
export type ICreateCommentRo = z.infer<typeof createCommentRoSchema>;
export type IUpdateCommentRo = z.infer<typeof updateCommentRoSchema>;
export declare const commentPatchDataSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof CommentPatchType>;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    type: CommentPatchType;
}, {
    data: Record<string, unknown>;
    type: CommentPatchType;
}>;
export type ICommentPatchData = z.infer<typeof commentPatchDataSchema>;
