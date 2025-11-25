"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inplaceImportOptionRoSchema = exports.importOptionRoSchema = exports.importOptionSchema = exports.importSheetItem = exports.importColumnSchema = exports.analyzeVoSchema = exports.analyzeColumnSchema = exports.analyzeRoSchema = exports.SUPPORTEDTYPE = void 0;
const core_1 = require("@teable/core");
const zod_1 = __importDefault(require("zod"));
var SUPPORTEDTYPE;
(function (SUPPORTEDTYPE) {
    SUPPORTEDTYPE["CSV"] = "csv";
    SUPPORTEDTYPE["EXCEL"] = "excel";
})(SUPPORTEDTYPE || (exports.SUPPORTEDTYPE = SUPPORTEDTYPE = {}));
exports.analyzeRoSchema = zod_1.default.object({
    attachmentUrl: zod_1.default.string(),
    fileType: zod_1.default.nativeEnum(SUPPORTEDTYPE),
});
exports.analyzeColumnSchema = zod_1.default.object({
    type: zod_1.default.nativeEnum(core_1.FieldType),
    name: zod_1.default.string(),
});
exports.analyzeVoSchema = zod_1.default.object({
    worksheets: zod_1.default.record(zod_1.default.string(), zod_1.default.object({
        name: zod_1.default.string(),
        columns: exports.analyzeColumnSchema.array(),
    })),
});
exports.importColumnSchema = exports.analyzeColumnSchema.extend({
    sourceColumnIndex: zod_1.default.number(),
});
exports.importSheetItem = zod_1.default.object({
    name: zod_1.default.string(),
    columns: exports.importColumnSchema.array(),
    useFirstRowAsHeader: zod_1.default.boolean(),
    importData: zod_1.default.boolean(),
});
exports.importOptionSchema = exports.importSheetItem.pick({
    useFirstRowAsHeader: true,
    importData: true,
});
exports.importOptionRoSchema = zod_1.default.object({
    worksheets: zod_1.default.record(zod_1.default.string(), exports.importSheetItem),
    attachmentUrl: zod_1.default.string(),
    fileType: zod_1.default.nativeEnum(SUPPORTEDTYPE),
    notification: zod_1.default.boolean().optional(),
    tz: core_1.timeZoneStringSchema,
});
exports.inplaceImportOptionRoSchema = zod_1.default.object({
    attachmentUrl: zod_1.default.string(),
    fileType: zod_1.default.nativeEnum(SUPPORTEDTYPE),
    insertConfig: zod_1.default.object({
        sourceWorkSheetKey: zod_1.default.string(),
        excludeFirstRow: zod_1.default.boolean(),
        sourceColumnMap: zod_1.default.record(zod_1.default.number().nullable()),
    }),
    notification: zod_1.default.boolean().optional(),
});
