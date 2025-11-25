import React from 'react';
export interface ICommentContext {
    baseId: string;
    recordId?: string;
}
export declare const CommentContext: React.Context<ICommentContext>;
