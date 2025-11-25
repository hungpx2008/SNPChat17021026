import { connectToParent } from 'penpal';
export class PluginBridge {
    connection;
    bridge;
    listeners = {};
    constructor() {
        const methods = {
            syncUIConfig: (uiConfig) => {
                this.listeners.syncUIConfig?.forEach((cb) => cb(uiConfig));
            },
            syncBasePermissions: (basePermissions) => {
                this.listeners.syncBasePermissions?.forEach((cb) => cb(basePermissions));
            },
            syncSelection: (selection) => {
                this.listeners.syncSelection?.forEach((cb) => cb(selection));
            },
            syncUrlParams: (urlParams) => {
                this.listeners.syncUrlParams?.forEach((cb) => cb(urlParams));
            },
        };
        this.connection = connectToParent({
            // Methods child is exposing to parent.
            methods: methods,
        });
    }
    async init() {
        this.bridge = await this.connection.promise;
        return {
            ...this.bridge,
            on: this.on.bind(this),
            removeListener: this.removeListener.bind(this),
            removeAllListeners: this.removeAllListeners.bind(this),
            destroy: this.destroy.bind(this),
        };
    }
    on(event, callback) {
        const callbacks = this.listeners[event];
        if (callbacks?.some((cb) => cb === callback)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listeners[event] = callbacks ? [...callbacks, callback] : [callback];
    }
    removeListener(event, listener) {
        const callbacks = this.listeners[event];
        if (!callbacks) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listeners[event] = callbacks.filter((cb) => cb !== listener);
    }
    removeAllListeners(event) {
        if (!event) {
            this.listeners = {};
        }
        else {
            delete this.listeners[event];
        }
    }
    destroy() {
        this.connection.destroy();
    }
}
export const initializeBridge = async () => {
    if (typeof window === 'undefined') {
        return;
    }
    const pluginBridge = new PluginBridge();
    const bridge = await pluginBridge.init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window._teable_plugin_bridge = bridge;
    return bridge;
};
