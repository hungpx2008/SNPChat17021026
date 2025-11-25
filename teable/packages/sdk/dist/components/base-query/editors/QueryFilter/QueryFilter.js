import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { BaseFilter } from '../../../filter';
import { FieldComponent } from './FieldComponent';
import { OperatorComponent } from './OperatorComponent';
import { ValueComponent } from './ValueComponent';
export const QueryFilter = (props) => {
    const { value, onChange } = props;
    const filterValue = useMemo(() => {
        function transform(filter) {
            if ('filterSet' in filter) {
                return {
                    conjunction: filter.conjunction,
                    children: filter.filterSet.map(transform),
                };
            }
            else {
                return {
                    field: filter.column,
                    operator: filter.operator,
                    value: filter.value,
                    type: filter.type,
                };
            }
        }
        return value ? transform(value) : undefined;
    }, [value]);
    const onInnerChange = (value) => {
        if (!value.children.length) {
            return onChange(undefined);
        }
        function transform(filter) {
            if ('children' in filter) {
                return {
                    conjunction: filter.conjunction,
                    filterSet: filter.children.map(transform),
                };
            }
            else {
                return {
                    column: filter.field,
                    operator: filter.operator,
                    value: filter.value,
                    type: filter.type,
                };
            }
        }
        onChange(transform(value));
    };
    return (_jsx("div", { children: _jsx(BaseFilter, { value: filterValue, onChange: onInnerChange, components: {
                FieldComponent: FieldComponent,
                OperatorComponent: OperatorComponent,
                ValueComponent: ValueComponent,
            } }) }));
};
