import { ItemType } from './interface';
export class CoordinateManager {
    defaultRowHeight;
    defaultColumnWidth;
    pureRowCount;
    rowCount;
    columnCount;
    _containerWidth;
    _containerHeight;
    rowHeightMap = {};
    columnWidthMap = {};
    rowInitSize;
    columnInitSize;
    lastRowIndex = -1;
    lastColumnIndex = -1;
    rowMetaDataMap = {};
    columnMetaDataMap = {};
    _freezeColumnCount;
    constructor({ rowHeight, columnWidth, rowCount, pureRowCount, columnCount, containerWidth, containerHeight, rowInitSize = 0, columnInitSize = 0, rowHeightMap = {}, columnWidthMap = {}, freezeColumnCount = 1, }) {
        this.defaultRowHeight = rowHeight;
        this.defaultColumnWidth = columnWidth;
        this.rowCount = rowCount;
        this.pureRowCount = pureRowCount;
        this.columnCount = columnCount;
        this.rowInitSize = rowInitSize;
        this.columnInitSize = columnInitSize;
        this._containerWidth = containerWidth;
        this._containerHeight = containerHeight;
        this.rowHeightMap = rowHeightMap;
        this.columnWidthMap = columnWidthMap;
        this._freezeColumnCount = freezeColumnCount;
    }
    get freezeRegionWidth() {
        return this.getColumnOffset(this._freezeColumnCount);
    }
    get freezeColumnCount() {
        return this._freezeColumnCount;
    }
    set freezeColumnCount(count) {
        this._freezeColumnCount = count;
    }
    get containerWidth() {
        return this._containerWidth;
    }
    set containerWidth(width) {
        this._containerWidth = width;
    }
    get containerHeight() {
        return this._containerHeight;
    }
    set containerHeight(height) {
        this._containerHeight = height;
    }
    get columnWidth() {
        return this.defaultColumnWidth;
    }
    set columnWidth(width) {
        this.defaultColumnWidth = width;
    }
    get rowHeight() {
        return this.defaultRowHeight;
    }
    set rowHeight(height) {
        this.defaultRowHeight = height;
    }
    get totalWidth() {
        const { offset, size } = this.getCellMetaData(this.columnCount - 1, ItemType.Column);
        return offset + size;
    }
    get totalHeight() {
        const { offset, size } = this.getCellMetaData(this.rowCount - 1, ItemType.Row);
        return offset + size;
    }
    getRowHeight(index) {
        return this.rowHeightMap[index] ?? this.defaultRowHeight;
    }
    getColumnWidth(index) {
        return this.columnWidthMap[index] ?? this.defaultColumnWidth;
    }
    /* eslint-disable sonarjs/cognitive-complexity */
    getCellMetaData(index, itemType) {
        let cellMetadataMap, itemSize, lastMeasuredIndex, offset;
        const isColumnType = itemType === ItemType.Column;
        if (isColumnType) {
            itemSize = this.columnWidth;
            offset = this.columnInitSize;
            lastMeasuredIndex = this.lastColumnIndex;
            cellMetadataMap = this.columnMetaDataMap;
        }
        else {
            itemSize = this.rowHeight;
            offset = this.rowInitSize;
            lastMeasuredIndex = this.lastRowIndex;
            cellMetadataMap = this.rowMetaDataMap;
        }
        if (index > lastMeasuredIndex) {
            const itemMetadata = cellMetadataMap?.[lastMeasuredIndex];
            if (lastMeasuredIndex >= 0 && itemMetadata) {
                offset = itemMetadata.offset + itemMetadata.size;
            }
            for (let i = lastMeasuredIndex + 1; i <= index; i++) {
                const size = (isColumnType ? this.columnWidthMap[i] : this.rowHeightMap[i]) ?? itemSize;
                cellMetadataMap[i] = {
                    offset,
                    size,
                };
                offset += size;
            }
            if (isColumnType) {
                this.lastColumnIndex = index;
            }
            else {
                this.lastRowIndex = index;
            }
        }
        return cellMetadataMap[index] || { size: 0, offset: 0 };
    }
    findNearestCellIndexLinear(index, offset, itemType) {
        const itemCount = itemType === ItemType.Column ? this.columnCount : this.rowCount;
        let interval = 1;
        while (index < itemCount && this.getCellMetaData(index, itemType).offset < offset) {
            index += interval;
            interval *= 2;
        }
        return this.findNearestCellIndexBinary(offset, Math.floor(index / 2), Math.min(index, itemCount - 1), itemType);
    }
    findNearestCellIndexBinary(offset, low, high, itemType) {
        while (low <= high) {
            const middle = low + Math.floor((high - low) / 2);
            const currentOffset = this.getCellMetaData(middle, itemType).offset;
            if (currentOffset === offset) {
                return middle;
            }
            else if (currentOffset < offset) {
                low = middle + 1;
            }
            else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        return low > 0 ? low - 1 : 0;
    }
    findNearestCellIndex(offset, itemType) {
        let itemMetadataMap, lastIndex;
        if (itemType === ItemType.Column) {
            itemMetadataMap = this.columnMetaDataMap;
            lastIndex = this.lastColumnIndex;
        }
        else {
            itemMetadataMap = this.rowMetaDataMap;
            lastIndex = this.lastRowIndex;
        }
        if (lastIndex > 0 && itemMetadataMap[lastIndex] == null) {
            console.warn('lastIndex is not found in itemMetadataMap', lastIndex, itemMetadataMap);
        }
        const lastMeasuredItemOffset = lastIndex > 0 ? itemMetadataMap[lastIndex]?.offset ?? 0 : 0;
        if (lastMeasuredItemOffset >= offset) {
            return this.findNearestCellIndexBinary(offset, 0, lastIndex, itemType);
        }
        return this.findNearestCellIndexLinear(Math.max(0, lastIndex), offset, itemType);
    }
    getRowStartIndex(scrollTop) {
        return this.findNearestCellIndex(scrollTop, ItemType.Row);
    }
    getRowStopIndex(startIndex, scrollTop) {
        const itemMetadata = this.getCellMetaData(startIndex, ItemType.Row);
        const maxOffset = scrollTop + this._containerHeight;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;
        while (stopIndex < this.rowCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, ItemType.Row).size;
        }
        return stopIndex;
    }
    getColumnStartIndex(scrollLeft) {
        return this.findNearestCellIndex(scrollLeft, ItemType.Column);
    }
    getColumnStopIndex(startIndex, scrollLeft) {
        const itemMetadata = this.getCellMetaData(startIndex, ItemType.Column);
        const maxOffset = scrollLeft + this._containerWidth;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;
        while (stopIndex < this.columnCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += this.getCellMetaData(stopIndex, ItemType.Column).size;
        }
        return stopIndex;
    }
    getRowOffset(rowIndex) {
        return this.getCellMetaData(rowIndex, ItemType.Row).offset;
    }
    getColumnOffset(columnIndex) {
        return this.getCellMetaData(columnIndex, ItemType.Column).offset;
    }
    getColumnRelativeOffset(columnIndex, scrollLeft) {
        const x = this.getColumnOffset(columnIndex);
        return columnIndex < this._freezeColumnCount ? x : x - scrollLeft;
    }
    refreshColumnDimensions({ columnCount, columnInitSize = 0, columnWidthMap = {}, }) {
        this.columnCount = columnCount;
        this.columnInitSize = columnInitSize;
        this.columnWidthMap = columnWidthMap;
        this.lastColumnIndex = -1;
    }
}
