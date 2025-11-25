"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textFieldAIConfigSchema = exports.textFieldCustomizeAIConfigSchema = exports.textFieldImproveTextAIConfigSchema = exports.textFieldTranslateAIConfigSchema = exports.textFieldSummarizeAIConfigSchema = exports.textFieldExtractInfoAIConfigSchema = exports.commonFieldAIConfig = exports.FieldAIActionType = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
var FieldAIActionType;
(function (FieldAIActionType) {
    FieldAIActionType["Summary"] = "summary";
    FieldAIActionType["Translation"] = "translation";
    FieldAIActionType["Improvement"] = "improvement";
    FieldAIActionType["Extraction"] = "extraction";
    FieldAIActionType["Classification"] = "classification";
    FieldAIActionType["Tag"] = "tag";
    FieldAIActionType["Customization"] = "customization";
    FieldAIActionType["ImageGeneration"] = "imageGeneration";
    FieldAIActionType["Rating"] = "rating";
})(FieldAIActionType || (exports.FieldAIActionType = FieldAIActionType = {}));
exports.commonFieldAIConfig = zod_1.z.object({
    modelKey: zod_1.z.string(),
    isAutoFill: zod_1.z.boolean().nullable().optional(),
    attachPrompt: zod_1.z.string().optional(),
});
exports.textFieldExtractInfoAIConfigSchema = exports.commonFieldAIConfig.extend({
    type: zod_1.z.literal(FieldAIActionType.Extraction),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.textFieldSummarizeAIConfigSchema = exports.commonFieldAIConfig.extend({
    type: zod_1.z.literal(FieldAIActionType.Summary),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.textFieldTranslateAIConfigSchema = exports.commonFieldAIConfig.extend({
    type: zod_1.z.literal(FieldAIActionType.Translation),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
    targetLanguage: zod_1.z.string(),
});
exports.textFieldImproveTextAIConfigSchema = exports.commonFieldAIConfig.extend({
    type: zod_1.z.literal(FieldAIActionType.Improvement),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.textFieldCustomizeAIConfigSchema = exports.commonFieldAIConfig.extend({
    type: zod_1.z.literal(FieldAIActionType.Customization),
    attachmentFieldIds: zod_1.z.array(zod_1.z.string().startsWith(utils_1.IdPrefix.Field)).optional(),
    prompt: zod_1.z
        .string()
        .describe(`The prompt to use for the AI operation, use {fieldId} to reference the field in the table, example: "Summarize the content of {fieldId} into 100 words"\n` +
        `But if your reference field is attachment, do not reference it here, just put it in attachmentFieldIds the AI will known it`),
});
exports.textFieldAIConfigSchema = zod_1.z.union([
    exports.textFieldExtractInfoAIConfigSchema,
    exports.textFieldSummarizeAIConfigSchema,
    exports.textFieldTranslateAIConfigSchema,
    exports.textFieldImproveTextAIConfigSchema,
    exports.textFieldCustomizeAIConfigSchema,
]);
