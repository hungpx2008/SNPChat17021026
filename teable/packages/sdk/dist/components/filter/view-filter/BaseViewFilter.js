import { jsx as _jsx } from "react/jsx-runtime";
import { getValidFilterOperators } from '@teable/core';
import { useMemo } from 'react';
import { BaseFilter } from '../BaseFilter';
import { ViewFilterContext } from './context';
import { FieldSelect, OperatorSelect, FieldValue } from './custom-component';
import { viewFilter2BaseFilter, baseFilter2ViewFilter } from './utils';
export const BaseViewFilter = (props) => {
    const { value: filter, onChange, customValueComponent, fields, operatorSelect } = props;
    const baseFilter = useMemo(() => {
        return viewFilter2BaseFilter(filter);
    }, [filter]);
    const onChangeHandler = (value) => {
        onChange(baseFilter2ViewFilter(value));
    };
    const defaultField = useMemo(() => fields?.[0] || {}, [fields]);
    const defaultItemValue = useMemo(() => {
        return {
            field: defaultField.id || null,
            operator: getValidFilterOperators(defaultField)[0] || null,
            value: null,
        };
    }, [defaultField]);
    return (_jsx(ViewFilterContext.Provider, { value: { fields, viewFilterLinkContext: props.viewFilterLinkContext }, children: _jsx(BaseFilter, { defaultItemValue: defaultItemValue, value: baseFilter, onChange: onChangeHandler, footerClassName: "p-2 pt-0", contentClassName: "py-2 px-3", components: {
                FieldComponent: FieldSelect,
                OperatorComponent: operatorSelect ?? OperatorSelect,
                ValueComponent: customValueComponent ?? FieldValue,
            } }) }));
};
