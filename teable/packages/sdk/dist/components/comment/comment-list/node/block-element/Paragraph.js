import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
export const BlockParagraphElement = (props) => {
    const { children, className } = props;
    return (_jsx("div", { className: cn('text-wrap w-auto flex', className), children: _jsx("span", { className: "gap-1 text-wrap text-left", children: children }) }));
};
