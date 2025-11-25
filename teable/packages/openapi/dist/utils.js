"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = exports.registerRoute = exports.urlBuilder = void 0;
const urlBuilder = (url, pathParams) => {
    if (!pathParams) {
        return url;
    }
    Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    });
    return url;
};
exports.urlBuilder = urlBuilder;
const routes = [];
const registerRoute = (route) => {
    routes.push(route);
    return route;
};
exports.registerRoute = registerRoute;
const getRoutes = () => {
    return routes;
};
exports.getRoutes = getRoutes;
