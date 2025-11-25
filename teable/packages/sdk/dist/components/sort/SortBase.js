import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { ReadOnlyTip } from '../ReadOnlyTip';
import { SortConfig } from './SortConfig';
import { SortContent } from './SortContent';
export const SortBase = forwardRef((props, sortBaseRef) => {
    const { children, manualSortLoading, sorts, hiddenManual, manualSortOnClick, onChange } = props;
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { sortObjs, manualSort } = sorts || {};
    useImperativeHandle(sortBaseRef, () => ({
        close: () => setIsOpen(false),
    }));
    const onSortConfigChange = (value) => {
        if (sortObjs) {
            onChange({
                sortObjs,
                manualSort: value,
            });
            return;
        }
        onChange(null);
    };
    const onSortObjsChange = (sorts) => {
        const sortObjs = sorts?.length
            ? {
                sortObjs: sorts,
                manualSort,
            }
            : null;
        onChange(sortObjs);
    };
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: children }), _jsxs(PopoverContent, { side: "bottom", align: "start", className: "relative w-fit max-w-screen-md p-0", children: [_jsx(ReadOnlyTip, {}), _jsx("header", { className: "mx-3", children: _jsx("div", { className: "border-b py-3 text-[13px]", children: t('sort.setTips') }) }), _jsx(SortContent, { sortValues: sortObjs, onChange: onSortObjsChange }), Boolean(sortObjs?.length) && !hiddenManual && (_jsx(SortConfig, { buttonLoading: manualSortLoading, value: manualSort, onChange: onSortConfigChange, onClick: manualSortOnClick }))] })] }));
});
SortBase.displayName = 'SortBase';
