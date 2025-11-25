"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginConfigSchema = exports.pluginCreatedBySchema = exports.pluginUserSchema = exports.PluginStatus = exports.PluginPosition = exports.pluginI18nSchema = exports.pluginI18nJsonSchema = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("../zod");
exports.pluginI18nJsonSchema = zod_1.z.lazy(() => zod_1.z.record(zod_1.z.string(), zod_1.z.union([zod_1.z.string(), exports.pluginI18nJsonSchema])));
exports.pluginI18nSchema = zod_1.z.record(zod_1.z.enum(core_1.LOCALES), exports.pluginI18nJsonSchema).openapi({
    type: 'object',
    example: {
        en: {
            title: 'Plugin title',
            description: 'Plugin description',
        },
        zh: {
            title: '插件标题',
            description: '插件描述',
        },
    },
});
var PluginPosition;
(function (PluginPosition) {
    PluginPosition["Dashboard"] = "dashboard";
    PluginPosition["View"] = "view";
    PluginPosition["ContextMenu"] = "contextMenu";
    PluginPosition["Panel"] = "panel";
})(PluginPosition || (exports.PluginPosition = PluginPosition = {}));
var PluginStatus;
(function (PluginStatus) {
    PluginStatus["Developing"] = "developing";
    PluginStatus["Reviewing"] = "reviewing";
    PluginStatus["Published"] = "published";
})(PluginStatus || (exports.PluginStatus = PluginStatus = {}));
exports.pluginUserSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    avatar: zod_1.z.string().optional(),
})
    .optional();
exports.pluginCreatedBySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    avatar: zod_1.z.string().optional(),
});
exports.pluginConfigSchema = zod_1.z
    .object({
    [PluginPosition.ContextMenu]: zod_1.z
        .object({
        width: zod_1.z.number().or(zod_1.z.string()),
        height: zod_1.z.number().or(zod_1.z.string()),
        x: zod_1.z.number().or(zod_1.z.string()),
        y: zod_1.z.number().or(zod_1.z.string()),
        frozenResize: zod_1.z.boolean().optional(),
        frozenDrag: zod_1.z.boolean().optional(),
    })
        .partial(),
    [PluginPosition.View]: zod_1.z.null(),
    [PluginPosition.Dashboard]: zod_1.z.null(),
    [PluginPosition.Panel]: zod_1.z.null(),
})
    .partial()
    .superRefine((data, ctx) => {
    const keys = Object.keys(data);
    const res = zod_1.z.array(zod_1.z.nativeEnum(PluginPosition)).safeParse(keys);
    if (!res.success) {
        res.error.issues.forEach((issue) => {
            ctx.addIssue(issue);
        });
    }
});
