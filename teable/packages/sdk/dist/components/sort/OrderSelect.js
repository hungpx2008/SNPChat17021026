import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { Checked, Square } from '@teable/icons';
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectContent, SelectItem, cn, } from '@teable/ui-lib';
import { useMemo } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFields } from '../../hooks';
function OrderSelect(props) {
    const { value, onSelect, fieldId, triggerClassName } = props;
    const { t } = useTranslation();
    const fields = useFields({ withHidden: true, withDenied: true });
    const field = useMemo(() => {
        return fields.find((field) => field.id === fieldId);
    }, [fieldId, fields]);
    const options = useMemo(() => {
        const cellValueType = field?.cellValueType;
        const fieldType = field?.type;
        const DEFAULTOPTIONS = [
            {
                value: 'asc',
                label: 'A → Z',
            },
            {
                value: 'desc',
                label: 'Z → A',
            },
        ];
        const NUMBEROPTIONS = [
            {
                value: 'asc',
                label: '1 → 9',
            },
            {
                value: 'desc',
                label: '9 → 1',
            },
        ];
        const SELECTOPTIONS = [
            {
                value: 'asc',
                label: t('sort.selectASCLabel'),
            },
            {
                value: 'desc',
                label: t('sort.selectDESCLabel'),
            },
        ];
        const CHECKBOXOPTIONS = [
            {
                value: 'asc',
                label: (_jsxs("div", { className: "flex items-center", children: [_jsx(Square, { className: "w-4 py-px" }), _jsx("span", { className: "px-1", children: "\u2192" }), _jsx(Checked, { className: "w-4" })] })),
            },
            {
                value: 'desc',
                label: (_jsxs("div", { className: "flex items-center", children: [_jsx(Checked, { className: "w-4" }), _jsx("span", { className: "px-1", children: "\u2192" }), _jsx(Square, { className: "w-4 py-px" })] })),
            },
        ];
        let option;
        switch (cellValueType) {
            case 'string':
                option = DEFAULTOPTIONS;
                break;
            case 'number':
                option = NUMBEROPTIONS;
                break;
            case 'boolean':
                option = CHECKBOXOPTIONS;
                break;
            default:
                option = DEFAULTOPTIONS;
                break;
        }
        /**
         * for select type
         * sort should sort by option's order
         */
        if (fieldType === FieldType.SingleSelect || fieldType === FieldType.MultipleSelect) {
            option = SELECTOPTIONS;
        }
        return option || DEFAULTOPTIONS;
    }, [field?.cellValueType, field?.type, t]);
    return (_jsxs(Select, { value: value, onValueChange: onSelect, children: [_jsx(SelectTrigger, { className: cn('mx-2 h-8 w-32', triggerClassName), children: _jsx(SelectValue, { placeholder: t('common.selectPlaceHolder') }) }), _jsx(SelectContent, { children: _jsx(SelectGroup, { children: options.map((option, index) => (_jsx(SelectItem, { value: option.value, children: option.label }, index))) }) })] }));
}
export { OrderSelect };
