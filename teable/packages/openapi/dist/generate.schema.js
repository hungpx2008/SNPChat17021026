"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenApiDocumentation = void 0;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const openapi_snippet_1 = __importDefault(require("./openapi-snippet"));
const utils_1 = require("./utils");
function registerRoutes(filters) {
    const registry = new zod_to_openapi_1.OpenAPIRegistry();
    const routeObjList = (0, utils_1.getRoutes)();
    let filteredRoutes = routeObjList;
    if (filters?.tags?.length) {
        filteredRoutes = filteredRoutes.filter((route) => route.tags && route.tags.some((tag) => filters.tags.includes(tag)));
    }
    if (filters?.paths?.length) {
        filteredRoutes = filteredRoutes.filter((route) => route.path && filters.paths.includes(route.path));
    }
    if (filters?.methods?.length) {
        filteredRoutes = filteredRoutes.filter((route) => route.method && filters.methods.includes(route.method));
    }
    for (const routeObj of filteredRoutes) {
        const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
            type: 'http',
            scheme: 'bearer',
        });
        if (routeObj.path && !routeObj.path.startsWith('/')) {
            throw new Error('Path should start with /: ' + routeObj.path);
        }
        registry.registerPath({ ...routeObj, security: [{ [bearerAuth.name]: [] }] });
    }
    return registry;
}
async function generateCodeSamples(document) {
    const routes = (0, utils_1.getRoutes)();
    const langs = ['shell', 'javascript_fetch', 'node', 'python'];
    const targetTitle = {
        shell: 'Shell',
        javascript_fetch: 'JavaScript',
        node: 'Node.js',
        python: 'Python',
    };
    for (const route of routes) {
        const generated = openapi_snippet_1.default.getEndpointSnippets(document, route.path, route.method, langs);
        const path = document.paths?.[route.path][route.method];
        if (path) {
            path['x-codeSamples'] = [];
            for (const [index, snippet] of generated.snippets.entries()) {
                const id = snippet.id;
                if (targetTitle[id]) {
                    path['x-codeSamples'][index] = {
                        lang: targetTitle[id],
                        source: await snippet.content,
                    };
                }
            }
        }
    }
}
async function getOpenApiDocumentation(config) {
    const { origin, snippet, tags, paths, methods } = config;
    if (!origin && snippet) {
        throw new Error('origin is required when snippets is true, generateCodeSamples need origin');
    }
    const registry = registerRoutes({ tags, paths, methods });
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
    const document = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Teable App',
            description: `Manage Data as easy as drink a cup of tea`,
        },
        servers: [{ url: origin + '/api' }],
    });
    if (snippet) {
        await generateCodeSamples(document);
    }
    return document;
}
exports.getOpenApiDocumentation = getOpenApiDocumentation;
