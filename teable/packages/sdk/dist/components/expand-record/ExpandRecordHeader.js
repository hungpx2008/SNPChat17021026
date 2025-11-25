import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronUp, Copy, History, Link, MoreHorizontal, Trash2, X, MessageSquare, } from '@teable/icons';
import { Button, cn, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator, } from '@teable/ui-lib';
import { useMeasure } from 'react-use';
import { useTranslation } from '../../context/app/i18n';
import { useTablePermission } from '../../hooks';
import { useRecordCommentCount } from '../comment/hooks';
import { TooltipWrap } from './TooltipWrap';
// eslint-disable-next-line @typescript-eslint/naming-convention
const MIN_TITLE_WIDTH = 300;
// eslint-disable-next-line @typescript-eslint/naming-convention
const MIN_OPERATOR_WIDTH = 200;
export const ExpandRecordHeader = (props) => {
    const { tableId, recordId, title, recordHistoryVisible, commentVisible, disabledPrev, disabledNext, onPrev, onNext, onClose, onCopyUrl, onRecordHistoryToggle, onCommentToggle, onDelete, onDuplicate, } = props;
    const permission = useTablePermission();
    const editable = Boolean(permission['record|update']);
    const canRead = Boolean(permission['record|read']);
    const canDelete = Boolean(permission['record|delete']);
    const [ref, { width }] = useMeasure();
    const { t } = useTranslation();
    const showTitle = width > MIN_TITLE_WIDTH;
    const showOperator = width > MIN_OPERATOR_WIDTH;
    const recordCommentCount = useRecordCommentCount(tableId, recordId, canRead);
    return (_jsxs("div", { ref: ref, className: cn('w-full h-12 flex items-center gap-4 px-4 border-b border-solid border-border', { 'justify-between': !showTitle }), children: [_jsxs("div", { children: [_jsx(TooltipWrap, { description: "Previous record", disabled: disabledPrev, children: _jsx(Button, { variant: 'ghost', tabIndex: -1, size: 'xs', onClick: onPrev, disabled: disabledPrev, children: _jsx(ChevronUp, {}) }) }), _jsx(TooltipWrap, { description: "Next record", disabled: disabledNext, children: _jsx(Button, { variant: 'ghost', size: 'xs', tabIndex: -1, onClick: onNext, disabled: disabledNext, children: _jsx(ChevronDown, {}) }) })] }), showTitle && (_jsx("h4", { title: title, className: "flex-1 scroll-m-20 truncate text-xl font-semibold tracking-tight", children: title || t('common.unnamedRecord') })), showOperator && (_jsxs("div", { className: "flex items-center gap-0.5", children: [_jsx(TooltipWrap, { description: t('expandRecord.copyRecordUrl'), children: _jsx(Button, { variant: 'ghost', size: 'xs', onClick: onCopyUrl, children: _jsx(Link, {}) }) }), editable && (_jsx(TooltipWrap, { description: recordHistoryVisible
                            ? t('expandRecord.recordHistory.hiddenRecordHistory')
                            : t('expandRecord.recordHistory.showRecordHistory'), children: _jsx(Button, { variant: recordHistoryVisible ? 'secondary' : 'ghost', size: 'xs', onClick: onRecordHistoryToggle, children: _jsx(History, {}) }) })), editable && (_jsx(TooltipWrap, { description: t('comment.title'), children: _jsxs(Button, { size: 'xs', onClick: onCommentToggle, variant: commentVisible ? 'secondary' : 'ghost', className: "relative", children: [_jsx(MessageSquare, {}), recordCommentCount ? (_jsx("div", { className: "absolute left-4 top-0.5 flex h-3 min-w-3 max-w-5 items-center justify-center rounded-[2px] bg-orange-500 px-0.5 text-[8px] text-white", children: recordCommentCount > 99 ? '99+' : recordCommentCount })) : null] }) })), canDelete ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { className: "px-2", children: _jsx(MoreHorizontal, {}) }), _jsxs(DropdownMenuContent, { children: [!!onDuplicate && (_jsxs(DropdownMenuItem, { className: "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm outline-none", onClick: async () => {
                                            await onDuplicate();
                                            setTimeout(() => onClose?.(), 100);
                                        }, children: [_jsx(Copy, {}), " ", t('expandRecord.duplicateRecord')] })), _jsxs(DropdownMenuItem, { className: "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-500 outline-none hover:text-red-500 focus:text-red-500 aria-selected:text-red-500", onClick: async () => {
                                            await onDelete?.();
                                            setTimeout(() => onClose?.(), 100);
                                        }, children: [_jsx(Trash2, {}), " ", t('expandRecord.deleteRecord')] })] })] })) : null] })), _jsx(Separator, { className: "h-6", orientation: "vertical" }), _jsx(Button, { variant: 'ghost', size: 'xs', onClick: onClose, children: _jsx(X, {}) })] }));
};
