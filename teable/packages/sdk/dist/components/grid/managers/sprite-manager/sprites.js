import { jsx as _jsx } from "react/jsx-runtime";
import { AlertCircle, DraggableHandle, Maximize2, Plus, X, ChevronDown, ChevronRight, Lock, EyeOff, } from '@teable/icons';
import { renderToString } from 'react-dom/server';
const drag = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(DraggableHandle, { style: { color: fgColor } }));
};
const detail = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(Maximize2, { style: { color: fgColor } }));
};
const add = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(Plus, { style: { color: fgColor } }));
};
const description = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(AlertCircle, { style: { color: fgColor } }));
};
const close = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(X, { style: { color: fgColor } }));
};
const expand = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(ChevronDown, { style: { color: fgColor } }));
};
const collapse = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(ChevronRight, { style: { color: fgColor } }));
};
const lock = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(Lock, { style: { color: fgColor } }));
};
export const eyeOff = (props) => {
    const { fgColor } = props;
    return renderToString(_jsx(EyeOff, { style: { color: fgColor } }));
};
export const sprites = {
    add,
    drag,
    detail,
    description,
    close,
    expand,
    collapse,
    lock,
    eyeOff,
};
export var GridInnerIcon;
(function (GridInnerIcon) {
    GridInnerIcon["Add"] = "add";
    GridInnerIcon["Drag"] = "drag";
    GridInnerIcon["Detail"] = "detail";
    GridInnerIcon["Description"] = "description";
    GridInnerIcon["Close"] = "close";
    GridInnerIcon["Expand"] = "expand";
    GridInnerIcon["Collapse"] = "collapse";
    GridInnerIcon["Lock"] = "lock";
    GridInnerIcon["EyeOff"] = "eyeOff";
})(GridInnerIcon || (GridInnerIcon = {}));
