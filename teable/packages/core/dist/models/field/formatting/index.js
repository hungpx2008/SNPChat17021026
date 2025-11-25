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
exports.getFormattingSchema = exports.getDefaultFormatting = exports.unionFormattingSchema = void 0;
const zod_1 = require("../../../zod");
const constant_1 = require("../constant");
const datetime_1 = require("./datetime");
const number_1 = require("./number");
__exportStar(require("./number"), exports);
__exportStar(require("./datetime"), exports);
__exportStar(require("./time-zone"), exports);
exports.unionFormattingSchema = zod_1.z
    .union([datetime_1.datetimeFormattingSchema, number_1.numberFormattingSchema])
    .openapi({
    description: 'Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided',
});
const getDefaultFormatting = (cellValueType) => {
    switch (cellValueType) {
        case constant_1.CellValueType.Number:
            return number_1.defaultNumberFormatting;
        case constant_1.CellValueType.DateTime:
            return datetime_1.defaultDatetimeFormatting;
    }
};
exports.getDefaultFormatting = getDefaultFormatting;
const getFormattingSchema = (cellValueType) => {
    switch (cellValueType) {
        case constant_1.CellValueType.Number:
            return number_1.numberFormattingSchema;
        case constant_1.CellValueType.DateTime:
            return datetime_1.datetimeFormattingSchema;
        default:
            return zod_1.z.undefined().openapi({
                description: 'Only number and datetime cell value type support formatting',
            });
    }
};
exports.getFormattingSchema = getFormattingSchema;
