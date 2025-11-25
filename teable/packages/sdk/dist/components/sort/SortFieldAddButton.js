import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { Plus } from '@teable/icons';
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import { useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFields } from '../../hooks';
import { FieldCommand } from '../field/FieldCommand';
function SortFieldAddButton(props) {
    const { selectedFieldIds = [], addBtnText, onSelect } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = defaultFields.filter((f) => f.type !== FieldType.Button);
    const selectHandler = (value) => {
        setOpen(!open);
        onSelect?.(value);
    };
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", children: [_jsx(Plus, {}), _jsx("span", { children: addBtnText ?? t('sort.addButton') })] }) }), _jsx(PopoverContent, { className: cn('p-0', selectedFieldIds.length > 1 ? 'min-w-[434px]' : 'min-w-[410px]'), children: _jsx(FieldCommand, { fields: fields, onSelect: selectHandler, selectedIds: selectedFieldIds }) })] }));
}
export { SortFieldAddButton };
