import { GRID_DEFAULT } from '../../configs';
import { measuredCanvas } from '../../utils';
import { drawLine, drawMultiLineText } from '../base-renderer';
import { CellRegionType, CellType } from './interface';
const { cellHorizontalPadding, cellVerticalPaddingMD, cellTextLineHeight, maxRowCount } = GRID_DEFAULT;
const computeTextPositions = ({ ctx, data, rect, theme, isActive, }) => {
    const positions = [];
    const { x, y, width, height } = rect;
    const { fontSizeSM } = theme;
    const drawWidth = width - 2 * cellHorizontalPadding;
    const drawHeight = height - cellVerticalPaddingMD;
    const maxLines = isActive ? Infinity : Math.max(1, Math.floor(drawHeight / cellTextLineHeight));
    let row = 1;
    let index = 0;
    let drawX = x + cellHorizontalPadding;
    let drawY = y + cellVerticalPaddingMD;
    for (const text of data) {
        const textLines = drawMultiLineText(ctx, {
            text,
            maxLines,
            maxWidth: drawWidth,
            needRender: false,
            fontSize: fontSizeSM,
        });
        for (const { text: lineText, width: textWidth } of textLines) {
            if (row > maxLines)
                break;
            positions.push({
                x: drawX,
                y: drawY,
                text: lineText,
                width: textWidth,
                link: text,
                key: String(index),
            });
            row++;
            drawY += cellTextLineHeight;
            drawX = x + cellHorizontalPadding;
        }
        index++;
    }
    return positions;
};
export const linkCellRenderer = {
    type: CellType.Link,
    needsHover: true,
    needsHoverPosition: true,
    measure: (cell, props) => {
        const { data } = cell;
        const { ctx, theme, width, height } = props;
        if (!data.length) {
            return { width, height, totalHeight: height };
        }
        const textPositions = computeTextPositions({
            ctx,
            data,
            rect: { x: 0, y: 0, width, height },
            theme,
            isActive: true,
        });
        const positionLength = textPositions.length;
        if (!positionLength)
            return { width, height, totalHeight: height };
        const totalHeight = textPositions[positionLength - 1].y + cellTextLineHeight;
        const maxHeight = cellVerticalPaddingMD + maxRowCount * cellTextLineHeight;
        const finalHeight = Math.max(Math.min(totalHeight, maxHeight), height);
        return {
            width,
            height: finalHeight,
            totalHeight,
        };
    },
    draw: (cell, props) => {
        const { ctx, rect, theme, hoverCellPosition, isActive } = props;
        const { data } = cell;
        const { x: originX, y: originY, width: originWidth, height: originHeight } = rect;
        const [hoverX, hoverY] = hoverCellPosition || [-1, -1];
        const { fontSizeSM, cellTextColorHighlight } = theme;
        ctx.save();
        ctx.beginPath();
        if (data.length && !isActive) {
            ctx.rect(originX, originY, originWidth, originHeight);
            ctx.clip();
        }
        const textPositions = computeTextPositions({
            ctx,
            data,
            rect,
            theme,
            isActive,
        });
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = cellTextColorHighlight;
        let hoveredLink = '';
        let hoveredKey = '';
        const offsetY = fontSizeSM / 2;
        textPositions.forEach((position) => {
            const { x, y, width, text, link, key } = position;
            const isHovered = hoverX >= cellHorizontalPadding &&
                hoverX <= cellHorizontalPadding + width &&
                hoverY >= y - originY &&
                hoverY <= y - originY + cellTextLineHeight;
            if (isHovered) {
                hoveredLink = link;
                hoveredKey = key;
            }
            ctx.fillText(text, x, y + offsetY);
        });
        if (hoveredLink) {
            textPositions.forEach((position) => {
                const { x, y, width, key } = position;
                if (key === hoveredKey) {
                    drawLine(ctx, {
                        x,
                        y,
                        points: [0, fontSizeSM - 1, width, fontSizeSM - 1],
                        stroke: cellTextColorHighlight,
                    });
                }
            });
        }
        ctx.restore();
    },
    checkRegion: (cell, props, _shouldCalculate) => {
        const { hoverCellPosition, width, height, isActive, theme, activeCellBound } = props;
        const [hoverX, originHoverY] = hoverCellPosition;
        const { fontSizeSM } = theme;
        const { data } = cell;
        if (measuredCanvas == null)
            return { type: CellRegionType.Blank };
        const { ctx, setFontSize } = measuredCanvas;
        if (!ctx)
            return { type: CellRegionType.Blank };
        const scrollTop = activeCellBound?.scrollTop ?? 0;
        const hoverY = originHoverY + scrollTop;
        setFontSize(fontSizeSM);
        const textPositions = computeTextPositions({
            ctx,
            data,
            rect: { x: 0, y: 0, width, height },
            theme,
            isActive,
        });
        for (const position of textPositions) {
            const { x, y, width, link } = position;
            if (hoverX >= x && hoverX <= x + width && hoverY >= y && hoverY <= y + cellTextLineHeight) {
                return { type: CellRegionType.Preview, data: link };
            }
        }
        return { type: CellRegionType.Blank };
    },
    onClick: (cell, props, _callback) => {
        const cellRegion = linkCellRenderer.checkRegion?.(cell, props, true);
        if (!cellRegion || cellRegion.type === CellRegionType.Blank)
            return;
        if (cellRegion.type === CellRegionType.Preview) {
            cell.onClick?.(cellRegion.data);
        }
    },
};
