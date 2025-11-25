import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVirtualizer } from '@tanstack/react-virtual';
import { Command, CommandItem, CommandList, Separator, cn } from '@teable/ui-lib';
import { useEffect, useRef } from 'react';
import { useTranslation } from '../../context/app/i18n';
export const RecordList = (props) => {
    const { empty, rowCount, children, className, itemClassName, isLoading, itemHeight = 46, onSelect, itemRender, onVisibleChange, } = props;
    const { t } = useTranslation();
    const listRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => listRef.current,
        estimateSize: () => itemHeight,
    });
    useEffect(() => {
        if (rowVirtualizer.range) {
            const { startIndex, endIndex } = rowVirtualizer.range;
            onVisibleChange?.([startIndex, endIndex]);
        }
    }, [onVisibleChange, rowVirtualizer.range]);
    return (_jsxs(Command, { className: cn('flex flex-col', className), children: [children && (_jsxs("div", { className: "w-full", children: [children, _jsx(Separator, { className: "my-2" })] })), isLoading ? (_jsx("div", { className: "flex h-full items-center justify-center", children: t('common.loading') })) : (rowCount === 0 && (_jsx("div", { className: "flex h-full items-center justify-center", children: empty || t('common.noRecords') }))), _jsx(CommandList, { ref: listRef, className: cn('w-full flex-1 overflow-auto max-h-full', {
                    'h-0': isLoading || rowCount > 0,
                }), children: _jsx("div", { style: {
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }, children: rowVirtualizer.getVirtualItems().map((virtualItem) => (_jsx(CommandItem, { style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                        }, className: itemClassName, value: virtualItem.key.toString(), onSelect: () => onSelect?.(virtualItem.index), children: itemRender(virtualItem.index) }, virtualItem.key))) }) })] }));
};
