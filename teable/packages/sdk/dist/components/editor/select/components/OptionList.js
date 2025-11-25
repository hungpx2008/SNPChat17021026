import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check } from '@teable/icons';
import { CommandList, CommandItem } from '@teable/ui-lib';
import { useRef } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
import { SelectTag } from '../../../cell-value';
export const OptionList = (props) => {
    const { options, checkIsActive, onSelect } = props;
    const listRef = useRef(null);
    const { t } = useTranslation();
    const rowVirtualizer = useVirtualizer({
        count: options.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 32,
    });
    return (_jsx(CommandList, { ref: listRef, className: "w-full overflow-auto", children: _jsx("div", { style: {
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
            }, children: rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const { index, size, start, key } = virtualItem;
                const option = options[index];
                if (option == null)
                    return null;
                const { label, value, color, backgroundColor } = option;
                return (_jsxs(CommandItem, { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${size}px`,
                        transform: `translateY(${start}px)`,
                    }, value: key.toString(), onSelect: () => onSelect?.(value), children: [_jsx(SelectTag, { className: "truncate", label: label || t('common.untitled'), backgroundColor: backgroundColor, color: color }), checkIsActive(value) && _jsx(Check, { className: "ml-2 size-4 shrink-0" })] }, key));
            }) }) }));
};
