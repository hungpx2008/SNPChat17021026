import { jsx as _jsx } from "react/jsx-runtime";
import { Check, Copy } from '@teable/icons';
import { Button, cn } from '@teable/ui-lib';
import { useState } from 'react';
import { syncCopy } from '../../../utils';
export const CopyButton = (props) => {
    const { text, className, iconClassName, ...rest } = props;
    const [isCopied, setIsCopied] = useState(false);
    const onCopy = () => {
        syncCopy(text);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
    return (_jsx(Button, { ...rest, onClick: onCopy, className: className, children: isCopied ? (_jsx(Check, { className: cn('text-teal-500 animate-in duration-500', iconClassName) })) : (_jsx(Copy, { className: iconClassName })) }));
};
