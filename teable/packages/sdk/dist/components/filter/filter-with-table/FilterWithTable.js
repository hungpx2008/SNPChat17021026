import { jsx as _jsx } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { BaseViewFilter, FieldValue } from '../view-filter';
import { FilterLinkBase, FilterLinkSelect, StandDefaultList } from '../view-filter/component';
import { FilterLinkContext } from '../view-filter/component/filter-link/context';
const FilterLinkSelectCom = (props) => {
    return (_jsx(FilterLinkSelect, { ...props, modal: true, components: {
            List: StandDefaultList,
        } }));
};
const FilterLink = (props) => {
    return (_jsx(FilterLinkContext.Provider, { value: { context: props.context }, children: _jsx(FilterLinkBase, { ...props, components: {
                Select: FilterLinkSelectCom,
            } }) }));
};
export const FilterWithTable = (props) => {
    const { fields, value, context, onChange, referenceSource } = props;
    const CustomValueComponent = (valueProps) => {
        const components = {
            [FieldType.Link]: FilterLink,
        };
        return (_jsx(FieldValue, { ...valueProps, components: components, modal: true, referenceSource: referenceSource }));
    };
    return (_jsx(BaseViewFilter, { modal: true, value: value, fields: fields, onChange: onChange, viewFilterLinkContext: context, customValueComponent: CustomValueComponent }));
};
