import { jsx as _jsx } from "react/jsx-runtime";
import { useCrud } from '../../../filter/hooks';
import { ContextColumnSelector } from '../../common/ContextColumnSelector';
export const FieldComponent = (props) => {
    const { path, value, item } = props;
    const { onChange } = useCrud();
    return (_jsx("div", { children: _jsx(ContextColumnSelector, { value: value, onChange: (value, type) => {
                const parentPath = path.slice(0, -1);
                onChange(parentPath, {
                    ...item,
                    field: value,
                    type,
                });
            } }) }));
};
