import { jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
export const SelectTag = (props) => {
    const { label, color, backgroundColor, className, children } = props;
    return (_jsxs("div", { className: cn('text-[13px] px-2 h-5 rounded-md bg-secondary text-secondary-foreground', className), style: { color, backgroundColor }, title: label, children: [label, children] }));
};
