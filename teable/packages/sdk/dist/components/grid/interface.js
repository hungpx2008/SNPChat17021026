export * from './renderers/cell-renderer/interface';
export var SelectionRegionType;
(function (SelectionRegionType) {
    SelectionRegionType["Rows"] = "Rows";
    SelectionRegionType["Columns"] = "Columns";
    SelectionRegionType["Cells"] = "Cells";
    SelectionRegionType["None"] = "None";
})(SelectionRegionType || (SelectionRegionType = {}));
export var RegionType;
(function (RegionType) {
    RegionType["Cell"] = "Cell";
    RegionType["ActiveCell"] = "ActiveCell";
    RegionType["CellValue"] = "CellValue";
    RegionType["AppendRow"] = "AppendRow";
    RegionType["AppendColumn"] = "AppendColumn";
    RegionType["ColumnHeader"] = "ColumnHeader";
    RegionType["GroupStatistic"] = "GroupStatistic";
    RegionType["ColumnStatistic"] = "ColumnStatistic";
    RegionType["ColumnHeaderMenu"] = "ColumnHeaderMenu";
    RegionType["ColumnPrimaryIcon"] = "ColumnPrimaryIcon";
    RegionType["ColumnDescription"] = "ColumnDescription";
    RegionType["ColumnResizeHandler"] = "ColumnResizeHandler";
    RegionType["ColumnFreezeHandler"] = "ColumnFreezeHandler";
    RegionType["RowHeaderDragHandler"] = "RowHeaderDragHandler";
    RegionType["RowHeaderExpandHandler"] = "RowHeaderExpandHandler";
    RegionType["RowHeaderCheckbox"] = "RowHeaderCheckbox";
    RegionType["RowGroupControl"] = "RowGroupControl";
    RegionType["RowGroupHeader"] = "RowGroupHeader";
    RegionType["RowCountLabel"] = "RowCountLabel";
    RegionType["RowHeader"] = "RowHeader";
    RegionType["AllCheckbox"] = "AllCheckbox";
    RegionType["FillHandler"] = "FillHandler";
    RegionType["Blank"] = "Blank";
    RegionType["None"] = "None";
})(RegionType || (RegionType = {}));
export var DragRegionType;
(function (DragRegionType) {
    DragRegionType["Rows"] = "Rows";
    DragRegionType["Columns"] = "Columns";
    DragRegionType["None"] = "None";
})(DragRegionType || (DragRegionType = {}));
export var MouseButtonType;
(function (MouseButtonType) {
    MouseButtonType[MouseButtonType["Left"] = 0] = "Left";
    MouseButtonType[MouseButtonType["Center"] = 1] = "Center";
    MouseButtonType[MouseButtonType["Right"] = 2] = "Right";
})(MouseButtonType || (MouseButtonType = {}));
export var RowControlType;
(function (RowControlType) {
    RowControlType["Drag"] = "Drag";
    RowControlType["Expand"] = "Expand";
    RowControlType["Checkbox"] = "Checkbox";
})(RowControlType || (RowControlType = {}));
export var DraggableType;
(function (DraggableType) {
    DraggableType["All"] = "all";
    DraggableType["None"] = "none";
    DraggableType["Column"] = "column";
    DraggableType["Row"] = "row";
})(DraggableType || (DraggableType = {}));
export var GridCustomIcon;
(function (GridCustomIcon) {
    GridCustomIcon["Description"] = "description";
})(GridCustomIcon || (GridCustomIcon = {}));
export var SelectableType;
(function (SelectableType) {
    SelectableType["All"] = "all";
    SelectableType["None"] = "none";
    SelectableType["Column"] = "column";
    SelectableType["Row"] = "row";
    SelectableType["Cell"] = "cell";
})(SelectableType || (SelectableType = {}));
export var LinearRowType;
(function (LinearRowType) {
    LinearRowType[LinearRowType["Group"] = 0] = "Group";
    LinearRowType[LinearRowType["Row"] = 1] = "Row";
    LinearRowType[LinearRowType["Append"] = 2] = "Append";
})(LinearRowType || (LinearRowType = {}));
