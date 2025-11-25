import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LayoutList } from '@teable/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { useMemo, useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { ReadOnlyTip } from '../ReadOnlyTip';
import { SortContent } from '../sort/SortContent';
export const Group = (props) => {
    const { children, onChange, group } = props;
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const groupLength = group?.length;
    const { text, isActive } = useMemo(() => {
        const text = groupLength
            ? t(`group.displayLabel_${groupLength > 1 ? 'other' : 'one'}`, { count: groupLength })
            : t('group.label');
        return {
            text,
            isActive: text !== t('group.label'),
            Icon: LayoutList,
        };
    }, [groupLength, t]);
    const onChangeInner = (group) => {
        onChange?.(group?.length ? group : null);
    };
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: children?.(text, isActive) }), _jsxs(PopoverContent, { side: "bottom", align: "start", className: "relative w-fit max-w-screen-md p-0", children: [_jsx(ReadOnlyTip, {}), _jsx("header", { className: "mx-3", children: _jsx("div", { className: "border-b py-3 text-[13px]", children: t('group.setTips') }) }), _jsx(SortContent, { limit: 3, sortValues: group ?? undefined, addBtnText: t('group.addButton'), onChange: onChangeInner })] })] }));
};
