import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { useFields } from '../../hooks';
import { FieldSelector } from '../field/FieldSelector';
import { OrderSelect } from './OrderSelect';
var ISortKey;
(function (ISortKey) {
    ISortKey["FieldId"] = "fieldId";
    ISortKey["Ascending"] = "order";
})(ISortKey || (ISortKey = {}));
function SortItem(props) {
    const { index, value, onSelect, selectedFields, ...restProps } = props;
    const { fieldId, order } = value;
    const selectHandler = (_key, _value) => {
        onSelect?.(index, { ...value, [_key]: _value });
    };
    const defaultFields = useFields({ withHidden: true, withDenied: true });
    const fields = defaultFields.filter((f) => f.type !== FieldType.Button);
    return (_jsxs("div", { className: "flex", children: [_jsx(FieldSelector, { value: fieldId, onSelect: (value) => selectHandler(ISortKey.FieldId, value), fields: fields, excludedIds: selectedFields, className: "w-40", ...restProps }), _jsx(OrderSelect, { value: order, onSelect: (value) => selectHandler(ISortKey.Ascending, value), fieldId: fieldId })] }));
}
export { SortItem };
