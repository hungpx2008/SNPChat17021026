import { jsx as _jsx } from "react/jsx-runtime";
import { CommentNodeType } from '@teable/openapi';
import { cn } from '@teable/ui-lib';
import { MentionUser, BlockImageElement, InlineLinkElement, BlockParagraphElement } from './node';
import { useIsMe } from './useIsMe';
export const CommentContent = (props) => {
    const { content, className, isExpanded = false } = props;
    const isMe = useIsMe();
    const finalContent = content.map((item, index) => {
        if (item.type === CommentNodeType.Img) {
            return (_jsx(BlockImageElement, { path: item.path, url: item.url, width: item.width, className: cn({
                    'justify-end': isMe && !isExpanded,
                }) }, index));
        }
        else {
            return (_jsx(BlockParagraphElement, { className: cn('my-0.5', {
                    'justify-end': isMe && !isExpanded,
                }), children: item.children.map((node, index) => {
                    switch (node.type) {
                        case CommentNodeType.Text: {
                            return _jsx("span", { children: node.value }, index);
                        }
                        case CommentNodeType.Mention: {
                            return (_jsx(MentionUser, { id: node.value, name: node.name, avatar: node.avatar, className: "mx-0.5 cursor-pointer rounded-md bg-secondary px-1 focus:ring-2" }, node.value));
                        }
                        case CommentNodeType.Link: {
                            return _jsx(InlineLinkElement, { href: node.url, title: node.title }, index);
                        }
                    }
                }) }, index));
        }
    });
    return _jsx("div", { className: cn('text-sm', className), children: finalContent });
};
