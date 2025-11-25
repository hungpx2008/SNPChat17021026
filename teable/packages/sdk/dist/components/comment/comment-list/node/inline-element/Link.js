import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
export const InlineLinkElement = (props) => {
    const { href, title, className } = props;
    return (_jsx("a", { href: href, target: "_blank", rel: "noreferrer", className: cn('cursor-pointer text-wrap break-all text-blue-500 underline', className), children: title }));
};
