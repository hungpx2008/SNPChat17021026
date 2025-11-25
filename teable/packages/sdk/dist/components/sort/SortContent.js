import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType, SortFunc } from '@teable/core';
import { useMemo } from 'react';
import { useFields } from '../../hooks';
import { FieldCommand } from '../field/FieldCommand';
import { DraggableSortList } from './DraggableSortList';
import { SortFieldAddButton } from './SortFieldAddButton';
export function SortContent(props) {
    const { onChange, sortValues = [], addBtnText, limit = Infinity } = props;
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = defaultFields.filter((f) => f.type !== FieldType.Button);
    const selectedFieldIds = useMemo(() => sortValues.map((sort) => sort.fieldId) || [], [sortValues]);
    const onFieldSelect = (fieldId) => {
        onChange([
            {
                fieldId: fieldId,
                order: SortFunc.Asc,
            },
        ]);
    };
    const onFieldAdd = (value) => {
        onChange(sortValues.concat({
            fieldId: value,
            order: SortFunc.Asc,
        }));
    };
    const onSortChange = (sorts) => {
        onChange(sorts?.length ? sorts : undefined);
    };
    if (!sortValues.length) {
        return _jsx(FieldCommand, { fields: fields, onSelect: onFieldSelect });
    }
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("div", { className: "max-h-96 overflow-auto p-3", children: _jsx(DraggableSortList, { sorts: sortValues, selectedFields: selectedFieldIds, onChange: onSortChange }) }), selectedFieldIds.length < limit && (_jsx(SortFieldAddButton, { addBtnText: addBtnText, selectedFieldIds: selectedFieldIds, onSelect: onFieldAdd }))] }));
}
