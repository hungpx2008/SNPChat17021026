import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from '@teable/ui-lib';
export const FormItem = (props) => {
    const { label, children } = props;
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-2 pl-4 sm:flex-row sm:gap-5 sm:pl-0", children: [_jsx(Label, { className: "shrink-0 leading-7 sm:w-24 sm:text-right", children: label }), children] }));
};
