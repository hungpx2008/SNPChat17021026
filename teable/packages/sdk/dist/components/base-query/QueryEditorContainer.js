import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useMemo } from 'react';
import { QuerySortedKeysMap } from './constant';
import { QueryEditorContext } from './context/QueryEditorContext';
import { FormItem } from './FormItem';
import { QueryEditor } from './QueryEditor';
import { useQueryOperatorsStatic } from './useQueryOperatorsStatic';
export const QueryEditorContainer = ({ query, onChange, }) => {
    const { status } = useContext(QueryEditorContext);
    const queryOperatorsStatic = useQueryOperatorsStatic();
    const queryOperatorsStaticMap = useMemo(() => queryOperatorsStatic.reduce((acc, cur) => {
        acc[cur.key] = cur.label;
        return acc;
    }, {}), [queryOperatorsStatic]);
    return (_jsx("div", { className: "mt-4 flex flex-col gap-4", children: Object.keys(status)
            .sort((a, b) => QuerySortedKeysMap[a] - QuerySortedKeysMap[b])
            .map((key) => {
            if (status[key]) {
                return (_jsx(FormItem, { label: queryOperatorsStaticMap[key], children: _jsx(QueryEditor, { query: query, onChange: onChange, type: key }) }, key));
            }
            return null;
        }) }));
};
