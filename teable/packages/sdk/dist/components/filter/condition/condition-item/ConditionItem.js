import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trash2 } from '@teable/icons';
import { Button } from '@teable/ui-lib';
import { useCrud } from '../../hooks';
import { FieldSelect } from './base-component/FieldSelect';
import { FieldValue } from './base-component/FieldValue';
import { OperatorSelect } from './base-component/OperatorSelect';
export const ConditionItem = (props) => {
    const { path, value, index } = props;
    const { onDelete } = useCrud();
    return (_jsxs("div", { className: "flex items-center gap-2 self-center", children: [_jsx(FieldSelect, { path: [...path, 'field'], value: value.field, item: value }), _jsx(OperatorSelect, { path: [...path, 'operator'], value: value.operator, item: value }), _jsx(FieldValue, { path: [...path, 'value'], value: value.value, item: value }), _jsx(Button, { size: "xs", variant: "outline", className: "size-8 shrink-0", onClick: () => {
                    onDelete(path, index);
                }, children: _jsx(Trash2, {}) })] }));
};
