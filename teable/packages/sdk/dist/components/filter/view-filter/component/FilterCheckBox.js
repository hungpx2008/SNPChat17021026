import { jsx as _jsx } from "react/jsx-runtime";
import { Checkbox, cn } from '@teable/ui-lib';
const FilterCheckbox = (props) => {
    const { value, onChange, className } = props;
    return (_jsx("div", { className: cn('flex h-8 items-center justify-center space-x-2 rounded border shadow-sm border-input', className), children: _jsx(Checkbox, { checked: value, onCheckedChange: (checked) => {
                onChange?.(checked || null);
            } }) }));
};
export { FilterCheckbox };
