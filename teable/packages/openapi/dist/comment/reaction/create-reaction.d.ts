import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const CREATE_COMMENT_REACTION = "/comment/{tableId}/{recordId}/{commentId}/reaction";
export declare const commentReactionSymbolSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const commentReactionSchema: z.ZodArray<z.ZodObject<{
    reaction: z.ZodEffects<z.ZodString, string, string>;
    user: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    user: string[];
    reaction: string;
}, {
    user: string[];
    reaction: string;
}>, "many">;
export type ICommentReaction = z.infer<typeof commentReactionSchema>;
export declare const commentReactionDetailSchema: z.ZodArray<z.ZodObject<{
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
}>, "many">;
export type ICommentReactionDetail = z.infer<typeof commentReactionDetailSchema>;
export declare const updateCommentReactionRoSchema: z.ZodObject<{
    reaction: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    reaction: string;
}, {
    reaction: string;
}>;
export type IUpdateCommentReactionRo = z.infer<typeof updateCommentReactionRoSchema>;
export declare const CreateCommentReactionRoute: RouteConfig;
export declare const createCommentReaction: (tableId: string, recordId: string, commentId: string, createCommentReactionRo: IUpdateCommentReactionRo) => Promise<import("axios").AxiosResponse<void, any>>;
