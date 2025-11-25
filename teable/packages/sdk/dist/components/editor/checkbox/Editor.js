import { jsx as _jsx } from "react/jsx-runtime";
import { Checkbox, cn } from '@teable/ui-lib';
export const CheckboxEditor = (props) => {
    const { value, onChange, className, style, readonly } = props;
    return (_jsx(Checkbox, { style: style, className: cn('w-6 h-6', className), checked: Boolean(value), onCheckedChange: (checked) => {
            onChange?.(checked ? true : null);
        }, disabled: readonly }));
};
