"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonFieldOptionsSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../../utils");
const colors_1 = require("../colors");
exports.buttonFieldOptionsSchema = zod_1.z.object({
    label: zod_1.z.string().openapi({ description: 'Button label' }),
    color: zod_1.z.nativeEnum(colors_1.Colors).openapi({ description: 'Button color' }),
    maxCount: zod_1.z.number().optional().openapi({ description: 'Max count of button clicks' }),
    resetCount: zod_1.z.boolean().optional().openapi({ description: 'Reset count' }),
    workflow: zod_1.z
        .object({
        id: zod_1.z
            .string()
            .startsWith(utils_1.IdPrefix.Workflow)
            .optional()
            .openapi({ description: 'Workflow ID' }),
        name: zod_1.z.string().optional().openapi({ description: 'Workflow Name' }),
        isActive: zod_1.z.boolean().optional().openapi({ description: 'Workflow is active' }),
    })
        .optional()
        .nullable()
        .openapi({ description: 'Workflow' }),
});
