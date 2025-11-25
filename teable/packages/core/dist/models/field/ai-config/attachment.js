"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentFieldAIConfigSchema = exports.attachmentFieldCustomizeAIConfigSchema = exports.attachmentFieldGenerateImageAIConfigSchema = exports.attachmentFieldAIConfigBaseSchema = exports.ImageQuality = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
const text_1 = require("./text");
var ImageQuality;
(function (ImageQuality) {
    ImageQuality["Low"] = "low";
    ImageQuality["Medium"] = "medium";
    ImageQuality["High"] = "high";
})(ImageQuality || (exports.ImageQuality = ImageQuality = {}));
exports.attachmentFieldAIConfigBaseSchema = text_1.commonFieldAIConfig.extend({
    n: zod_1.z.number().min(1).max(10).optional(),
    size: zod_1.z
        .string()
        .regex(/^\d+x\d+$/, { message: 'Size must be in "widthxheight" format, e.g., "1024x1024"' })
        .optional(),
    quality: zod_1.z.nativeEnum(ImageQuality).optional(),
});
exports.attachmentFieldGenerateImageAIConfigSchema = exports.attachmentFieldAIConfigBaseSchema.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.ImageGeneration),
    sourceFieldId: zod_1.z.string().startsWith(utils_1.IdPrefix.Field),
});
exports.attachmentFieldCustomizeAIConfigSchema = exports.attachmentFieldAIConfigBaseSchema.extend({
    type: zod_1.z.literal(text_1.FieldAIActionType.Customization),
    prompt: zod_1.z.string(),
    attachmentFieldIds: zod_1.z.array(zod_1.z.string().startsWith(utils_1.IdPrefix.Field)).optional(),
});
exports.attachmentFieldAIConfigSchema = zod_1.z.union([
    exports.attachmentFieldGenerateImageAIConfigSchema.strict(),
    exports.attachmentFieldCustomizeAIConfigSchema.strict(),
]);
