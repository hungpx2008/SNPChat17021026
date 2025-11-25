import { jsx as _jsx } from "react/jsx-runtime";
import { RowHeightBase } from './RowHeightBase';
import { useRowHeightNode } from './useRowHeightNode';
export const RowHeight = ({ children, rowHeight, fieldNameDisplayLines, onChange }) => {
    const { text, Icon, isActive } = useRowHeightNode(rowHeight);
    return (_jsx(RowHeightBase, { rowHeight: text, fieldNameDisplayLines: fieldNameDisplayLines ?? 1, onChange: onChange, children: children(text, isActive, Icon) }));
};
