import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useCallback, useMemo } from 'react';
import { useCrud } from '../../hooks';
import { DefaultErrorLabel } from '../component';
import { BaseSingleSelect } from '../component/base/BaseSingleSelect';
import { useOperators } from '../hooks';
import { useFields } from '../hooks/useFields';
import { useOperatorI18nMap } from '../hooks/useOperatorI18nMap';
import { shouldFilterByDefaultValue, shouldResetFieldValue } from '../utils';
export const OperatorSelect = (props) => {
    const { value, item, path, disabledOperators } = props;
    const { field: fieldId } = item;
    const { onChange } = useCrud();
    const fields = useFields();
    const field = fields.find((f) => f.id === fieldId);
    const labelMapping = useOperatorI18nMap(field?.cellValueType);
    const operators = useOperators(field);
    const operatorOption = useMemo(() => {
        return operators
            .filter((operator) => !disabledOperators?.includes(operator))
            .map((operator) => {
            return {
                label: labelMapping[operator],
                value: operator,
            };
        });
    }, [labelMapping, operators, disabledOperators]);
    const shouldDisabled = useMemo(() => shouldFilterByDefaultValue(field), [field]);
    const onSelectHandler = useCallback((value) => {
        const resetFieldValue = shouldResetFieldValue(item.operator, value);
        if (resetFieldValue || !operators.includes(value)) {
            const newPath = path.slice(0, -1);
            onChange(newPath, {
                field: item.field,
                operator: value,
                value: null,
            });
        }
        else {
            onChange(path, value);
        }
    }, [item.field, item.operator, onChange, operators, path]);
    return (_jsx(BaseSingleSelect, { value: value, options: operatorOption, popoverClassName: "w-48", className: cn('shrink-0 justify-between w-28 h-8'), onSelect: onSelectHandler, disabled: shouldDisabled, defaultLabel: _jsx(DefaultErrorLabel, {}) }));
};
