"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginViewOptionSchema = void 0;
const zod_1 = require("../../../zod");
exports.pluginViewOptionSchema = zod_1.z
    .object({
    pluginId: zod_1.z.string().openapi({ description: 'The plugin id' }),
    pluginInstallId: zod_1.z.string().openapi({ description: 'The plugin install id' }),
    pluginLogo: zod_1.z.string().openapi({ description: 'The plugin logo' }),
})
    .strict();
