import { GRID_DEFAULT } from '../../configs';
import { drawRect } from '../base-renderer';
import { CellType } from './interface';
const { cellHorizontalPadding, cellVerticalPaddingXS } = GRID_DEFAULT;
export const loadingCellRenderer = {
    type: CellType.Loading,
    draw: (cell, props) => {
        const { ctx, theme, rect } = props;
        const { x, y, width, height } = rect;
        const { cellBgLoading } = theme;
        drawRect(ctx, {
            x: x + cellHorizontalPadding,
            y: y + cellVerticalPaddingXS,
            width: width - 2 * cellHorizontalPadding,
            height: height - 2 * cellVerticalPaddingXS,
            radius: 4,
            fill: cellBgLoading,
        });
    },
};
