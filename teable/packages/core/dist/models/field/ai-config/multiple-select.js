"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleSelectFieldAIConfigSchema = exports.multipleSelectFieldCustomizeAIConfigSchema = exports.multipleSelectFieldTagAIConfigSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
const text_1 = require("./text");
exports.multipleSelectFieldTagAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Tag),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.multipleSelectFieldCustomizeAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Customization),
    prompt: zod_1.z.string(),
    attachmentFieldIds: zod_1.z.array(zod_1.z.string().startsWith(utils_1.IdPrefix.Field)).optional(),
    onlyAllowConfiguredOptions: zod_1.z.boolean().optional(),
});
exports.multipleSelectFieldAIConfigSchema = zod_1.z.union([
    exports.multipleSelectFieldTagAIConfigSchema.strict(),
    exports.multipleSelectFieldCustomizeAIConfigSchema.strict(),
]);
