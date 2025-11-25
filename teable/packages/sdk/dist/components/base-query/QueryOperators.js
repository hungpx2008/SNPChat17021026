import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@teable/ui-lib';
import { useContext, useMemo } from 'react';
import { QueryEditorContext } from './context/QueryEditorContext';
import { useQueryOperatorsStatic } from './useQueryOperatorsStatic';
export const QueryOperators = () => {
    const { status, setStatus } = useContext(QueryEditorContext);
    const queryButtons = useQueryOperatorsStatic();
    const onButtonClick = (button) => {
        setStatus(button, !status[button]);
    };
    const isSelectedAll = useMemo(() => {
        return queryButtons.every((button) => status[button.key]);
    }, [queryButtons, status]);
    if (isSelectedAll) {
        return;
    }
    return (_jsx("div", { className: "flex flex-wrap gap-4 gap-y-2 px-4", children: queryButtons.map((button) => !status[button.key] && (_jsx(Button, { className: "text-[13px]", size: "xs", variant: "outline", onClick: () => onButtonClick(button.key), children: button.label }, button.key))) }));
};
