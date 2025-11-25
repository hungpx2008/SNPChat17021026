import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Label, Spin, Switch } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
export const SortConfig = (props) => {
    const { value, buttonLoading, onClick, onChange } = props;
    const { t } = useTranslation();
    return (_jsxs("footer", { className: "flex h-11 items-center justify-between bg-muted/20 px-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "airplane-mode", className: "scale-75", onCheckedChange: (checked) => onChange?.(!checked), checked: !value }), _jsx(Label, { htmlFor: "airplane-mode", className: "cursor-pointer text-sm", children: t('sort.autoSort') })] }), value && (_jsx("div", { className: "flex items-center justify-between", children: _jsxs(Button, { size: "xs", disabled: buttonLoading, className: "ml-2 text-sm", onClick: onClick, children: [buttonLoading ? _jsx(Spin, { className: "mr-1 size-4" }) : null, t('sort.label')] }) }))] }));
};
