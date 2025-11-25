import { jsx as _jsx } from "react/jsx-runtime";
import { Emojis } from '@teable/openapi';
import { Button } from '@teable/ui-lib';
export const ReactionPicker = (props) => {
    const { onReactionClick } = props;
    return (_jsx("div", { className: "m-1 flex size-full items-center gap-1 bg-card", children: Emojis.map((emoji) => {
            return (_jsx(Button, { variant: 'ghost', className: "h-auto w-5 select-none p-1 hover:scale-125", onClick: () => onReactionClick(emoji.value), children: emoji.value }, emoji.key));
        }) }));
};
