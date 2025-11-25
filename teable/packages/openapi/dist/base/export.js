"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBase = exports.ExportBaseRoute = exports.BaseJsonSchema = exports.pluginJsonSchema = exports.viewPluginJsonSchema = exports.pluginPanelJsonSchema = exports.dashboardJsonSchema = exports.pluginInstallJsonSchema = exports.tableJsonSchema = exports.fieldJsonSchema = exports.viewJsonSchema = exports.EXPORT_BASE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const plugin_1 = require("../plugin");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.EXPORT_BASE = '/base/{baseId}/export';
exports.viewJsonSchema = core_1.viewVoSchema
    .pick({
    id: true,
    name: true,
    description: true,
    type: true,
    sort: true,
    filter: true,
    group: true,
    options: true,
    order: true,
    columnMeta: true,
    shareMeta: true,
    enableShare: true,
    shareId: true,
    isLocked: true,
})
    .extend({
    tableId: zod_1.z.string().startsWith(core_1.IdPrefix.Table).openapi({
        description: 'The id of the table.',
    }),
});
exports.fieldJsonSchema = core_1.fieldVoSchema
    .pick({
    id: true,
    name: true,
    description: true,
    type: true,
    options: true,
    dbFieldName: true,
    notNull: true,
    unique: true,
    isPrimary: true,
    hasError: true,
    isLookup: true,
    meta: true,
    isConditionalLookup: true,
    lookupOptions: true,
    dbFieldType: true,
    aiConfig: true,
    cellValueType: true,
    isMultipleCellValue: true,
})
    .extend({
    createdTime: zod_1.z.string().datetime().openapi({
        description: 'The create time of the field.',
    }),
    order: zod_1.z.number().openapi({
        description: 'The order of the field.',
    }),
});
exports.tableJsonSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.Table).openapi({
        description: 'The id of table.',
    }),
    name: zod_1.z.string().openapi({
        description: 'The name of the table.',
    }),
    description: zod_1.z.string().optional().openapi({
        description: 'The description of the table.',
    }),
    icon: zod_1.z.string().emoji().optional().openapi({
        description: 'The emoji icon string of the table.',
    }),
    order: zod_1.z.number(),
    fields: exports.fieldJsonSchema.array(),
    views: exports.viewJsonSchema.array(),
});
exports.pluginInstallJsonSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.PluginInstall).openapi({
        description: 'The id of the plugin install.',
    }),
    pluginId: zod_1.z.string().startsWith(core_1.IdPrefix.Plugin).openapi({
        description: 'The id of the plugin.',
    }),
    position: zod_1.z.nativeEnum(plugin_1.PluginPosition).openapi({
        description: 'The position of the plugin.',
    }),
    name: zod_1.z.string().openapi({
        description: 'The name of the plugin.',
    }),
    storage: dashboard_1.pluginInstallStorageSchema,
});
exports.dashboardJsonSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.Dashboard).openapi({
        description: 'The id of dashboard.',
    }),
    name: zod_1.z.string().openapi({
        description: 'The name of the dashboard.',
    }),
    layout: zod_1.z.string().nullable(),
    pluginInstall: exports.pluginInstallJsonSchema
        .extend({
        positionId: zod_1.z.string().startsWith(core_1.IdPrefix.Dashboard).openapi({
            description: 'The id of the dashboard.',
        }),
    })
        .array(),
});
exports.pluginPanelJsonSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.PluginPanel).openapi({
        description: 'The id of the plugin panel.',
    }),
    name: zod_1.z.string().openapi({
        description: 'The name of the plugin panel.',
    }),
    tableId: zod_1.z.string().startsWith(core_1.IdPrefix.Table).openapi({
        description: 'The table id of the plugin panel.',
    }),
    layout: zod_1.z.string().nullable(),
    pluginInstall: exports.pluginInstallJsonSchema
        .extend({
        positionId: zod_1.z.string().startsWith(core_1.IdPrefix.PluginPanel).openapi({
            description: 'The id of the panel positionId.',
        }),
    })
        .array(),
});
exports.viewPluginJsonSchema = exports.viewJsonSchema.extend({
    pluginId: zod_1.z.string().startsWith(core_1.IdPrefix.Plugin).openapi({
        description: 'The id of the plugin.',
    }),
    pluginInstall: exports.pluginInstallJsonSchema.extend({
        positionId: zod_1.z.string().startsWith(core_1.IdPrefix.View).openapi({
            description: 'The id of the view positionId.',
        }),
    }),
});
exports.pluginJsonSchema = zod_1.z.object({
    [plugin_1.PluginPosition.Dashboard]: exports.dashboardJsonSchema.array(),
    [plugin_1.PluginPosition.Panel]: exports.pluginPanelJsonSchema.array(),
    [plugin_1.PluginPosition.View]: exports.viewPluginJsonSchema.array(),
});
exports.BaseJsonSchema = zod_1.z.object({
    name: zod_1.z.string(),
    icon: zod_1.z.string().nullable(),
    tables: exports.tableJsonSchema.array(),
    plugins: exports.pluginJsonSchema,
    version: zod_1.z.string(),
});
exports.ExportBaseRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.EXPORT_BASE,
    description: 'export a base by baseId',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            includeData: zod_1.z.boolean().optional().default(true),
        }),
    },
    responses: {
        200: {
            description: 'export successfully',
        },
    },
    tags: ['base'],
});
const exportBase = async (baseId, options) => {
    const includeData = options?.includeData ?? true;
    return await axios_1.axios.get((0, utils_1.urlBuilder)(exports.EXPORT_BASE, {
        baseId,
    }), {
        params: {
            includeData,
        },
    });
};
exports.exportBase = exportBase;
