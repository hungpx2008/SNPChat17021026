import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { Input, Label, Switch } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
export const FieldCreator = (props) => {
    const { field, setField } = props;
    const { name, type, options } = field;
    const { t } = useTranslation();
    const onNameChange = (e) => {
        const value = e.target.value;
        setField({ ...field, name: value });
    };
    const onOptionChange = (checked, key) => {
        setField({
            ...field,
            options: { ...(options ?? {}), [key]: checked },
        });
    };
    const getContent = () => {
        switch (type) {
            case FieldType.SingleSelect: {
                return _jsx(Input, { value: name, onChange: onNameChange, autoFocus: true });
            }
            case FieldType.User: {
                return (_jsxs("div", { className: "space-y-3", children: [_jsx(Input, { value: name, onChange: onNameChange, autoFocus: true }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "user-field-options-should-notify", checked: Boolean(options?.shouldNotify), onCheckedChange: (checked) => onOptionChange(checked, 'shouldNotify') }), _jsx(Label, { htmlFor: "user-field-options-should-notify", className: "font-normal", children: t('editor.user.notify') })] })] }));
            }
            default:
                return _jsx(Input, { value: name, onChange: onNameChange, autoFocus: true });
        }
    };
    return _jsx("div", { className: "py-2", children: getContent() });
};
