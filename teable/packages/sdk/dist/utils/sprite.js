import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/naming-convention */
import { renderToString } from 'react-dom/server';
export const getSpriteMap = (iconItems) => {
    const map = {};
    iconItems.forEach(({ type, IconComponent }) => {
        map[type] = (props) => {
            const { bgColor, fgColor } = props;
            return renderToString(_jsx(IconComponent, { style: { color: fgColor, fill: bgColor } }));
        };
    });
    return map;
};
