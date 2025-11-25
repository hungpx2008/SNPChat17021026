import { useEffect, useState } from 'react';
import { PluginBridge } from '../bridge';
// eslint-disable-next-line @typescript-eslint/naming-convention
let bridge_s;
export const usePluginBridge = () => {
    const [bridge, setBridge] = useState(bridge_s);
    useEffect(() => {
        if (bridge_s) {
            return;
        }
        const pluginBridge = new PluginBridge();
        pluginBridge.init().then((bridge) => {
            setBridge(bridge);
            bridge_s = bridge;
        });
        return () => {
            pluginBridge.destroy();
        };
    }, []);
    return bridge;
};
