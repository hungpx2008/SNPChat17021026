import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isConditionGroup } from '../types';
import { ConditionItem, ConditionGroup } from './condition-item';
import { Conjunction } from './Conjunction';
export const Condition = (props) => {
    const { index, path, value, depth, conjunction } = props;
    return (_jsxs("div", { className: "my-1 flex w-full items-start gap-2", children: [_jsx(Conjunction, { index: index, path: [...path, 'conjunction'], value: conjunction }), isConditionGroup(value) ? (_jsx(ConditionGroup, { path: [...path], index: index, depth: depth + 1, children: value.children.map((item, index) => {
                    return (_jsx(Condition, { index: index, value: item, path: [...path, 'children', index], depth: depth + 1, conjunction: value.conjunction }, index));
                }) })) : (_jsx(ConditionItem, { value: value, depth: depth + 1, index: index, path: [...path] }))] }));
};
