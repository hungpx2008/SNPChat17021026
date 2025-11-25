import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, ChevronDown } from '@teable/icons';
import { useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, Button, cn, CommandInput, Command, CommandEmpty, CommandItem, CommandList, } from '../../shadcn';
export const Selector = ({ onChange, readonly, selectedId = '', placeholder, searchTip = 'Search...', emptyTip = 'No found.', defaultName = 'Untitled', className, contentClassName, candidates = [], }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const candidatesMap = useMemo(() => candidates.reduce((pre, cur) => {
        pre[cur.id] = cur;
        return pre;
    }, {}), [candidates]);
    const selected = candidatesMap[selectedId];
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: true, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { ref: ref, disabled: readonly || !candidates.length, variant: "outline", role: "combobox", "aria-expanded": open, className: cn('flex gap-2 font-normal px-3', className), children: [selected ? (_jsxs(_Fragment, { children: [selected.icon, _jsx("span", { className: "text-ellipsis whitespace-nowrap overflow-hidden", children: selected.name })] })) : (_jsx("span", { className: "shrink-0", children: placeholder })), _jsx("div", { className: "grow" }), _jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground" })] }) }), _jsx(PopoverContent, { className: cn('w-full max-w-[200px] p-0', contentClassName), style: { minWidth: ref.current?.offsetWidth }, children: _jsxs(Command, { filter: (value, search) => {
                        if (!search)
                            return 1;
                        const item = candidatesMap[value];
                        const text = item?.name || item?.id;
                        if (text?.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                            return 1;
                        return 0;
                    }, children: [_jsx(CommandInput, { placeholder: searchTip }), _jsx(CommandEmpty, { children: emptyTip }), _jsx(CommandList, { children: candidates.map(({ id, name, icon }) => (_jsxs(CommandItem, { value: id, onSelect: () => {
                                    onChange?.(id);
                                    setOpen(false);
                                }, children: [_jsx(Check, { className: cn('mr-2 h-4 w-4 flex-shrink-0', id === selectedId ? 'opacity-100' : 'opacity-0') }), icon, ' ', _jsx("span", { className: cn('ml-2 truncate', name ? '' : 'text-primary/60'), children: name ? name : defaultName })] }, id))) })] }) })] }));
};
