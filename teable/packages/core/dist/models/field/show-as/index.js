"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionShowAsSchema = exports.getShowAsSchema = void 0;
const zod_1 = require("../../../zod");
const constant_1 = require("../constant");
const number_1 = require("./number");
const text_1 = require("./text");
__exportStar(require("./number"), exports);
__exportStar(require("./text"), exports);
const getShowAsSchema = (cellValueType, isMultipleCellValue) => {
    if (cellValueType === constant_1.CellValueType.Number) {
        return isMultipleCellValue
            ? number_1.multiNumberShowAsSchema.optional()
            : number_1.singleNumberShowAsSchema.optional();
    }
    if (cellValueType === constant_1.CellValueType.String) {
        return text_1.singleLineTextShowAsSchema.optional();
    }
    return zod_1.z.undefined().openapi({
        description: 'Only string or number cell value type support show as',
    });
};
exports.getShowAsSchema = getShowAsSchema;
exports.unionShowAsSchema = zod_1.z
    .union([text_1.singleLineTextShowAsSchema.strict(), number_1.numberShowAsSchema])
    .openapi({
    description: 'According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as"',
});
