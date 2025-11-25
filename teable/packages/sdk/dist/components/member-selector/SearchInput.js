import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from '@teable/icons';
import { Input } from '@teable/ui-lib';
import { useEffect, useState } from 'react';
export const SearchInput = ({ search, onSearch, ...props }) => {
    const [searchInner, setSearchInner] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    useEffect(() => {
        if (!isComposing) {
            onSearch(searchInner);
        }
    }, [searchInner, isComposing, onSearch]);
    return (_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2 top-2.5 size-4 text-muted-foreground" }), _jsx(Input, { ...props, className: "h-8 pl-8 text-[13px]", value: searchInner, onChange: (e) => setSearchInner(e.target.value), onCompositionStart: () => setIsComposing(true), onCompositionEnd: () => setIsComposing(false) })] }));
};
