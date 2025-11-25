"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios = exports.configApi = exports.createAxios = void 0;
const core_1 = require("@teable/core");
const axios_1 = __importDefault(require("axios"));
const createAxios = () => {
    const axios = axios_1.default.create({
        baseURL: '/api',
    });
    axios.interceptors.response.use((response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    }, (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const { data, status } = error?.response || {};
        throw new core_1.HttpError(data || error?.message || 'no response from server', status || 500);
    });
    return axios;
};
exports.createAxios = createAxios;
const axios = (0, exports.createAxios)();
exports.axios = axios;
/**
 * Configures the Axios instance with the provided options.
 * @param config - Configuration options
 */
const configApi = (config) => {
    const { token, enableUndoRedo, endpoint = 'https://app.teable.ai' } = config;
    if (!token) {
        throw new Error(`token is required, visit ${endpoint}/setting/personal-access-token to get one`);
    }
    axios.defaults.baseURL = `${endpoint}/api`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Add windowId for undo/redo functionality if enabled
    if (enableUndoRedo) {
        const windowId = (0, core_1.generateWindowId)();
        axios.defaults.headers.common['X-Window-Id'] = windowId;
    }
    return axios;
};
exports.configApi = configApi;
