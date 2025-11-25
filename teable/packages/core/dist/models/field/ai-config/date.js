"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFieldAIConfigSchema = exports.dateFieldCustomizeAIConfigSchema = exports.dateFieldExtractionAIConfigSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
const text_1 = require("./text");
exports.dateFieldExtractionAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Extraction),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.dateFieldCustomizeAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Customization),
    attachmentFieldIds: zod_1.z.array(zod_1.z.string().startsWith(utils_1.IdPrefix.Field)).optional(),
    prompt: zod_1.z.string(),
});
exports.dateFieldAIConfigSchema = zod_1.z.union([
    exports.dateFieldExtractionAIConfigSchema.strict(),
    exports.dateFieldCustomizeAIConfigSchema.strict(),
]);
