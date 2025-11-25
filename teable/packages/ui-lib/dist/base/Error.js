import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../shadcn';
export const Error = (props) => {
    const { error, className } = props;
    return (_jsx("div", { "data-state": error ? 'show' : 'hide', className: cn('data-[state=show]:mt-2 text-sm text-destructive transition-all', className), children: error }));
};
