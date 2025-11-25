import { jsx as _jsx } from "react/jsx-runtime";
import { ColorUtils, RatingIcon } from '@teable/core';
import { Star, Moon, Sun, Zap, Flame, Heart, Apple, ThumbsUp } from '@teable/icons';
import { cn } from '@teable/ui-lib';
export const RATING_ICON_MAP = {
    [RatingIcon.Star]: Star,
    [RatingIcon.Moon]: Moon,
    [RatingIcon.Sun]: Sun,
    [RatingIcon.Zap]: Zap,
    [RatingIcon.Flame]: Flame,
    [RatingIcon.Heart]: Heart,
    [RatingIcon.Apple]: Apple,
    [RatingIcon.ThumbUp]: ThumbsUp,
};
export const CellRating = (props) => {
    const { value, options, className, style, itemClassName } = props;
    const { icon, color: colorKey, max } = options;
    const Icon = RATING_ICON_MAP[icon];
    const color = ColorUtils.getHexForColor(colorKey);
    return (_jsx("div", { className: cn('flex', className), style: style, children: Array.from({ length: max }).map((_, index) => {
            let iconStyle = {};
            if (value != null && index < value) {
                iconStyle = { fill: color, color };
            }
            return (_jsx(Icon, { className: cn('size-4 mr-1 rounded cursor-pointer text-slate-200 fill-slate-200 dark:text-gray-700 dark:fill-gray-700', value != null && index < value && 'fill', itemClassName), style: iconStyle }, index));
        }) }));
};
