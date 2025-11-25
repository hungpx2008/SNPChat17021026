import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { ChevronDown } from '@teable/icons';
import { Button, Popover, PopoverTrigger, PopoverContent, cn } from '@teable/ui-lib';
import { useState, useMemo } from 'react';
import { useFields, useFieldStaticGetter, useTables } from '../../hooks';
import { FieldCommand } from './FieldCommand';
export function FieldSelector(props) {
    const { value, className, excludedIds: selectedIds, placeholder, emptyHolder, onSelect, children, modal = false, fields: propsFields, showTableName = false, tableId: tableIdProp, tableName: tableNameProp, isOptionDisabled, } = props;
    const [open, setOpen] = useState(false);
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = propsFields ?? defaultFields;
    const selectedField = useMemo(() => fields.find((f) => f.id === value), [fields, value]);
    const fieldStaticGetter = useFieldStaticGetter();
    const tables = useTables();
    const { Icon } = fieldStaticGetter(selectedField?.type || FieldType.SingleLineText, {
        isLookup: selectedField?.isLookup,
        isConditionalLookup: selectedField?.isConditionalLookup,
        hasAiConfig: Boolean(selectedField?.aiConfig),
        deniedReadRecord: !selectedField?.canReadFieldRecord,
    });
    const tableId = useMemo(() => {
        if (!showTableName) {
            return undefined;
        }
        if (tableIdProp) {
            return tableIdProp;
        }
        if (selectedField?.tableId) {
            return selectedField.tableId;
        }
        return fields[0]?.tableId;
    }, [fields, selectedField?.tableId, showTableName, tableIdProp]);
    const tableHeading = useMemo(() => {
        if (!showTableName) {
            return undefined;
        }
        if (tableNameProp) {
            return tableNameProp;
        }
        if (!tableId) {
            return undefined;
        }
        return tables?.find((table) => table.id === tableId)?.name;
    }, [showTableName, tableNameProp, tableId, tables]);
    const selectHandler = (value) => {
        setOpen(false);
        onSelect?.(value);
    };
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: modal, children: [_jsx(PopoverTrigger, { asChild: true, children: children ? (children) : (_jsxs(Button, { variant: "outline", role: "combobox", tabIndex: -1, "aria-expanded": open, className: cn('h-9 max-w-[200px] px-3 flex items-center', className), children: [_jsxs("div", { className: "flex flex-1 items-center gap-1 truncate", children: [_jsx(Icon, { className: "size-4 shrink-0" }), _jsx("span", { className: "min-w-8 truncate pl-1 text-left text-sm font-normal", children: selectedField?.name })] }), _jsx(ChevronDown, { className: "size-4 shrink-0 text-muted-foreground" })] })) }), _jsx(PopoverContent, { className: "w-[200px] p-0", container: props.container, children: _jsx(FieldCommand, { fields: fields, selectedIds: selectedIds, placeholder: placeholder, emptyHolder: emptyHolder, onSelect: selectHandler, groupHeading: tableHeading, isDisabled: isOptionDisabled }) })] }));
}
