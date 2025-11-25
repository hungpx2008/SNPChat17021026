"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginInstallStorageSchema = exports.dashboardPluginItemSchema = exports.dashboardLayoutSchema = void 0;
const zod_1 = require("../zod");
exports.dashboardLayoutSchema = zod_1.z.array(zod_1.z.object({
    pluginInstallId: zod_1.z.string(),
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    w: zod_1.z.number(),
    h: zod_1.z.number(),
}));
exports.dashboardPluginItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
    url: zod_1.z.string().optional(),
});
exports.pluginInstallStorageSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown());
