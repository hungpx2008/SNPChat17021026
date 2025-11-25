export var CellType;
(function (CellType) {
    CellType["Text"] = "Text";
    CellType["Link"] = "Link";
    CellType["Number"] = "Number";
    CellType["Select"] = "Select";
    CellType["Image"] = "Image";
    CellType["Chart"] = "Chart";
    CellType["Rating"] = "Rating";
    CellType["User"] = "User";
    CellType["Boolean"] = "Boolean";
    CellType["Loading"] = "Loading";
    CellType["Button"] = "Button";
})(CellType || (CellType = {}));
export var EditorType;
(function (EditorType) {
    EditorType["Text"] = "Text";
    EditorType["Number"] = "Number";
    EditorType["Select"] = "Select";
    EditorType["Custom"] = "Custom";
})(EditorType || (EditorType = {}));
export var NumberDisplayType;
(function (NumberDisplayType) {
    NumberDisplayType["Ring"] = "ring";
    NumberDisplayType["Bar"] = "bar";
})(NumberDisplayType || (NumberDisplayType = {}));
export var ChartType;
(function (ChartType) {
    ChartType["Bar"] = "bar";
    ChartType["Line"] = "line";
})(ChartType || (ChartType = {}));
export var CellRegionType;
(function (CellRegionType) {
    CellRegionType["Blank"] = "blank";
    CellRegionType["Update"] = "update";
    CellRegionType["Preview"] = "preview";
    CellRegionType["ToggleEditing"] = "toggleEditing";
    CellRegionType["Hover"] = "hover";
})(CellRegionType || (CellRegionType = {}));
