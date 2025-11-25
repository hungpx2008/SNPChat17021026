import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { assertNever } from '@teable/core';
import { X, ChevronRight } from '@teable/icons';
import { getCommentDetail, CommentNodeType } from '@teable/openapi';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useTableId } from '../../../hooks';
import { CommentContent } from '../comment-list/CommentContent';
import { MentionUser, BlockImageElement } from '../comment-list/node';
import { useRecordId } from '../hooks';
export const CommentQuote = (props) => {
    const { className, quoteId, onClose } = props;
    const tableId = useTableId();
    const recordId = useRecordId();
    const { t } = useTranslation();
    const { data: quoteData } = useQuery({
        queryKey: ReactQueryKeys.commentDetail(tableId, recordId, quoteId),
        queryFn: () => getCommentDetail(tableId, recordId, quoteId).then((res) => res.data),
        enabled: !!tableId && !!recordId && !!quoteId,
    });
    const textRef = useRef(null);
    const [showTooltip, setShowTooltip] = useState(false);
    useEffect(() => {
        const checkTextOverflow = () => {
            const element = textRef.current;
            if (element) {
                setShowTooltip(element.scrollWidth > element.clientWidth);
            }
        };
        checkTextOverflow();
        window.addEventListener('resize', checkTextOverflow);
        return () => {
            window.removeEventListener('resize', checkTextOverflow);
        };
    }, [quoteData]);
    const findDisplayLine = (commentContent) => {
        for (let i = 0; i < commentContent.length; i++) {
            const curLine = commentContent[i];
            if (curLine.type === CommentNodeType.Paragraph && curLine?.children?.length) {
                return curLine.children;
            }
            if (curLine.type === CommentNodeType.Img) {
                return curLine;
            }
        }
        return null;
    };
    const quoteAbbreviationRender = useMemo(() => {
        const displayLine = findDisplayLine(quoteData?.content || []);
        if (!quoteData || !displayLine) {
            return null;
        }
        // only display the first line of the quote
        if (Array.isArray(displayLine)) {
            return (_jsx("span", { className: "truncate leading-6 text-secondary-foreground/50", ref: textRef, children: displayLine.map((node, index) => {
                    switch (node.type) {
                        case CommentNodeType.Link: {
                            const title = node.title || node.url;
                            return (_jsx("span", { title: title, children: title }, index));
                        }
                        case CommentNodeType.Text:
                            return (_jsx("span", { title: node.value, children: node.value }, index));
                        case CommentNodeType.Mention:
                            return (_jsx(MentionUser, { id: node.value, name: node.name, avatar: node.avatar }, index));
                        default:
                            assertNever(node);
                    }
                }) }));
        }
        if (displayLine.type === CommentNodeType.Img) {
            return _jsx(BlockImageElement, { path: displayLine.path, width: 20, url: displayLine.url });
        }
        return null;
    }, [quoteData]);
    return (quoteId && (_jsxs("div", { className: cn('flex items-center justify-between truncate bg-secondary px-2 py-1 h-8 overflow-hidden', className), children: [_jsxs("div", { className: "flex h-full items-center truncate text-xs", children: [quoteData?.createdBy && _jsx(MentionUser, { ...quoteData.createdBy }), _jsx("span", { className: "self-center pr-1", children: ":" }), !quoteData ? (_jsx("del", { className: "self-center text-secondary-foreground/50", children: t('comment.deletedComment') })) : (_jsxs(_Fragment, { children: [quoteAbbreviationRender, showTooltip && (_jsxs(Popover, { modal: true, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: 'xs', className: cn('p-0'), children: _jsx(ChevronRight, {}) }) }), _jsx(PopoverContent, { className: "max-h-40 max-w-60 overflow-auto p-2", children: _jsx(CommentContent, { content: quoteData.content, isExpanded: true }) })] }))] }))] }), onClose && (_jsx(Button, { variant: 'ghost', size: 'xs', children: _jsx(X, { onClick: () => onClose?.() }) }))] })));
};
