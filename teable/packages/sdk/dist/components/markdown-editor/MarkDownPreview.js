import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { isEqual } from 'lodash';
import { memo } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
export const MarkdownPreview = (props) => {
    return (_jsx(Markdown, { className: cn('markdown-body px-3 py-2', props.className), rehypePlugins: [rehypeRaw], remarkPlugins: [remarkGfm], components: props.components, children: props.children }));
};
export const MemoizedContentMarkdownPreview = memo(MarkdownPreview, (prev, next) => {
    return isEqual(prev.children, next.children);
});
