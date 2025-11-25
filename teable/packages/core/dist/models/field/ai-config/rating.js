"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingFieldAIConfigSchema = exports.ratingFieldCustomizeAIConfigSchema = exports.ratingFieldRatingAIConfigSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
const text_1 = require("./text");
exports.ratingFieldRatingAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Rating),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.ratingFieldCustomizeAIConfigSchema = text_1.commonFieldAIConfig.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Customization),
    attachmentFieldIds: zod_1.z.array(zod_1.z.string().startsWith(utils_1.IdPrefix.Field)).optional(),
    prompt: zod_1.z.string(),
});
exports.ratingFieldAIConfigSchema = zod_1.z.union([
    exports.ratingFieldRatingAIConfigSchema.strict(),
    exports.ratingFieldCustomizeAIConfigSchema.strict(),
]);
